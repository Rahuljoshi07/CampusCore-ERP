import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.use(authenticate);

// Current user
router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateProfile);
router.delete('/account', userController.deleteAccount);

// Admin routes
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.patch('/:id/role', requireAdmin, userController.updateUserRole);
router.patch('/:id/deactivate', requireAdmin, userController.deactivateUser);

export default router;
