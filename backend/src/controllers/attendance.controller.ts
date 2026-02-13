import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';
import { Prisma } from '@prisma/client';

interface AttendanceRecord {
  studentId: string;
  status: string;
  remarks?: string;
}

interface AttendanceStat {
  status: string;
  _count: number;
}

// Mark attendance for students
export const markAttendance = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { subjectId, date, attendanceData } = req.body;
    // attendanceData: [{ studentId, status, remarks }]

    // Get faculty ID from authenticated user
    const faculty = await prisma.faculty.findFirst({
      where: { userId: req.user?.id },
      select: { id: true },
    });

    if (!faculty) {
      res.status(403).json({ success: false, message: 'Only faculty can mark attendance' });
      return;
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const results = await prisma.$transaction(
      attendanceData.map((record: { studentId: string; status: string; remarks?: string }) =>
        prisma.attendance.upsert({
          where: {
            date_studentId_subjectId: {
              date: attendanceDate,
              studentId: record.studentId,
              subjectId,
            },
          },
          update: {
            status: record.status as string,
            remarks: record.remarks,
          },
          create: {
            date: attendanceDate,
            studentId: record.studentId,
            subjectId,
            markedById: faculty.id,
            status: record.status as string,
            remarks: record.remarks,
          },
        })
      )
    );

    res.json({
      success: true,
      message: `Attendance marked for ${results.length} students`,
      data: { count: results.length },
    });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ success: false, message: 'Failed to mark attendance' });
  }
};

// Get attendance by date
export const getAttendanceByDate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { date, subjectId } = req.query;

    const attendanceDate = new Date(String(date));
    attendanceDate.setHours(0, 0, 0, 0);

    const where: Prisma.AttendanceWhereInput = { date: attendanceDate };
    if (subjectId) where.subjectId = String(subjectId);

    const attendance = await prisma.attendance.findMany({
      where,
      include: {
        student: {
          select: { id: true, firstName: true, lastName: true, registrationNo: true, rollNo: true },
        },
        subject: { select: { name: true, code: true } },
        markedBy: { select: { firstName: true, lastName: true } },
      },
      orderBy: { student: { rollNo: 'asc' } },
    });

    // Get summary
    const summary = attendance.reduce(
      (acc, a) => {
        acc[a.status] = (acc[a.status] || 0) + 1;
        acc.total++;
        return acc;
      },
      { total: 0 } as Record<string, number>
    );

    res.json({ success: true, data: { attendance, summary } });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch attendance' });
  }
};

// Get student attendance
export const getStudentAttendance = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate, subjectId } = req.query;

    const where: Prisma.AttendanceWhereInput = { studentId };

    if (startDate && endDate) {
      where.date = {
        gte: new Date(String(startDate)),
        lte: new Date(String(endDate)),
      };
    }

    if (subjectId) where.subjectId = String(subjectId);

    const attendance = await prisma.attendance.findMany({
      where,
      include: {
        subject: { select: { name: true, code: true } },
      },
      orderBy: { date: 'desc' },
    });

    // Calculate percentage by subject
    const bySubject: Record<string, { present: number; total: number; percentage: number }> = {};
    attendance.forEach((a) => {
      const subjectName = a.subject.name;
      if (!bySubject[subjectName]) {
        bySubject[subjectName] = { present: 0, total: 0, percentage: 0 };
      }
      bySubject[subjectName].total++;
      if (a.status === 'PRESENT') bySubject[subjectName].present++;
    });

    Object.keys(bySubject).forEach((subject) => {
      bySubject[subject].percentage = Number(
        ((bySubject[subject].present / bySubject[subject].total) * 100).toFixed(1)
      );
    });

    // Overall percentage
    const totalClasses = attendance.length;
    const presentClasses = attendance.filter((a) => a.status === 'PRESENT').length;
    const overallPercentage = totalClasses > 0 ? ((presentClasses / totalClasses) * 100).toFixed(1) : 0;

    res.json({
      success: true,
      data: {
        attendance,
        bySubject,
        summary: {
          totalClasses,
          presentClasses,
          absentClasses: attendance.filter((a) => a.status === 'ABSENT').length,
          lateClasses: attendance.filter((a) => a.status === 'LATE').length,
          overallPercentage,
        },
      },
    });
  } catch (error) {
    console.error('Get student attendance error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch attendance' });
  }
};

// Get section attendance report
export const getSectionAttendanceReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { sectionId } = req.params;
    const { startDate, endDate } = req.query;

    const dateFilter: Prisma.AttendanceWhereInput = {};
    if (startDate && endDate) {
      dateFilter.date = {
        gte: new Date(String(startDate)),
        lte: new Date(String(endDate)),
      };
    }

    const students = await prisma.student.findMany({
      where: { sectionId, isActive: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        registrationNo: true,
        rollNo: true,
        attendances: {
          where: dateFilter,
        },
      },
      orderBy: { rollNo: 'asc' },
    });

    const report = students.map((student) => {
      const total = student.attendances.length;
      const present = student.attendances.filter((a) => a.status === 'PRESENT').length;
      const absent = student.attendances.filter((a) => a.status === 'ABSENT').length;
      const late = student.attendances.filter((a) => a.status === 'LATE').length;
      const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

      return {
        studentId: student.id,
        name: `${student.firstName} ${student.lastName}`,
        registrationNo: student.registrationNo,
        rollNo: student.rollNo,
        totalClasses: total,
        present,
        absent,
        late,
        percentage,
      };
    });

    res.json({ success: true, data: report });
  } catch (error) {
    console.error('Get section report error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch report' });
  }
};

// Get low attendance students
export const getLowAttendanceStudents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { threshold = 75, departmentId, courseId, batchId } = req.query;

    const where: Prisma.StudentWhereInput = { isActive: true };
    if (departmentId) where.departmentId = String(departmentId);
    if (courseId) where.courseId = String(courseId);
    if (batchId) where.batchId = String(batchId);

    const students = await prisma.student.findMany({
      where,
      include: {
        attendances: true,
        course: { select: { name: true } },
        batch: { select: { name: true } },
        section: { select: { name: true } },
      },
    });

    const lowAttendanceStudents = students
      .map((student) => {
        const total = student.attendances.length;
        const present = student.attendances.filter((a: { status: string }) => a.status === 'PRESENT').length;
        const percentage = total > 0 ? (present / total) * 100 : 100;

        return {
          student: {
            id: student.id,
            name: `${student.firstName} ${student.lastName}`,
            registrationNo: student.registrationNo,
            phone: student.phone,
            fatherPhone: student.fatherPhone,
            course: student.course?.name,
            batch: student.batch?.name,
            section: student.section?.name,
          },
          totalClasses: total,
          present,
          percentage: percentage.toFixed(1),
        };
      })
      .filter((s) => Number(s.percentage) < Number(threshold))
      .sort((a, b) => Number(a.percentage) - Number(b.percentage));

    res.json({
      success: true,
      data: {
        students: lowAttendanceStudents,
        threshold: Number(threshold),
        count: lowAttendanceStudents.length,
      },
    });
  } catch (error) {
    console.error('Get low attendance error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch data' });
  }
};
