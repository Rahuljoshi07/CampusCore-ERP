import { Router } from 'express';
import { analyticsController } from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/dashboard', analyticsController.getDashboardStats);
router.get('/department/:departmentId', analyticsController.getDepartmentAnalytics);
router.get('/attendance', analyticsController.getAttendanceAnalytics);
router.get('/exams', analyticsController.getExamAnalytics);
router.get('/fees', analyticsController.getFeeAnalytics);

export default router;
