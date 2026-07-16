import { Router } from 'express';
import { taskController } from '../controllers/taskController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.get('/my', taskController.getMyTasks);
router.get('/project/:projectId', taskController.getByProject);
router.get('/:id', taskController.getById);
router.post('/', taskController.create);
router.put('/:id', taskController.update);
router.put('/:id/status', taskController.updateStatus);
router.put('/:id/assignee', taskController.assignAssignee);
router.put('/:id/reviewer', taskController.assignReviewer);
router.delete('/:id', taskController.delete);

export default router;
