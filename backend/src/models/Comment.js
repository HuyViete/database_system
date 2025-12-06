import { pool } from "../libs/db.js"
import mssql from 'mssql'

export async function getCommentsByCardId(cardId) {
    const result = await pool.request()
        .input('cardId', mssql.UniqueIdentifier, cardId)
        .query(`
            SELECT 
                c.comment_id,
                c.text,
                c.time_created,
                c.is_edited,
                u.username,
                u.avatar_url,
                u.first_name,
                u.last_name,
                c.member_id
            FROM Comment c
            JOIN Member m ON c.member_id = m.member_id
            JOIN [User] u ON m.member_id = u.user_id
            WHERE c.card_id = @cardId
            ORDER BY c.time_created DESC
        `);
    return result.recordset;
}

export async function createComment(cardId, memberId, text) {
    const result = await pool.request()
        .input('cardId', mssql.UniqueIdentifier, cardId)
        .input('memberId', mssql.UniqueIdentifier, memberId)
        .input('text', mssql.NVarChar, text)
        .query(`
            INSERT INTO Comment (card_id, member_id, text)
            OUTPUT INSERTED.comment_id
            VALUES (@cardId, @memberId, @text)
        `);
    return result.recordset[0].comment_id;
}

export async function getCommentById(commentId) {
    const result = await pool.request()
        .input('commentId', mssql.UniqueIdentifier, commentId)
        .query(`
            SELECT 
                c.comment_id,
                c.text,
                c.time_created,
                c.is_edited,
                u.username,
                u.avatar_url,
                u.first_name,
                u.last_name,
                c.member_id
            FROM Comment c
            JOIN Member m ON c.member_id = m.member_id
            JOIN [User] u ON m.member_id = u.user_id
            WHERE c.comment_id = @commentId
        `);
    return result.recordset[0];
}

export async function getCommentOwner(commentId) {
    const result = await pool.request()
        .input('commentId', mssql.UniqueIdentifier, commentId)
        .query('SELECT member_id FROM Comment WHERE comment_id = @commentId');
    return result.recordset[0] ? result.recordset[0].member_id : null;
}

export async function updateComment(commentId, text) {
    const result = await pool.request()
        .input('commentId', mssql.UniqueIdentifier, commentId)
        .input('text', mssql.NVarChar, text)
        .query(`
            UPDATE Comment
            SET text = @text, is_edited = 1
            OUTPUT INSERTED.*
            WHERE comment_id = @commentId
        `);
    return result.recordset[0];
}

export async function deleteComment(commentId) {
    const result = await pool.request()
        .input('commentId', mssql.UniqueIdentifier, commentId)
        .query('DELETE FROM Comment WHERE comment_id = @commentId');
    return result.rowsAffected[0] > 0;
}