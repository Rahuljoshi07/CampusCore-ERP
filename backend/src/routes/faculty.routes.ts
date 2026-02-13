import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as facultyController from '../controllers/faculty.controller';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Faculty routes
router.get('/', facultyController.getAllFaculty);
router.get('/:id', facultyController.getFacultyById);
router.get('/:id/dashboard', facultyController.getFacultyDashboard);
router.post('/', facultyController.createFaculty);
router.put('/:id', facultyController.updateFaculty);
router.delete('/:id', facultyController.deleteFaculty);
router.post('/:id/assign-subject', facultyController.assignSubject);

export default router;
