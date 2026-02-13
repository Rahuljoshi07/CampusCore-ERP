import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';
import { Prisma } from '@prisma/client';

// Get all faculty with pagination
export const getAllFaculty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, search, departmentId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { isActive: true };

    if (search) {
      where.OR = [
        { firstName: { contains: String(search), mode: 'insensitive' } },
        { lastName: { contains: String(search), mode: 'insensitive' } },
        { employeeId: { contains: String(search), mode: 'insensitive' } },
        { email: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    if (departmentId) where.departmentId = String(departmentId);

    const [faculty, total] = await Promise.all([
      prisma.faculty.findMany({
        where,
        include: {
          user: { select: { email: true, isActive: true } },
          department: { select: { name: true } },
          _count: { select: { subjects: true, classesTaught: true } },
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.faculty.count({ where }),
    ]);

    res.json({
      success: true,
      data: faculty,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get faculty error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch faculty' });
  }
};

// Get faculty by ID
export const getFacultyById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const faculty = await prisma.faculty.findUnique({
      where: { id },
      include: {
        user: { select: { email: true, isActive: true, lastLogin: true } },
        department: true,
        subjects: {
          include: {
            subject: { select: { name: true, code: true, credits: true } },
          },
        },
        classesTaught: {
          include: {
            subject: { select: { name: true, code: true } },
            section: {
              select: {
                name: true,
                batch: { select: { name: true, course: { select: { name: true } } } },
              },
            },
          },
        },
      },
    });

    if (!faculty) {
      res.status(404).json({ success: false, message: 'Faculty not found' });
      return;
    }

    res.json({ success: true, data: faculty });
  } catch (error) {
    console.error('Get faculty error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch faculty' });
  }
};

// Create faculty
export const createFaculty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      email, password, firstName, lastName, dateOfBirth, gender,
      address, city, state, pincode, phone, alternatePhone, departmentId, 
      designation, qualification, specialization, experience, joiningDate
    } = req.body;

    // Generate employee ID
    const year = new Date().getFullYear().toString().slice(-2);
    const count = await prisma.faculty.count({
      where: { employeeId: { startsWith: `FAC${year}` } },
    });
    const employeeId = `FAC${year}${String(count + 1).padStart(4, '0')}`;

    const result = await prisma.$transaction(async (tx) => {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(password || 'faculty123', 10);

      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'FACULTY',
          isActive: true,
        },
      });

      const faculty = await tx.faculty.create({
        data: {
          userId: user.id,
          employeeId,
          firstName,
          lastName,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          gender,
          address,
          city,
          state,
          pincode,
          phone,
          alternatePhone,
          departmentId,
          designation,
          qualification,
          specialization,
          experience: experience || 0,
          joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
        },
        include: {
          department: { select: { name: true } },
        },
      });

      return faculty;
    });

    res.status(201).json({
      success: true,
      message: 'Faculty created successfully',
      data: result,
    });
  } catch (error: any) {
    console.error('Create faculty error:', error);
    if (error.code === 'P2002') {
      res.status(400).json({ success: false, message: 'Email already exists' });
      return;
    }
    res.status(500).json({ success: false, message: 'Failed to create faculty' });
  }
};

// Update faculty
export const updateFaculty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateData.dateOfBirth);
    }
    if (updateData.joiningDate) {
      updateData.joiningDate = new Date(updateData.joiningDate);
    }

    const faculty = await prisma.faculty.update({
      where: { id },
      data: updateData,
      include: {
        department: { select: { name: true } },
      },
    });

    res.json({
      success: true,
      message: 'Faculty updated successfully',
      data: faculty,
    });
  } catch (error) {
    console.error('Update faculty error:', error);
    res.status(500).json({ success: false, message: 'Failed to update faculty' });
  }
};

// Delete (deactivate) faculty
export const deleteFaculty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const faculty = await prisma.faculty.findUnique({ where: { id } });
    if (!faculty) {
      res.status(404).json({ success: false, message: 'Faculty not found' });
      return;
    }

    await prisma.$transaction([
      prisma.faculty.update({ where: { id }, data: { isActive: false } }),
      prisma.user.update({ where: { id: faculty.userId }, data: { isActive: false } }),
    ]);

    res.json({ success: true, message: 'Faculty deactivated successfully' });
  } catch (error) {
    console.error('Delete faculty error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete faculty' });
  }
};

// Assign subject to faculty
export const assignSubject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { subjectId, academicYear, semester } = req.body;

    const assignment = await prisma.facultySubject.create({
      data: {
        facultyId: id,
        subjectId,
        academicYear,
        semester, // SemesterType: ODD or EVEN
      },
      include: {
        faculty: { select: { firstName: true, lastName: true } },
        subject: { select: { name: true, code: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Subject assigned successfully',
      data: assignment,
    });
  } catch (error: any) {
    console.error('Assign subject error:', error);
    if (error.code === 'P2002') {
      res.status(400).json({ success: false, message: 'Subject already assigned' });
      return;
    }
    res.status(500).json({ success: false, message: 'Failed to assign subject' });
  }
};

// Get faculty dashboard
export const getFacultyDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayOfWeek = today.getDay();

    const [faculty, todaySchedule, assignedSubjects, totalStudents, pendingAttendance, recentLeaves, notices] = await Promise.all([
      prisma.faculty.findUnique({
        where: { id },
        include: {
          department: { select: { name: true } },
        },
      }),
      // Today's schedule
      prisma.classSchedule.findMany({
        where: {
          facultyId: id,
          dayOfWeek,
          isActive: true,
        },
        include: {
          subject: { select: { name: true, code: true } },
          section: {
            select: {
              name: true,
              _count: { select: { students: true } },
              batch: { select: { name: true, course: { select: { name: true } } } },
            },
          },
        },
        orderBy: { startTime: 'asc' },
      }),
      // Assigned subjects
      prisma.facultySubject.findMany({
        where: { facultyId: id },
        include: {
          subject: {
            select: { name: true, code: true, credits: true, course: { select: { name: true } } },
          },
        },
      }),
      // Total students
      prisma.student.count({
        where: {
          section: {
            schedules: { some: { facultyId: id } },
          },
          isActive: true,
        },
      }),
      // Pending attendance (sections not marked today)
      prisma.classSchedule.count({
        where: {
          facultyId: id,
          dayOfWeek,
          isActive: true,
          NOT: {
            section: {
              students: {
                some: {
                  attendances: {
                    some: { date: today },
                  },
                },
              },
            },
          },
        },
      }),
      // Recent leave applications
      prisma.leaveApplication.findMany({
        where: {
          student: {
            section: {
              schedules: { some: { facultyId: id } },
            },
          },
          status: 'PENDING',
        },
        include: {
          student: { select: { firstName: true, lastName: true, registrationNo: true } },
        },
        take: 5,
      }),
      // Recent notices
      prisma.notice.findMany({
        where: {
          isPublished: true,
          targetRoles: { contains: 'FACULTY' },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    res.json({
      success: true,
      data: {
        faculty,
        todaySchedule,
        assignedSubjects,
        stats: {
          totalStudents,
          totalSubjects: assignedSubjects.length,
          pendingAttendance,
          pendingLeaves: recentLeaves.length,
        },
        recentLeaves,
        notices,
      },
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard' });
  }
};
