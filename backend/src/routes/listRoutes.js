import express from 'express';
import { createList, updateList, deleteList } from '../controllers/listController.js';
import { updateListOrder } from '../controllers/listOrderController.js';
import { protectedRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protectedRoute);
router.post('/', createList);
router.put('/:id', updateList);
router.delete('/:id', deleteList);
router.put('/:id/reorder', updateListOrder);

export default router;
