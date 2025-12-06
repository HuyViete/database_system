import * as CardModel from '../models/Card.js';

export const createCard = async (req, res) => {
    const { listId, name } = req.body;
    
    try {
        const nextPos = await CardModel.getNextCardPosition(listId);
        const newCard = await CardModel.createCard(listId, name, nextPos);
            
        res.status(201).json(newCard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating card' });
    }
};

export const updateCard = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    
    try {
        const updatedCard = await CardModel.updateCard(id, name);
            
        if (!updatedCard) {
            return res.status(404).json({ message: 'Card not found' });
        }
        
        res.json(updatedCard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating card' });
    }
};

export const deleteCard = async (req, res) => {
    const { id } = req.params;
    
    try {
        const success = await CardModel.deleteCard(id);
            
        if (!success) {
            return res.status(404).json({ message: 'Card not found' });
        }
        
        res.json({ message: 'Card deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting card' });
    }
};
