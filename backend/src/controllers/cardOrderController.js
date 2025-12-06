import * as CardModel from '../models/Card.js';

export const updateCardOrder = async (req, res) => {
    const { id } = req.params;
    const { listId, position } = req.body;
    
    try {
        const updatedCard = await CardModel.updateCardPosition(id, listId, position);
            
        if (!updatedCard) {
            return res.status(404).json({ message: 'Card not found' });
        }
        
        res.json(updatedCard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating card order' });
    }
};
