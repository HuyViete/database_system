import { pool } from "../libs/db.js"
import mssql from 'mssql'

export async function checkUserExists(username, email) {
    const result = await pool.request()
        .input('username', mssql.VarChar, username)
        .input('email', mssql.VarChar, email)
        .query(`
            SELECT 
                (SELECT COUNT(*) FROM [User] WHERE username = @username) as userCount,
                (SELECT COUNT(*) FROM Member WHERE login_email = @email) as emailCount
        `);
    return result.recordset[0];
}

export async function createUser(transaction, username, firstName, lastName, birthDate) {
    const request = new mssql.Request(transaction);
    const result = await request
        .input('username', mssql.VarChar, username)
        .input('firstName', mssql.NVarChar, firstName)
        .input('lastName', mssql.NVarChar, lastName)
        .input('birthDate', mssql.Date, birthDate || null)
        .query(`
            INSERT INTO [User] (username, first_name, last_name, birth_date)
            OUTPUT INSERTED.user_id
            VALUES (@username, @firstName, @lastName, @birthDate)
        `);
    return result.recordset[0].user_id;
}

export async function createMember(transaction, userId, email, passwordHash, status) {
    const request = new mssql.Request(transaction);
    await request
        .input('memberId', mssql.VarChar, userId)
        .input('email', mssql.VarChar, email)
        .input('passwordHash', mssql.VarChar, passwordHash)
        .input('status', mssql.VarChar, status)
        .query(`
            INSERT INTO Member (member_id, login_email, password_hash, status)
            VALUES (@memberId, @email, @passwordHash, @status)
        `);
}

export async function getUserByEmail(email) {
    const result = await pool.request()
        .input('email', mssql.VarChar, email)
        .query(`
            SELECT u.user_id, u.username, u.first_name, u.last_name, m.password_hash, m.status
            FROM Member m
            JOIN [User] u ON m.member_id = u.user_id
            WHERE m.login_email = @email
        `);
    return result.recordset[0];
}

export async function getUserById(userId) {
    const result = await pool.request()
        .input('userId', mssql.VarChar, userId)
        .query(`
            SELECT u.user_id, u.username, u.first_name, u.last_name, u.avatar_url, m.login_email, u.time_created as joined_date, m.last_login
            FROM [User] u
            JOIN Member m ON u.user_id = m.member_id
            WHERE u.user_id = @userId
        `);
    return result.recordset[0];
}

export async function updateLastLogin(userId) {
    await pool.request()
        .input('userId', mssql.VarChar, userId)
        .query('UPDATE Member SET last_login = GETDATE() WHERE member_id = @userId');
}

