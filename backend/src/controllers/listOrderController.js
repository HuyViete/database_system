import * as ListModel from '../models/List.js';

export const updateListOrder = async (req, res) => {
    const { id } = req.params;
    const { position } = req.body;
    
    try {
        const updatedList = await ListModel.updateListPosition(id, position);
            
        if (!updatedList) {
            return res.status(404).json({ message: 'List not found' });
        }
        
        res.json(updatedList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating list order' });
    }
};
