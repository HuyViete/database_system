import mssql from 'mssql';
import { pool } from '../libs/db.js';

export const updateCardOrder = async (req, res) => {
    const { id } = req.params;
    const { listId, position } = req.body;
    
    try {
        const result = await pool.request()
            .input('cardId', mssql.UniqueIdentifier, id)
            .input('listId', mssql.UniqueIdentifier, listId)
            .input('position', mssql.Float, position)
            .query(`
                UPDATE Card
                SET list_id = @listId, position = @position
                OUTPUT INSERTED.*
                WHERE card_id = @cardId
            `);
            
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Card not found' });
        }
        
        res.json(result.recordset[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating card order' });
    }
};
