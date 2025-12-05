import express from 'express';
import { getBoards, createBoard, getBoard, updateBoard } from '../controllers/boardController.js';
import { protectedRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protectedRoute); // Protect all board routes

router.get('/', getBoards);
router.post('/', createBoard);
router.get('/:id', getBoard);
router.put('/:id', updateBoard);

export default router;
