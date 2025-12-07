import { pool } from "../libs/db.js"
import mssql from 'mssql'

export async function getWorkspaceByMemberId(userId) {
    const result = await pool.request()
        .input('userId', mssql.VarChar, userId)
        .query(`
            SELECT TOP 1 w.*, 
                   dbo.GetWorkspaceCompletionPercent(w.workspace_id) as completion_percent,
                   dbo.GetOverdueCardCountInWorkspace(w.workspace_id) as overdue_count
            FROM Workspace w
            JOIN Workspace_Member wm ON w.workspace_id = wm.workspace_id
            WHERE wm.member_id = @userId
        `);
    return result.recordset[0];
}

export async function createWorkspace(transaction, name, visibility) {
    const request = new mssql.Request(transaction);
    const result = await request
        .input('name', mssql.NVarChar, name)
        .input('visibility', mssql.VarChar, visibility)
        .query(`
            INSERT INTO Workspace (name, visibility)
            OUTPUT INSERTED.workspace_id
            VALUES (@name, @visibility)
        `);
    return result.recordset[0].workspace_id;
}

export async function addWorkspaceMember(transaction, workspaceId, memberId, role) {
    const request = new mssql.Request(transaction);
    await request
        .input('workspaceId', mssql.VarChar, workspaceId)
        .input('memberId', mssql.VarChar, memberId)
        .input('role', mssql.VarChar, role)
        .query(`
            INSERT INTO Workspace_Member (workspace_id, member_id, role)
            VALUES (@workspaceId, @memberId, @role)
        `);
}

export async function getWorkspaceById(workspaceId) {
    const result = await pool.request()
        .input('workspaceId', mssql.VarChar, workspaceId)
        .query(`
            SELECT w.*, 
                   dbo.GetWorkspaceCompletionPercent(w.workspace_id) as completion_percent,
                   dbo.GetOverdueCardCountInWorkspace(w.workspace_id) as overdue_count
            FROM Workspace w 
            WHERE workspace_id = @workspaceId
        `);
    return result.recordset[0];
}

export async function updateWorkspace(workspaceId, name, description, visibility) {
    const request = pool.request()
        .input('workspaceId', mssql.VarChar, workspaceId);
        
    let updateFields = [];
    if (name) {
        request.input('name', mssql.NVarChar, name);
        updateFields.push("name = @name");
    }
    if (description) {
        request.input('description', mssql.NVarChar, description);
        updateFields.push("description = @description");
    }
    if (visibility) {
        request.input('visibility', mssql.VarChar, visibility);
        updateFields.push("visibility = @visibility");
    }
    
    if (updateFields.length === 0) return null;
    
    updateFields.push("time_updated = GETDATE()");
    
    const query = `
        UPDATE Workspace
        SET ${updateFields.join(', ')}
        OUTPUT INSERTED.*
        WHERE workspace_id = @workspaceId
    `;
    
    const result = await request.query(query);
    return result.recordset[0];
}

export async function getWorkspaceMembers(workspaceId) {
    const result = await pool.request()
        .input('workspaceId', mssql.VarChar, workspaceId)
        .query(`
            SELECT 
                u.user_id,
                u.username,
                u.first_name,
                u.last_name,
                u.avatar_url,
                wm.role,
                wm.joined_date,
                m.last_login,
                (SELECT COUNT(*) FROM Board_Member bm WHERE bm.member_id = u.user_id) as board_count
            FROM Workspace_Member wm
            JOIN Member m ON wm.member_id = m.member_id
            JOIN [User] u ON m.member_id = u.user_id
            WHERE wm.workspace_id = @workspaceId
            ORDER BY 
                CASE WHEN wm.role = 'Admin' THEN 0 ELSE 1 END,
                u.first_name
        `);
    return result.recordset;
}

export async function isWorkspaceMember(workspaceId, userId) {
    const result = await pool.request()
        .input('workspaceId', mssql.VarChar, workspaceId)
        .input('userId', mssql.VarChar, userId)
        .query(`
            SELECT 1 FROM Workspace_Member 
            WHERE workspace_id = @workspaceId AND member_id = @userId
        `);
    return result.recordset.length > 0;
}
