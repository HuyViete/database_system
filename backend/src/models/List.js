import { pool } from "../libs/db.js"
import mssql from 'mssql'

export async function createList(boardId, name) {
    const result = await pool.request()
        .input('boardId', mssql.VarChar, boardId)
        .input('name', mssql.NVarChar, name)
        .query(`
            DECLARE @NewPosition FLOAT;
            SELECT @NewPosition = ISNULL(MAX(position) + 1, 0) 
            FROM List 
            WHERE board_id = @boardId;

            INSERT INTO List (board_id, name, position)
            OUTPUT INSERTED.*
            VALUES (@boardId, @name, @NewPosition);
        `);
    return result.recordset[0];
}

export async function createDefaultLists(transaction, boardId) {
    const request = new mssql.Request(transaction);
    await request
        .input('boardId', mssql.VarChar, boardId)
        .query(`
            INSERT INTO List (board_id, name, position) VALUES 
            (@boardId, 'To Do', 0),
            (@boardId, 'Doing', 1),
            (@boardId, 'Done', 2)
        `);
}

export async function getListsByBoardId(boardId) {
    const result = await pool.request()
        .input('boardId', mssql.VarChar, boardId)
        .query(`
            SELECT * FROM List 
            WHERE board_id = @boardId 
            ORDER BY position ASC
        `);
    return result.recordset;
}

export async function updateList(listId, name) {
    const result = await pool.request()
        .input('listId', mssql.VarChar, listId)
        .input('name', mssql.NVarChar, name)
        .query(`
            UPDATE List
            SET name = @name, time_updated = GETDATE()
            OUTPUT INSERTED.*
            WHERE list_id = @listId
        `);
    return result.recordset[0];
}

export async function deleteList(listId) {
    // First delete all cards in the list
    await pool.request()
        .input('listId', mssql.VarChar, listId)
        .query('DELETE FROM Card WHERE list_id = @listId');

    const result = await pool.request()
        .input('listId', mssql.VarChar, listId)
        .query('DELETE FROM List WHERE list_id = @listId');
    return result.rowsAffected[0] > 0;
}

export async function updateListPosition(listId, position) {
    const result = await pool.request()
        .input('listId', mssql.VarChar, listId)
        .input('position', mssql.Float, position)
        .query(`
            UPDATE List 
            SET position = @position, time_updated = GETDATE()
            OUTPUT INSERTED.*
            WHERE list_id = @listId
        `);
    return result.recordset[0];
}
