import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as examController from '../controllers/exam.controller';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Exam CRUD
router.get('/', examController.getAllExams);
router.post('/', examController.createExam);

// Results
router.post('/:id/results', examController.enterResults);
router.get('/:id/results', examController.getExamResults);
router.post('/:id/publish', examController.publishResults);

// Student results
router.get('/student/:studentId', examController.getStudentResults);

export default router;
