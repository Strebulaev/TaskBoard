import { Router } from 'express';
import { userController } from '../controllers/userController.js';
import { authenticate } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

router.get('/:id', userController.getById);
router.put('/:id', authenticate, userController.update);
router.post('/:id/avatar', authenticate, upload.single('avatar'), userController.uploadAvatar);
router.delete('/:id/avatar', authenticate, userController.deleteAvatar);

export default router;
