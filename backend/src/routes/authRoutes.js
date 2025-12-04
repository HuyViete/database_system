import express from 'express';
import { signup, login, monitorLogin, refreshToken, logout } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/monitor-login', monitorLogin);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

export default router;
