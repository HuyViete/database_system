import mssql from 'mssql';
import { pool } from '../libs/db.js';

export const createCard = async (req, res) => {
    const { listId, name } = req.body;
    
    try {
        // Get max position
        const posResult = await pool.request()
            .input('listId', mssql.UniqueIdentifier, listId)
            .query(`SELECT ISNULL(MAX(position), -1) + 1 as nextPos FROM Card WHERE list_id = @listId`);
            
        const nextPos = posResult.recordset[0].nextPos;
        
        const result = await pool.request()
            .input('listId', mssql.UniqueIdentifier, listId)
            .input('name', mssql.NVarChar, name)
            .input('position', mssql.Int, nextPos)
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
