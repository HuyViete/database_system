import express from 'express';
import * as invitationController from '../controllers/invitationController.js';
import { protectedRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protectedRoute);

router.post('/workspaces/:workspaceId/invitations', invitationController.createInvitation);
router.get('/workspaces/:workspaceId/invitations', invitationController.getInvitations);

export default router;
