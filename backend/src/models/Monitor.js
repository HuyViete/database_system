import { pool } from "../libs/db.js"
import mssql from 'mssql'

export async function getMonitorByToken(token) {
    const result = await pool.request()
        .input('token', mssql.VarChar, token)
        .query(`
            SELECT u.user_id, u.username, m.token
            FROM Monitor m
            JOIN [User] u ON m.monitor_id = u.user_id
            WHERE m.token = @token
        `);
    return result.recordset[0];
}

export async function createMonitor(transaction, userId, token) {
    const request = new mssql.Request(transaction);
    await request
        .input('monitorId', mssql.UniqueIdentifier, userId)
        .input('token', mssql.VarChar, token)
        .query(`
            INSERT INTO Monitor (monitor_id, token)
            VALUES (@monitorId, @token)
        `);
}