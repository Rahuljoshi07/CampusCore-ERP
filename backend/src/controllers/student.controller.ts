import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';
import { Prisma } from '@prisma/client';

// Get all students with pagination and filtering
export const getAllStudents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, search, departmentId, courseId, batchId, sectionId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { isActive: true };

    if (search) {
      where.OR = [
        { firstName: { contains: String(search), mode: 'insensitive' } },
        { lastName: { contains: String(search), mode: 'insensitive' } },
        { registrationNo: { contains: String(search), mode: 'insensitive' } },
        { email: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    if (departmentId) where.departmentId = String(departmentId);
    if (courseId) where.courseId = String(courseId);
    if (batchId) where.batchId = String(batchId);
    if (sectionId) where.sectionId = String(sectionId);

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        include: {
          user: { select: { email: true, isActive: true } },
          department: { select: { name: true } },
          course: { select: { name: true, code: true } },
          batch: { select: { name: true } },
          section: { select: { name: true } },
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.student.count({ where }),
    ]);

    res.json({
      success: true,
      data: students,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch students' });
  }
};

// Get student by ID
export const getStudentById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        user: { select: { email: true, isActive: true, lastLogin: true } },
        department: true,
        course: true,
        batch: true,
        section: true,
        feePayments: {
          include: { feeStructure: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        examResults: {
          include: {
            exam: {
              include: { subject: { select: { name: true, code: true } } },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!student) {
      res.status(404).json({ success: false, message: 'Student not found' });
      return;
    }

    res.json({ success: true, data: student });
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch student' });
  }
};

// Create student
export const createStudent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      email, password, firstName, lastName, dateOfBirth, gender, bloodGroup,
      address, phone, fatherName, fatherPhone, motherName, motherPhone, 
      guardianName, guardianPhone, guardianRelation, departmentId, courseId, 
      batchId, sectionId, currentSemester = 1, admissionDate
    } = req.body;

    // Generate registration number
    const year = new Date().getFullYear().toString().slice(-2);
    const count = await prisma.student.count({
      where: { registrationNo: { startsWith: `STU${year}` } },
    });
    const registrationNo = `STU${year}${String(count + 1).padStart(5, '0')}`;

    // Create user and student in transaction
    const result = await prisma.$transaction(async (tx) => {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(password || 'student123', 10);

      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'STUDENT',
          isActive: true,
        },
      });

      const student = await tx.student.create({
        data: {
          userId: user.id,
          registrationNo,
          firstName,
          lastName,
          dateOfBirth: new Date(dateOfBirth),
          gender,
          bloodGroup,
          address,
          phone,
          fatherName,
          fatherPhone,
          motherName,
          motherPhone,
          guardianName,
          guardianPhone,
          guardianRelation,
          departmentId,
          courseId,
          batchId,
          sectionId,
          currentSemester,
          admissionDate: admissionDate ? new Date(admissionDate) : new Date(),
        },
        include: {
          department: { select: { name: true } },
          course: { select: { name: true } },
          batch: { select: { name: true } },
        },
      });

      return student;
    });

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: result,
    });
  } catch (error: any) {
    console.error('Create student error:', error);
    if (error.code === 'P2002') {
      res.status(400).json({ success: false, message: 'Email already exists' });
      return;
    }
    res.status(500).json({ success: false, message: 'Failed to create student' });
  }
};

// Update student
export const updateStudent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateData.dateOfBirth);
    }

    const student = await prisma.student.update({
      where: { id },
      data: updateData,
      include: {
        department: { select: { name: true } },
        course: { select: { name: true } },
        batch: { select: { name: true } },
        section: { select: { name: true } },
      },
    });

    res.json({
      success: true,
      message: 'Student updated successfully',
      data: student,
    });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ success: false, message: 'Failed to update student' });
  }
};

// Delete (deactivate) student
export const deleteStudent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.$transaction([
      prisma.student.update({ where: { id }, data: { isActive: false } }),
      prisma.user.update({
        where: { id: (await prisma.student.findUnique({ where: { id } }))?.userId || '' },
        data: { isActive: false },
      }),
    ]);

    res.json({ success: true, message: 'Student deactivated successfully' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete student' });
  }
};

// Get student dashboard data
export const getStudentDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const [student, attendanceStats, recentResults, pendingFees, upcomingExams, notices] = await Promise.all([
      prisma.student.findUnique({
        where: { id },
        include: {
          course: { select: { name: true, code: true } },
          batch: { select: { name: true } },
          section: { select: { name: true } },
        },
      }),
      // Attendance stats - last 30 days
      prisma.attendance.groupBy({
        by: ['status'],
        where: {
          studentId: id,
          date: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
        _count: true,
      }),
      // Recent exam results
      prisma.examResult.findMany({
        where: { studentId: id },
        include: {
          exam: { include: { subject: { select: { name: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      // Pending fees
      prisma.feePayment.findMany({
        where: {
          studentId: id,
          status: { in: ['PENDING', 'OVERDUE', 'PARTIAL'] },
        },
        include: { feeStructure: { select: { name: true } } },
      }),
      // Upcoming exams
      prisma.exam.findMany({
        where: {
          date: { gte: new Date() },
          subject: {
            course: {
              students: { some: { id } },
            },
          },
        },
        include: { subject: { select: { name: true, code: true } } },
        orderBy: { date: 'asc' },
        take: 5,
      }),
      // Recent notices
      prisma.notice.findMany({
        where: {
          isPublished: true,
          targetRoles: { contains: 'STUDENT' },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    const totalClasses = attendanceStats.reduce((sum, stat) => sum + stat._count, 0);
    const presentCount = attendanceStats.find((s) => s.status === 'PRESENT')?._count || 0;
    const attendancePercentage = totalClasses > 0 ? ((presentCount / totalClasses) * 100).toFixed(1) : 0;

    res.json({
      success: true,
      data: {
        student,
        attendance: {
          stats: attendanceStats,
          percentage: attendancePercentage,
          totalClasses,
        },
        recentResults,
        pendingFees,
        upcomingExams,
        notices,
      },
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard' });
  }
};
