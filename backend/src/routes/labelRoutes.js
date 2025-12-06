import express from 'express';
import { 
    getBoardLabels, 
    createLabel, 
    updateLabel, 
    deleteLabel, 
    getCardLabels, 
    addLabelToCard, 
    removeLabelFromCard 
} from '../controllers/labelController.js';
import { protectedRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/board/:boardId', protectedRoute, getBoardLabels);
router.post('/board/:boardId', protectedRoute, createLabel);
router.put('/:labelId', protectedRoute, updateLabel);
router.delete('/:labelId', protectedRoute, deleteLabel);

router.get('/card/:cardId', protectedRoute, getCardLabels);
router.post('/card/:cardId/:labelId', protectedRoute, addLabelToCard);
router.delete('/card/:cardId/:labelId', protectedRoute, removeLabelFromCard);

export default router;
