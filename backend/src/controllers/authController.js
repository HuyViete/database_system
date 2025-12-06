import mssql from 'mssql';
import { pool } from '../libs/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import * as UserModel from '../models/User.js';
import * as SessionModel from '../models/Session.js';
import * as MonitorModel from '../models/Monitor.js';

export const signup = async (req, res) => {
    const { username, firstName, lastName, email, password, birthDate } = req.body;
    const transaction = new mssql.Transaction(pool);
    
    try {
        await transaction.begin();
        
        const check = await UserModel.checkUserExists(username, email);
            
        if (check.userCount > 0) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Username already exists' });
        }
        if (check.emailCount > 0) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const userId = await UserModel.createUser(transaction, username, firstName, lastName, birthDate);
        await UserModel.createMember(transaction, userId, email, hashedPassword, 'active');
            
        await transaction.commit();
        
        res.status(201).json({ message: 'User created successfully', userId });
        
    } catch (error) {
        if (transaction._aborted === false) {
             await transaction.rollback();
        }
        console.error(error);
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip;
    
    try {
        const user = await UserModel.getUserByEmail(email);
            
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        await UserModel.updateLastLogin(user.user_id);
        
        const accessToken = jwt.sign(
            { id: user.user_id, username: user.username, type: 'member' },
            process.env.ACCESS_TOKEN_SECRET || 'secret',
            { expiresIn: '15m' }
        );
        
        const refreshToken = crypto.randomBytes(40).toString('hex');
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        
        await SessionModel.createSession(user.user_id, refreshToken, expiresAt, ipAddress, userAgent);
        
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
        res.json({
            accessToken,
            user: {
                id: user.user_id,
                username: user.username,
                firstName: user.first_name,
                lastName: user.last_name,
                type: 'member'
            }
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging in' });
    }
};

export const refresh = async (req, res) => {
    const { refreshToken } = req.cookies;
    
    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token provided' });
    }
    
    try {
        const session = await SessionModel.getSessionByToken(refreshToken);
            
        if (!session) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }
        
        const user = await UserModel.getUserById(session.user_id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const accessToken = jwt.sign(
            { id: user.user_id, username: user.username, type: 'member' },
            process.env.ACCESS_TOKEN_SECRET || 'secret',
            { expiresIn: '15m' }
        );
        
        res.json({ accessToken });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error refreshing token' });
    }
};

export const logout = async (req, res) => {
    const { refreshToken } = req.cookies;
    
    if (refreshToken) {
        try {
            await SessionModel.revokeSession(refreshToken);
        } catch (error) {
            console.error('Error revoking session:', error);
        }
    }
    
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
};
    
export const monitorLogin = async (req, res) => {
    const { token, username } = req.body;
    
    try {
        if (token) {
            const user = await MonitorModel.getMonitorByToken(token);
                
            if (!user) {
                return res.status(404).json({ message: 'Invalid monitor token' });
            }
            
            const jwtToken = jwt.sign({ id: user.user_id, type: 'monitor' }, process.env.ACCESS_TOKEN_SECRET || 'secret', { expiresIn: '7d' });
            
            return res.json({
                token: jwtToken,
                monitorToken: user.token,
                user: {
                    id: user.user_id,
                    username: user.username,
                    type: 'monitor'
                }
            });
        } else {
            const transaction = new mssql.Transaction(pool);
            await transaction.begin();
            
            try {
                const generatedUsername = username || `Monitor_${crypto.randomBytes(4).toString('hex')}`;
                const generatedToken = crypto.randomBytes(20).toString('hex');

                const userId = await UserModel.createUser(transaction, generatedUsername, 'Monitor', 'User', null);
                await MonitorModel.createMonitor(transaction, userId, generatedToken);
                    
                await transaction.commit();
                
                const jwtToken = jwt.sign({ id: userId, type: 'monitor' }, process.env.ACCESS_TOKEN_SECRET || 'secret', { expiresIn: '7d' });
                
                res.status(201).json({
                    token: jwtToken,
                    monitorToken: generatedToken,
                    user: {
                        id: userId,
                        username: generatedUsername,
                        type: 'monitor'
                    }
                });
                
            } catch (err) {
                if (transaction._aborted === false) await transaction.rollback();
                throw err;
            }
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
