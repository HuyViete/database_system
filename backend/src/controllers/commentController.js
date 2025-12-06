import mssql from 'mssql';
import { pool } from '../libs/db.js';

export const getComments = async (req, res) => {
    const { cardId } = req.params;

    try {
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

        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching comments' });
    }
};

export const createComment = async (req, res) => {
    const { cardId } = req.params;
    const { text } = req.body;
    const memberId = req.user.user_id; // Assuming auth middleware adds user to req

    try {
        const result = await pool.request()
            .input('cardId', mssql.UniqueIdentifier, cardId)
            .input('memberId', mssql.UniqueIdentifier, memberId)
            .input('text', mssql.NVarChar, text)
            .query(`
                INSERT INTO Comment (card_id, member_id, text)
                OUTPUT INSERTED.*
                VALUES (@cardId, @memberId, @text)
            `);

        // Fetch the created comment with user details
        const newCommentId = result.recordset[0].comment_id;
        const commentWithUser = await pool.request()
            .input('commentId', mssql.UniqueIdentifier, newCommentId)
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

        res.status(201).json(commentWithUser.recordset[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating comment' });
    }
};

export const updateComment = async (req, res) => {
    const { commentId } = req.params;
    const { text } = req.body;
    const memberId = req.user.user_id;

    try {
        // Check if comment belongs to user
        const check = await pool.request()
            .input('commentId', mssql.UniqueIdentifier, commentId)
            .query('SELECT member_id FROM Comment WHERE comment_id = @commentId');

        if (check.recordset.length === 0) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (check.recordset[0].member_id !== memberId) {
            return res.status(403).json({ message: 'Not authorized to update this comment' });
        }

        const result = await pool.request()
            .input('commentId', mssql.UniqueIdentifier, commentId)
            .input('text', mssql.NVarChar, text)
            .query(`
                UPDATE Comment
                SET text = @text, is_edited = 1
                OUTPUT INSERTED.*
                WHERE comment_id = @commentId
            `);

        res.json(result.recordset[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating comment' });
    }
};

export const deleteComment = async (req, res) => {
    const { commentId } = req.params;
    const memberId = req.user.user_id;

    try {
        // Check if comment belongs to user
        const check = await pool.request()
            .input('commentId', mssql.UniqueIdentifier, commentId)
            .query('SELECT member_id FROM Comment WHERE comment_id = @commentId');

        if (check.recordset.length === 0) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (check.recordset[0].member_id !== memberId) {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        await pool.request()
            .input('commentId', mssql.UniqueIdentifier, commentId)
            .query('DELETE FROM Comment WHERE comment_id = @commentId');

        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting comment' });
    }
};
