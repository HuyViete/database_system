import { pool } from "../libs/db.js"
import mssql from 'mssql'

export async function createCard(listId, name, position) {
    const result = await pool.request()
        .input('listId', mssql.VarChar, listId)
        .input('name', mssql.NVarChar, name)
        .input('position', mssql.Float, position)
        .query(`
            INSERT INTO Card (list_id, name, position)
            OUTPUT INSERTED.*
            VALUES (@listId, @name, @position)
        `);
    return result.recordset[0];
}

export async function getNextCardPosition(listId) {
    const result = await pool.request()
        .input('listId', mssql.VarChar, listId)
        .query(`SELECT ISNULL(MAX(position) + 1, 0) as nextPos FROM Card WHERE list_id = @listId`);
    return result.recordset[0].nextPos;
}

export async function updateCard(cardId, name, description, dueDate) {
    const request = pool.request()
        .input('cardId', mssql.VarChar, cardId);
        
    let updateFields = [];
    
    if (name !== undefined) {
        request.input('name', mssql.NVarChar, name);
        updateFields.push("name = @name");
    }
    if (description !== undefined) {
        request.input('description', mssql.NVarChar, description);
        updateFields.push("description = @description");
    }
    if (dueDate !== undefined) {
        request.input('dueDate', mssql.DateTime2, dueDate);
        updateFields.push("due_date = @dueDate");
    }
    
    if (updateFields.length === 0) return null;
    
    const query = `
        UPDATE Card
        SET ${updateFields.join(', ')}
        OUTPUT INSERTED.*
        WHERE card_id = @cardId
    `;
    
    const result = await request.query(query);
    return result.recordset[0];
}

export async function deleteCard(cardId) {
    const result = await pool.request()
        .input('cardId', mssql.VarChar, cardId)
        .query('DELETE FROM Card WHERE card_id = @cardId');
    return result.rowsAffected[0] > 0;
}

export async function getCardsByBoardId(boardId) {
    const result = await pool.request()
        .input('boardId', mssql.VarChar, boardId)
        .query(`
            SELECT c.* 
            FROM Card c
            JOIN List l ON c.list_id = l.list_id
            WHERE l.board_id = @boardId
            ORDER BY c.position ASC
        `);
    return result.recordset;
}

export async function updateCardPosition(cardId, listId, position) {
    const request = pool.request()
        .input('cardId', mssql.VarChar, cardId)
        .input('position', mssql.Float, position);
        
    let query = "UPDATE Card SET position = @position";
    
    if (listId) {
        request.input('listId', mssql.VarChar, listId);
        query += ", list_id = @listId";
    }
    
    query += " OUTPUT INSERTED.* WHERE card_id = @cardId";
    
    const result = await request.query(query);
    return result.recordset[0];
}
