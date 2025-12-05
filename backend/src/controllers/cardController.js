import mssql from 'mssql';
import { pool } from '../libs/db.js';

export const createCard = async (req, res) => {
    const { listId, name } = req.body;
    
    try {
        // Get max position
        const posResult = await pool.request()
            .input('listId', mssql.UniqueIdentifier, listId)
            .query(`SELECT ISNULL(MAX(position) + 1, 0) as nextPos FROM Card WHERE list_id = @listId`);
            
        const nextPos = posResult.recordset[0].nextPos;
        
        const result = await pool.request()
            .input('listId', mssql.UniqueIdentifier, listId)
            .input('name', mssql.NVarChar, name)
            .input('position', mssql.Float, nextPos)
            .query(`
                INSERT INTO Card (list_id, name, position)
                OUTPUT INSERTED.*
                VALUES (@listId, @name, @position)
            `);
            
        res.status(201).json(result.recordset[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating card' });
    }
};

export const updateCard = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    
    try {
        const result = await pool.request()
            .input('cardId', mssql.UniqueIdentifier, id)
            .input('name', mssql.NVarChar, name)
            .query(`
                UPDATE Card
                SET name = @name
                OUTPUT INSERTED.*
                WHERE card_id = @cardId
            `);
            
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Card not found' });
        }
        
        res.json(result.recordset[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating card' });
    }
};

export const deleteCard = async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await pool.request()
            .input('cardId', mssql.UniqueIdentifier, id)
            .query('DELETE FROM Card WHERE card_id = @cardId');
            
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Card not found' });
        }
        
        res.json({ message: 'Card deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting card' });
    }
};
