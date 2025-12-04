import express from 'express';
import { signup, login, monitorLogin } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/monitor-login', monitorLogin);

export default router;
