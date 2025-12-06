import express from 'express';
import { getComments, createComment, updateComment, deleteComment } from '../controllers/commentController.js';
import { protectedRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:cardId', protectedRoute, getComments);
router.post('/:cardId', protectedRoute, createComment);
router.put('/:commentId', protectedRoute, updateComment);
router.delete('/:commentId', protectedRoute, deleteComment);

export default router;
