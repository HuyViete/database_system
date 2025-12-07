import { pool } from "../libs/db.js"
import mssql from 'mssql'

export async function createNotification(receiverId, title, message) {
    const result = await pool.request()
        .input('receiverId', mssql.UniqueIdentifier, receiverId)
        .input('title', mssql.NVarChar, title)
        .input('message', mssql.NVarChar, message)
        .query(`
            INSERT INTO Notification (receiver_id, title, message)
            OUTPUT INSERTED.*
            VALUES (@receiverId, @title, @message)
        `);
    return result.recordset[0];
}

export async function getNotificationsByUserId(userId) {
    const result = await pool.request()
        .input('userId', mssql.UniqueIdentifier, userId)
        .query(`
            SELECT * FROM Notification 
            WHERE receiver_id = @userId 
            ORDER BY time_delivered DESC
        `);
    return result.recordset;
}

export async function markAsRead(notiId) {
    await pool.request()
        .input('notiId', mssql.UniqueIdentifier, notiId)
        .query(`
            UPDATE Notification 
            SET is_read = 1, time_read = GETDATE() 
            WHERE noti_id = @notiId
        `);
}

export async function markAllAsRead(userId) {
    await pool.request()
        .input('userId', mssql.UniqueIdentifier, userId)
        .query(`
            UPDATE Notification 
            SET is_read = 1, time_read = GETDATE() 
            WHERE receiver_id = @userId AND is_read = 0
        `);
}
