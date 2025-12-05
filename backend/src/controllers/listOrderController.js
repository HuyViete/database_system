import mssql from 'mssql';
import { pool } from '../libs/db.js';

export const updateListOrder = async (req, res) => {
    const { id } = req.params;
    const { position } = req.body;
    
    try {
        const result = await pool.request()
            .input('listId', mssql.UniqueIdentifier, id)
            .input('position', mssql.Float, position)
            .query(`
                UPDATE List
                SET position = @position, time_updated = GETDATE()
                OUTPUT INSERTED.*
                WHERE list_id = @listId
            `);
            
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'List not found' });
        }
        
        res.json(result.recordset[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating list order' });
    }
};
