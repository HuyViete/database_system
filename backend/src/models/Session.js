import { pool } from '../libs/db.js'
import mssql from 'mssql'

export async function createSession(userId, token, expiresAt, ipAddress, userAgent) {
    await pool.request()
        .input('userId', mssql.UniqueIdentifier, userId)
        .input('token', mssql.VarChar, token)
        .input('expiresAt', mssql.DateTime2, expiresAt)
        .input('ipAddress', mssql.VarChar, ipAddress)
        .input('userAgent', mssql.VarChar, userAgent)
        .query(`
            INSERT INTO Sessions (user_id, refresh_token, expires_at, ip_address, user_agent)
            VALUES (@userId, @token, @expiresAt, @ipAddress, @userAgent)
        `);
}

export async function getSessionByToken(token) {
    const result = await pool.request()
        .input('token', mssql.VarChar, token)
        .query('SELECT * FROM Sessions WHERE refresh_token = @token AND is_revoked = 0 AND expires_at > GETDATE()');
    return result.recordset[0];
}

export async function revokeSession(token) {
    await pool.request()
        .input('token', mssql.VarChar, token)
        .query('UPDATE Sessions SET is_revoked = 1 WHERE refresh_token = @token');
}

export async function revokeAllUserSessions(userId) {
    await pool.request()
        .input('userId', mssql.UniqueIdentifier, userId)
        .query('UPDATE Sessions SET is_revoked = 1 WHERE user_id = @userId');
}