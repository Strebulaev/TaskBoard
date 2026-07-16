import { Router } from 'express';
import { register, login, logout, refresh } from '../controllers/authController.js';
import { getMe } from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();
router.get('/me', authenticate, getMe);

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refresh);

export default router;
