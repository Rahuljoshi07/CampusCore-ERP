import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as academicController from '../controllers/academic.controller';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// ==================== DEPARTMENTS ====================
router.get('/departments', academicController.getAllDepartments);
router.get('/departments/:id', academicController.getDepartmentById);
router.post('/departments', academicController.createDepartment);
router.put('/departments/:id', academicController.updateDepartment);

// ==================== COURSES ====================
router.get('/courses', academicController.getAllCourses);
router.get('/courses/:id', academicController.getCourseById);
router.post('/courses', academicController.createCourse);
router.put('/courses/:id', academicController.updateCourse);

// ==================== BATCHES ====================
router.get('/batches', academicController.getAllBatches);
router.post('/batches', academicController.createBatch);

// ==================== SECTIONS ====================
router.get('/sections', academicController.getAllSections);
router.get('/sections/:id', academicController.getSectionWithStudents);
router.post('/sections', academicController.createSection);

// ==================== SUBJECTS ====================
router.get('/subjects', academicController.getAllSubjects);
router.post('/subjects', academicController.createSubject);
router.put('/subjects/:id', academicController.updateSubject);

// ==================== CLASS SCHEDULES ====================
router.get('/schedules/section/:sectionId', academicController.getSectionSchedule);
router.get('/schedules/faculty/:facultyId', academicController.getFacultySchedule);
router.post('/schedules', academicController.createClassSchedule);

// ==================== ACADEMIC YEARS ====================
router.get('/years', academicController.getAllAcademicYears);
router.post('/years', academicController.createAcademicYear);

export default router;
