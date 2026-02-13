import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller';
import { authenticate } from '../middleware/auth';
import { uuidParam } from '../middleware/validation';

const router = Router();

router.use(authenticate);

router.get('/', notificationController.getAll);
router.patch('/:id/read', uuidParam, notificationController.markAsRead);
router.post('/mark-all-read', notificationController.markAllAsRead);
router.delete('/:id', uuidParam, notificationController.delete);

export default router;
