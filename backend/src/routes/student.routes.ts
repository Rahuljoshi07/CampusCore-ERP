import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as studentController from '../controllers/student.controller';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Student routes
router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudentById);
router.get('/:id/dashboard', studentController.getStudentDashboard);
router.post('/', studentController.createStudent);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

export default router;
