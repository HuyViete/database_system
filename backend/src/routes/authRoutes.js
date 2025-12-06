import express from 'express';
import { signup, login, monitorLogin, refresh, logout } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/monitor-login', monitorLogin);
router.post('/refresh-token', refresh);
router.post('/logout', logout);

export default router;
