import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as attendanceController from '../controllers/attendance.controller';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Mark attendance
router.post('/mark', attendanceController.markAttendance);

// Get attendance by date
router.get('/date', attendanceController.getAttendanceByDate);

// Get student attendance
router.get('/student/:studentId', attendanceController.getStudentAttendance);

// Get section attendance report
router.get('/section/:sectionId/report', attendanceController.getSectionAttendanceReport);

// Get low attendance students
router.get('/low-attendance', attendanceController.getLowAttendanceStudents);

export default router;
