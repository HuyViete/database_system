import { pool } from "../libs/db.js"
import mssql from 'mssql'

export async function createInvitation(inviterId, emailTarget, workspaceId, token) {
    const result = await pool.request()
        .input('inviterId', mssql.VarChar, inviterId)
        .input('emailTarget', mssql.VarChar, emailTarget)
        .input('workspaceId', mssql.VarChar, workspaceId)
        .input('token', mssql.VarChar, token)
        .query(`
            INSERT INTO Invitation (inviter_id, email_target, workspace_id, token, status)
            OUTPUT INSERTED.*
            VALUES (@inviterId, @emailTarget, @workspaceId, @token, 'pending')
        `);
    return result.recordset[0];
}

export async function getInvitationsByWorkspaceId(workspaceId) {
    const result = await pool.request()
        .input('workspaceId', mssql.VarChar, workspaceId)
        .query(`
            SELECT i.*, u.username as inviter_username, u.avatar_url as inviter_avatar
            FROM Invitation i
            JOIN [User] u ON i.inviter_id = u.user_id
            WHERE i.workspace_id = @workspaceId
            ORDER BY i.time_created DESC
        `);
    return result.recordset;
}
