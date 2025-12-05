import express from 'express';
import { createCard, updateCard, deleteCard } from '../controllers/cardController.js';
import { updateCardOrder } from '../controllers/cardOrderController.js';
import { protectedRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protectedRoute);
router.post('/', createCard);
router.put('/:id', updateCard);
router.delete('/:id', deleteCard);
router.put('/:id/reorder', updateCardOrder);

export default router;
