import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';

// ==================== DEPARTMENTS ====================

export const createDepartment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, code, description, hodId } = req.body;

    const department = await prisma.department.create({
      data: { name, code, description, hodId },
    });

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: department,
    });
  } catch (error) {
    console.error('Create department error:', error);
    res.status(500).json({ success: false, message: 'Failed to create department' });
  }
};

export const getAllDepartments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const departments = await prisma.department.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { courses: true, faculty: true, students: true } },
      },
      orderBy: { name: 'asc' },
    });

    res.json({ success: true, data: departments });
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch departments' });
  }
};

export const getDepartmentById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        courses: { where: { isActive: true } },
        faculty: {
          where: { isActive: true },
          select: { id: true, firstName: true, lastName: true, employeeId: true },
        },
        _count: { select: { students: true } },
      },
    });

    if (!department) {
      res.status(404).json({ success: false, message: 'Department not found' });
      return;
    }

    res.json({ success: true, data: department });
  } catch (error) {
    console.error('Get department error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch department' });
  }
};

export const updateDepartment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, code, description, hodId, isActive } = req.body;

    const department = await prisma.department.update({
      where: { id },
      data: { name, code, description, hodId, isActive },
    });

    res.json({
      success: true,
      message: 'Department updated successfully',
      data: department,
    });
  } catch (error) {
    console.error('Update department error:', error);
    res.status(500).json({ success: false, message: 'Failed to update department' });
  }
};

// ==================== COURSES ====================

export const createCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, code, description, duration, totalSemesters, departmentId } = req.body;

    const course = await prisma.course.create({
      data: { name, code, description, duration, totalSemesters, departmentId },
      include: {
        department: { select: { name: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course,
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ success: false, message: 'Failed to create course' });
  }
};

export const getAllCourses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { departmentId } = req.query;

    const where: any = { isActive: true };
    if (departmentId) where.departmentId = String(departmentId);

    const courses = await prisma.course.findMany({
      where,
      include: {
        department: { select: { name: true } },
        _count: { select: { batches: true, students: true, subjects: true } },
      },
      orderBy: { name: 'asc' },
    });

    res.json({ success: true, data: courses });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch courses' });
  }
};

export const getCourseById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        department: { select: { name: true } },
        batches: { where: { isActive: true } },
        subjects: true,
        _count: { select: { students: true } },
      },
    });

    if (!course) {
      res.status(404).json({ success: false, message: 'Course not found' });
      return;
    }

    res.json({ success: true, data: course });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch course' });
  }
};

export const updateCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, code, description, duration, totalSemesters, isActive } = req.body;

    const course = await prisma.course.update({
      where: { id },
      data: { name, code, description, duration, totalSemesters, isActive },
    });

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: course,
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ success: false, message: 'Failed to update course' });
  }
};

// ==================== BATCHES ====================

export const createBatch = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, startYear, endYear, courseId } = req.body;

    const batch = await prisma.batch.create({
      data: { name, startYear, endYear, courseId },
      include: {
        course: { select: { name: true, code: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Batch created successfully',
      data: batch,
    });
  } catch (error) {
    console.error('Create batch error:', error);
    res.status(500).json({ success: false, message: 'Failed to create batch' });
  }
};

export const getAllBatches = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId } = req.query;

    const where: any = { isActive: true };
    if (courseId) where.courseId = String(courseId);

    const batches = await prisma.batch.findMany({
      where,
      include: {
        course: { select: { name: true, code: true } },
        _count: { select: { sections: true, students: true } },
      },
      orderBy: [{ startYear: 'desc' }, { name: 'asc' }],
    });

    res.json({ success: true, data: batches });
  } catch (error) {
    console.error('Get batches error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch batches' });
  }
};

// ==================== SECTIONS ====================

export const createSection = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, batchId, maxStrength } = req.body;

    const section = await prisma.section.create({
      data: { name, batchId, maxStrength: maxStrength || 60 },
      include: {
        batch: {
          select: { name: true, course: { select: { name: true } } },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Section created successfully',
      data: section,
    });
  } catch (error) {
    console.error('Create section error:', error);
    res.status(500).json({ success: false, message: 'Failed to create section' });
  }
};

export const getAllSections = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { batchId, courseId } = req.query;

    const where: any = { isActive: true };
    if (batchId) where.batchId = String(batchId);
    if (courseId) where.batch = { courseId: String(courseId) };

    const sections = await prisma.section.findMany({
      where,
      include: {
        batch: {
          select: {
            name: true,
            startYear: true,
            endYear: true,
            course: { select: { name: true, code: true } },
          },
        },
        _count: { select: { students: true, schedules: true } },
      },
      orderBy: { name: 'asc' },
    });

    res.json({ success: true, data: sections });
  } catch (error) {
    console.error('Get sections error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch sections' });
  }
};

export const getSectionWithStudents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const section = await prisma.section.findUnique({
      where: { id },
      include: {
        batch: {
          select: { name: true, course: { select: { name: true } } },
        },
        students: {
          where: { isActive: true },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            registrationNo: true,
            rollNo: true,
            phone: true,
            user: { select: { email: true } },
          },
          orderBy: { rollNo: 'asc' },
        },
        schedules: {
          include: {
            subject: { select: { name: true, code: true } },
            faculty: { select: { firstName: true, lastName: true } },
          },
        },
      },
    });

    if (!section) {
      res.status(404).json({ success: false, message: 'Section not found' });
      return;
    }

    res.json({ success: true, data: section });
  } catch (error) {
    console.error('Get section error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch section' });
  }
};

// ==================== SUBJECTS ====================

export const createSubject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, code, credits, courseId, departmentId, semester, isLab, isElective, description } = req.body;

    const subject = await prisma.subject.create({
      data: { name, code, credits, courseId, departmentId, semester, isLab, isElective, description },
      include: {
        course: { select: { name: true } },
        department: { select: { name: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      data: subject,
    });
  } catch (error) {
    console.error('Create subject error:', error);
    res.status(500).json({ success: false, message: 'Failed to create subject' });
  }
};

export const getAllSubjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId, semester, departmentId } = req.query;

    const where: any = {};
    if (courseId) where.courseId = String(courseId);
    if (semester) where.semester = Number(semester);
    if (departmentId) where.departmentId = String(departmentId);

    const subjects = await prisma.subject.findMany({
      where,
      include: {
        course: { select: { name: true, code: true } },
        department: { select: { name: true } },
        _count: { select: { exams: true } },
      },
      orderBy: [{ semester: 'asc' }, { name: 'asc' }],
    });

    res.json({ success: true, data: subjects });
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch subjects' });
  }
};

export const updateSubject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, code, credits, semester, isLab, isElective, description } = req.body;

    const subject = await prisma.subject.update({
      where: { id },
      data: { name, code, credits, semester, isLab, isElective, description },
    });

    res.json({
      success: true,
      message: 'Subject updated successfully',
      data: subject,
    });
  } catch (error) {
    console.error('Update subject error:', error);
    res.status(500).json({ success: false, message: 'Failed to update subject' });
  }
};

// ==================== CLASS SCHEDULE ====================

export const createClassSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { subjectId, facultyId, sectionId, dayOfWeek, startTime, endTime, room, academicYear, semester } = req.body;

    // Check for conflicts
    const conflict = await prisma.classSchedule.findFirst({
      where: {
        dayOfWeek,
        sectionId,
        isActive: true,
        OR: [
          {
            startTime: { lte: startTime },
            endTime: { gt: startTime },
          },
          {
            startTime: { lt: endTime },
            endTime: { gte: endTime },
          },
        ],
      },
    });

    if (conflict) {
      res.status(400).json({
        success: false,
        message: 'Schedule conflict detected for this section',
      });
      return;
    }

    const schedule = await prisma.classSchedule.create({
      data: { 
        subjectId, 
        facultyId, 
        sectionId, 
        dayOfWeek, 
        startTime, 
        endTime, 
        room,
        academicYear,
        semester, // SemesterType: ODD or EVEN
      },
      include: {
        subject: { select: { name: true, code: true } },
        faculty: { select: { firstName: true, lastName: true } },
        section: {
          select: {
            name: true,
            batch: { select: { name: true, course: { select: { name: true } } } },
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Class schedule created successfully',
      data: schedule,
    });
  } catch (error) {
    console.error('Create schedule error:', error);
    res.status(500).json({ success: false, message: 'Failed to create schedule' });
  }
};

export const getSectionSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { sectionId } = req.params;

    const schedules = await prisma.classSchedule.findMany({
      where: { sectionId, isActive: true },
      include: {
        subject: { select: { name: true, code: true, isLab: true } },
        faculty: { select: { firstName: true, lastName: true } },
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });

    // Group by day
    const byDay = schedules.reduce((acc: Record<number, typeof schedules>, schedule) => {
      if (!acc[schedule.dayOfWeek]) acc[schedule.dayOfWeek] = [];
      acc[schedule.dayOfWeek].push(schedule);
      return acc;
    }, {});

    res.json({ success: true, data: { schedules, byDay } });
  } catch (error) {
    console.error('Get schedule error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch schedule' });
  }
};

export const getFacultySchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { facultyId } = req.params;

    const schedules = await prisma.classSchedule.findMany({
      where: { facultyId, isActive: true },
      include: {
        subject: { select: { name: true, code: true, isLab: true } },
        section: {
          select: {
            name: true,
            batch: { select: { name: true, course: { select: { name: true } } } },
          },
        },
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });

    // Group by day
    const byDay = schedules.reduce((acc: Record<number, typeof schedules>, schedule) => {
      if (!acc[schedule.dayOfWeek]) acc[schedule.dayOfWeek] = [];
      acc[schedule.dayOfWeek].push(schedule);
      return acc;
    }, {});

    res.json({ success: true, data: { schedules, byDay } });
  } catch (error) {
    console.error('Get faculty schedule error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch schedule' });
  }
};

// ==================== ACADEMIC YEAR ====================

export const createAcademicYear = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, startDate, endDate, isCurrent } = req.body;

    // If setting as current, unset other current years
    if (isCurrent) {
      await prisma.academicYear.updateMany({
        where: { isCurrent: true },
        data: { isCurrent: false },
      });
    }

    const academicYear = await prisma.academicYear.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isCurrent: isCurrent || false,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Academic year created successfully',
      data: academicYear,
    });
  } catch (error) {
    console.error('Create academic year error:', error);
    res.status(500).json({ success: false, message: 'Failed to create academic year' });
  }
};

export const getAllAcademicYears = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const academicYears = await prisma.academicYear.findMany({
      orderBy: { startDate: 'desc' },
    });

    res.json({ success: true, data: academicYears });
  } catch (error) {
    console.error('Get academic years error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch academic years' });
  }
};
