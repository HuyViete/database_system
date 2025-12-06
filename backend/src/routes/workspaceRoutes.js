import express from 'express';
import { getWorkspaceMembers } from '../controllers/workspaceController.js';
import { protectedRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:workspaceId/members', protectedRoute, getWorkspaceMembers);

export default router;
