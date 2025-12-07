import { pool } from "../libs/db.js"
import mssql from 'mssql'

export async function getLabelsByBoardId(boardId) {
    const result = await pool.request()
        .input('boardId', mssql.VarChar, boardId)
        .query('SELECT * FROM Label WHERE board_id = @boardId');
    return result.recordset;
}

export async function createLabel(boardId, name, color) {
    const result = await pool.request()
        .input('boardId', mssql.VarChar, boardId)
        .input('name', mssql.NVarChar, name)
        .input('color', mssql.VarChar, color)
        .query(`
            INSERT INTO Label (board_id, name, color)
            OUTPUT INSERTED.*
            VALUES (@boardId, @name, @color)
        `);
    return result.recordset[0];
}

export async function updateLabel(labelId, name, color) {
    const result = await pool.request()
        .input('labelId', mssql.VarChar, labelId)
        .input('name', mssql.NVarChar, name)
        .input('color', mssql.VarChar, color)
        .query(`
            UPDATE Label
            SET name = @name, color = @color
            OUTPUT INSERTED.*
            WHERE label_id = @labelId
        `);
    return result.recordset[0];
}

export async function deleteLabel(labelId) {
    const result = await pool.request()
        .input('labelId', mssql.VarChar, labelId)
        .query('DELETE FROM Label WHERE label_id = @labelId');
    return result.rowsAffected[0] > 0;
}

export async function createDefaultLabels(transaction, boardId) {
    const request = new mssql.Request(transaction);
    await request
        .input('boardId', mssql.VarChar, boardId)
        .query(`
            INSERT INTO Label (board_id, name, color) VALUES 
            (@boardId, '', '#61bd4f'),
            (@boardId, '', '#f2d600'),
            (@boardId, '', '#ff9f1a'),
            (@boardId, '', '#eb5a46'),
            (@boardId, '', '#c377e0'),
            (@boardId, '', '#00c2e0')
        `);
}

export async function getLabelsByCardId(cardId) {
    const result = await pool.request()
        .input('cardId', mssql.VarChar, cardId)
        .query(`
            SELECT l.* 
            FROM Label l
            JOIN Card_Label cl ON l.label_id = cl.label_id
            WHERE cl.card_id = @cardId
        `);
    return result.recordset;
}

export async function checkLabelOnCard(cardId, labelId) {
    const result = await pool.request()
        .input('cardId', mssql.VarChar, cardId)
        .input('labelId', mssql.VarChar, labelId)
        .query('SELECT * FROM Card_Label WHERE card_id = @cardId AND label_id = @labelId');
    return result.recordset.length > 0;
}

export async function addLabelToCard(cardId, labelId) {
    await pool.request()
        .input('cardId', mssql.VarChar, cardId)
        .input('labelId', mssql.VarChar, labelId)
        .query('INSERT INTO Card_Label (card_id, label_id) VALUES (@cardId, @labelId)');
}

export async function removeLabelFromCard(cardId, labelId) {
    const result = await pool.request()
        .input('cardId', mssql.VarChar, cardId)
        .input('labelId', mssql.VarChar, labelId)
        .query('DELETE FROM Card_Label WHERE card_id = @cardId AND label_id = @labelId');
    return result.rowsAffected[0] > 0;
}
