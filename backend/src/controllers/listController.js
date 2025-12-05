import mssql from 'mssql';
import { pool } from '../libs/db.js';

export const createList = async (req, res) => {
    const { boardId, name } = req.body;
    
    try {
        const result = await pool.request()
            .input('boardId', mssql.UniqueIdentifier, boardId)
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
            
        res.status(201).json({ ...result.recordset[0], cards: [] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating list' });
    }
};

export const updateList = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    
    try {
        const result = await pool.request()
            .input('listId', mssql.UniqueIdentifier, id)
            .input('name', mssql.NVarChar, name)
            .query(`
                UPDATE List
                SET name = @name, time_updated = GETDATE()
                OUTPUT INSERTED.*
                WHERE list_id = @listId
            `);
            
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'List not found' });
        }
        
        res.json(result.recordset[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating list' });
    }
};

export const deleteList = async (req, res) => {
    const { id } = req.params;
    
    try {
        // First delete all cards in the list
        await pool.request()
            .input('listId', mssql.UniqueIdentifier, id)
            .query('DELETE FROM Card WHERE list_id = @listId');

        const result = await pool.request()
            .input('listId', mssql.UniqueIdentifier, id)
            .query('DELETE FROM List WHERE list_id = @listId');
            
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'List not found' });
        }
        
        res.json({ message: 'List deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting list' });
    }
};
