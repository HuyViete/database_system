import express from 'express';
import * as checklistController from '../controllers/checklistController.js';
import { protectedRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protectedRoute);

router.get('/cards/:cardId/checklists', checklistController.getChecklists);
router.post('/cards/:cardId/checklists', checklistController.createChecklist);
router.delete('/checklists/:checklistId', checklistController.deleteChecklist);

router.post('/checklists/:checklistId/items', checklistController.createChecklistItem);
router.put('/items/:itemId', checklistController.updateChecklistItem);
router.delete('/items/:itemId', checklistController.deleteChecklistItem);

export default router;
