import express from 'express';
import { getBoards, createBoard, getBoard } from '../controllers/boardController.js';
import { protectedRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protectedRoute); // Protect all board routes

router.get('/', getBoards);
router.post('/', createBoard);
router.get('/:id', getBoard);

export default router;
