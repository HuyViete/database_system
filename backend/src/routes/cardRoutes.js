import express from 'express';
import { createCard } from '../controllers/cardController.js';
import { protectedRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protectedRoute);
router.post('/', createCard);

export default router;
