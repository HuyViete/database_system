import { pool } from "../libs/db.js"
import mssql from 'mssql'

export async function getChecklistsByCardId(cardId) {
    const result = await pool.request()
        .input('cardId', mssql.VarChar, cardId)
        .query(`
            SELECT c.*, 
                   (SELECT * FROM ChecklistItem ci WHERE ci.checklist_id = c.checklist_id FOR JSON PATH) as items
            FROM Checklist c
            WHERE c.card_id = @cardId
            ORDER BY c.position ASC
        `);
    
    // Parse JSON items
    return result.recordset.map(checklist => ({
        ...checklist,
        items: checklist.items ? JSON.parse(checklist.items) : []
    }));
}

export async function createChecklist(cardId, name) {
    const result = await pool.request()
        .input('cardId', mssql.VarChar, cardId)
        .input('name', mssql.NVarChar, name)
        .query(`
            INSERT INTO Checklist (card_id, name, position)
            OUTPUT INSERTED.*
            VALUES (@cardId, @name, (SELECT ISNULL(MAX(position), 0) + 1 FROM Checklist WHERE card_id = @cardId))
        `);
    return { ...result.recordset[0], items: [] };
}

export async function deleteChecklist(checklistId) {
    await pool.request()
        .input('checklistId', mssql.VarChar, checklistId)
        .query('DELETE FROM Checklist WHERE checklist_id = @checklistId');
}

export async function createChecklistItem(checklistId, description) {
    const result = await pool.request()
        .input('checklistId', mssql.VarChar, checklistId)
        .input('description', mssql.NVarChar, description)
        .query(`
            INSERT INTO ChecklistItem (checklist_id, description, position)
            OUTPUT INSERTED.*
            VALUES (@checklistId, @description, (SELECT ISNULL(MAX(position), 0) + 1 FROM ChecklistItem WHERE checklist_id = @checklistId))
        `);
    return result.recordset[0];
}

export async function updateChecklistItem(itemId, description, isCompleted) {
    const request = pool.request()
        .input('itemId', mssql.VarChar, itemId);
    
    let updates = [];
    if (description !== undefined) {
        request.input('description', mssql.NVarChar, description);
        updates.push('description = @description');
    }
    if (isCompleted !== undefined) {
        request.input('isCompleted', mssql.Bit, isCompleted);
        updates.push('is_completed = @isCompleted');
    }
    
    if (updates.length === 0) return null;
    
    const query = `
        UPDATE ChecklistItem
        SET ${updates.join(', ')}
        OUTPUT INSERTED.*
        WHERE item_id = @itemId
    `;
    
    const result = await request.query(query);
    return result.recordset[0];
}

export async function deleteChecklistItem(itemId) {
    await pool.request()
        .input('itemId', mssql.VarChar, itemId)
        .query('DELETE FROM ChecklistItem WHERE item_id = @itemId');
}
