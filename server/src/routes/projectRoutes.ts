import { Router } from 'express';
import { projectController } from '../controllers/projectController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', projectController.getAll);
router.get('/:id', projectController.getById);
router.get('/:id/members', projectController.getMembers);
router.post('/', projectController.create);
router.put('/:id', projectController.update);
router.delete('/:id', projectController.delete);
router.post('/:id/members', projectController.addMember);
router.put('/:id/members/:userId', projectController.updateMemberRole);
router.delete('/:id/members/:userId', projectController.removeMember);

export default router;
