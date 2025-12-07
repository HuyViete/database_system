import { pool } from "../libs/db.js"
import mssql from 'mssql'

export async function getBoardsByUserId(userId) {
    const result = await pool.request()
        .input('userId', mssql.UniqueIdentifier, userId)
        .query(`
            SELECT DISTINCT b.* 
            FROM Board b
            LEFT JOIN Board_Member bm ON b.board_id = bm.board_id
            LEFT JOIN Workspace_Member wm ON b.workspace_id = wm.workspace_id
            WHERE 
                bm.member_id = @userId 
                OR (wm.member_id = @userId AND b.visibility = 'workspace')
            ORDER BY b.time_updated DESC
        `);
    return result.recordset;
}

export async function getBoardById(boardId, userId) {
    // Check access
    const accessCheck = await pool.request()
        .input('boardId', mssql.UniqueIdentifier, boardId)
        .input('userId', mssql.UniqueIdentifier, userId)
        .query(`
            SELECT 1 FROM Board_Member WHERE board_id = @boardId AND member_id = @userId
            UNION
            SELECT 1 FROM Board b 
            JOIN Workspace_Member wm ON b.workspace_id = wm.workspace_id
            WHERE b.board_id = @boardId AND wm.member_id = @userId AND b.visibility = 'workspace'
        `);
        
    if (accessCheck.recordset.length === 0) {
        return null;
    }
    
    const result = await pool.request()
        .input('boardId', mssql.UniqueIdentifier, boardId)
        .query('SELECT * FROM Board WHERE board_id = @boardId');
        
    return result.recordset[0];
}

export async function createBoard(transaction, workspaceId, name, visibility, backgroundColor, backgroundImg) {
    const request = new mssql.Request(transaction);
    const result = await request
        .input('workspaceId', mssql.UniqueIdentifier, workspaceId)
        .input('name', mssql.NVarChar, name)
        .input('visibility', mssql.VarChar, visibility)
        .input('backgroundColor', mssql.VarChar, backgroundColor)
        .input('backgroundImg', mssql.VarChar, backgroundImg)
        .query(`
            INSERT INTO Board (workspace_id, name, visibility, background_color, background_img)
            OUTPUT INSERTED.board_id
            VALUES (@workspaceId, @name, @visibility, @backgroundColor, @backgroundImg)
        `);
    return result.recordset[0].board_id;
}

export async function addBoardMember(transaction, boardId, memberId, role) {
    const request = new mssql.Request(transaction);
    await request
        .input('boardId', mssql.UniqueIdentifier, boardId)
        .input('memberId', mssql.UniqueIdentifier, memberId)
        .input('role', mssql.VarChar, role)
        .query(`
            INSERT INTO Board_Member (board_id, member_id, role)
            VALUES (@boardId, @memberId, @role)
        `);
}

export async function updateBoard(boardId, name, visibility, backgroundColor, backgroundImg) {
    const updates = [];
    const request = pool.request().input('boardId', mssql.UniqueIdentifier, boardId);

    if (name !== undefined) {
        request.input('name', mssql.NVarChar, name);
        updates.push('name = @name');
    }
    if (visibility !== undefined) {
        request.input('visibility', mssql.VarChar, visibility);
        updates.push('visibility = @visibility');
    }
    if (backgroundColor !== undefined) {
        request.input('backgroundColor', mssql.VarChar, backgroundColor);
        updates.push('background_color = @backgroundColor');
    }
    if (backgroundImg !== undefined) {
        request.input('backgroundImg', mssql.VarChar, backgroundImg);
        updates.push('background_img = @backgroundImg');
    }

    if (updates.length === 0) return null;

    updates.push('time_updated = GETDATE()');

    const query = `
        UPDATE Board
        SET ${updates.join(', ')}
        OUTPUT INSERTED.*
        WHERE board_id = @boardId
    `;

    const result = await request.query(query);
    return result.recordset[0];
}

export async function deleteBoard(boardId) {
    const result = await pool.request()
        .input('boardId', mssql.UniqueIdentifier, boardId)
        .query('DELETE FROM Board WHERE board_id = @boardId');
    return result.rowsAffected[0] > 0;
}
