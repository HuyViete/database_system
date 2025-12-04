import mssql from 'mssql';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const signup = async (req, res) => {
    const { username, firstName, lastName, email, password, birthDate } = req.body;
    const transaction = new mssql.Transaction();
    
    try {
        await transaction.begin();
        
        // 1. Check if username or email exists (Basic check, DB constraints will also catch this)
        const pool = await mssql.connect();
        const check = await pool.request()
            .input('username', mssql.VarChar, username)
            .input('email', mssql.VarChar, email)
            .query(`
                SELECT 
                    (SELECT COUNT(*) FROM [User] WHERE username = @username) as userCount,
                    (SELECT COUNT(*) FROM Member WHERE login_email = @email) as emailCount
            `);
            
        if (check.recordset[0].userCount > 0) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Username already exists' });
        }
        if (check.recordset[0].emailCount > 0) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // 2. Insert into User
        const userRequest = new mssql.Request(transaction);
        const userResult = await userRequest
            .input('username', mssql.VarChar, username)
            .input('firstName', mssql.NVarChar, firstName)
            .input('lastName', mssql.NVarChar, lastName)
            .input('birthDate', mssql.Date, birthDate || null)
            .query(`
                INSERT INTO [User] (username, first_name, last_name, birth_date)
                OUTPUT INSERTED.user_id
                VALUES (@username, @firstName, @lastName, @birthDate)
            `);
            
        const userId = userResult.recordset[0].user_id;
        
        // 3. Insert into Member
        const memberRequest = new mssql.Request(transaction);
        await memberRequest
            .input('memberId', mssql.UniqueIdentifier, userId)
            .input('email', mssql.VarChar, email)
            .input('passwordHash', mssql.VarChar, hashedPassword)
            .input('status', mssql.VarChar, 'active')
            .query(`
                INSERT INTO Member (member_id, login_email, password_hash, status)
                VALUES (@memberId, @email, @passwordHash, @status)
            `);
            
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
    
    try {
        const pool = await mssql.connect();
        const result = await pool.request()
            .input('email', mssql.VarChar, email)
            .query(`
                SELECT u.user_id, u.username, u.first_name, u.last_name, m.password_hash, m.status
                FROM Member m
                JOIN [User] u ON m.member_id = u.user_id
                WHERE m.login_email = @email
            `);
            
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const user = result.recordset[0];
        
        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ id: user.user_id, type: 'member' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        
        res.json({ 
            token, 
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
        res.status(500).json({ message: 'Server error' });
    }
};

export const monitorLogin = async (req, res) => {
    const { token, username } = req.body;
    
    try {
        const pool = await mssql.connect();
        
        if (token) {
            // Login existing monitor
            const result = await pool.request()
                .input('token', mssql.VarChar, token)
                .query(`
                    SELECT u.user_id, u.username, m.token
                    FROM Monitor m
                    JOIN [User] u ON m.monitor_id = u.user_id
                    WHERE m.token = @token
                `);
                
            if (result.recordset.length === 0) {
                return res.status(404).json({ message: 'Invalid monitor token' });
            }
            
            const user = result.recordset[0];
            const jwtToken = jwt.sign({ id: user.user_id, type: 'monitor' }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
            
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
            // Create new monitor
            const transaction = new mssql.Transaction();
            await transaction.begin();
            
            try {
                const generatedUsername = username || `Monitor_${Math.floor(Math.random() * 100000)}`;
                const generatedToken = crypto.randomBytes(16).toString('hex');
                
                // Insert User
                const userRequest = new mssql.Request(transaction);
                const userResult = await userRequest
                    .input('username', mssql.VarChar, generatedUsername)
                    .input('firstName', mssql.NVarChar, 'Monitor')
                    .input('lastName', mssql.NVarChar, 'User')
                    .query(`
                        INSERT INTO [User] (username, first_name, last_name)
                        OUTPUT INSERTED.user_id
                        VALUES (@username, @firstName, @lastName)
                    `);
                
                const userId = userResult.recordset[0].user_id;
                
                // Insert Monitor
                const monitorRequest = new mssql.Request(transaction);
                await monitorRequest
                    .input('monitorId', mssql.UniqueIdentifier, userId)
                    .input('token', mssql.VarChar, generatedToken)
                    .query(`
                        INSERT INTO Monitor (monitor_id, token)
                        VALUES (@monitorId, @token)
                    `);
                    
                await transaction.commit();
                
                const jwtToken = jwt.sign({ id: userId, type: 'monitor' }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
                
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
