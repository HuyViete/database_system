import * as ListModel from '../models/List.js';

export const createList = async (req, res) => {
    const { boardId, name } = req.body;
    
    try {
        const newList = await ListModel.createList(boardId, name);
        res.status(201).json({ ...newList, cards: [] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating list' });
    }
};

export const updateList = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    
    try {
        const updatedList = await ListModel.updateList(id, name);
            
        if (!updatedList) {
            return res.status(404).json({ message: 'List not found' });
        }
        
        res.json(updatedList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating list' });
    }
};

export const deleteList = async (req, res) => {
    const { id } = req.params;
    
    try {
        const success = await ListModel.deleteList(id);
            
        if (!success) {
            return res.status(404).json({ message: 'List not found' });
        }
        
        res.json({ message: 'List deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting list' });
    }
};
