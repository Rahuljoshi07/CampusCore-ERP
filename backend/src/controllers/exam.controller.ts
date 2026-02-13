import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';
import { Prisma } from '@prisma/client';

// Create exam
export const createExam = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, subjectId, type, date, totalMarks, passingMarks, duration, startTime, academicYear, semester } = req.body;

    // Get faculty ID from authenticated user
    const faculty = await prisma.faculty.findFirst({
      where: { userId: req.user?.id },
      select: { id: true },
    });

    if (!faculty) {
      res.status(403).json({ success: false, message: 'Only faculty can create exams' });
      return;
    }

    const exam = await prisma.exam.create({
      data: {
        name,
        subjectId,
        type: type as string,
        date: new Date(date),
        totalMarks,
        passingMarks,
        duration,
        startTime,
        academicYear,
        semester,
        createdById: faculty.id,
      },
      include: {
        subject: { select: { name: true, code: true, course: { select: { name: true } } } },
        createdBy: { select: { firstName: true, lastName: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Exam created successfully',
      data: exam,
    });
  } catch (error) {
    console.error('Create exam error:', error);
    res.status(500).json({ success: false, message: 'Failed to create exam' });
  }
};

// Get all exams
export const getAllExams = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { subjectId, courseId, type, academicYear, upcoming } = req.query;

    const where: Prisma.ExamWhereInput = {};

    if (subjectId) where.subjectId = String(subjectId);
    if (courseId) where.subject = { courseId: String(courseId) };
    if (type) where.type = type as string;
    if (academicYear) where.academicYear = String(academicYear);
    if (upcoming === 'true') where.date = { gte: new Date() };

    const exams = await prisma.exam.findMany({
      where,
      include: {
        subject: {
          select: { name: true, code: true, course: { select: { name: true, code: true } } },
        },
        createdBy: { select: { firstName: true, lastName: true } },
        _count: { select: { results: true } },
      },
      orderBy: { date: 'desc' },
    });

    res.json({ success: true, data: exams });
  } catch (error) {
    console.error('Get exams error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch exams' });
  }
};

// Enter exam results
export const enterResults = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { results } = req.body;
    // results: [{ studentId, marksObtained, remarks, isAbsent }]

    const exam = await prisma.exam.findUnique({ where: { id } });
    if (!exam) {
      res.status(404).json({ success: false, message: 'Exam not found' });
      return;
    }

    const calculateGrade = (marks: number, total: number): string => {
      const percentage = (marks / total) * 100;
      if (percentage >= 90) return 'A+';
      if (percentage >= 80) return 'A';
      if (percentage >= 70) return 'B+';
      if (percentage >= 60) return 'B';
      if (percentage >= 50) return 'C';
      if (percentage >= 40) return 'D';
      return 'F';
    };

    const enteredResults = await prisma.$transaction(
      results.map((result: { studentId: string; marksObtained: number; remarks?: string; isAbsent?: boolean }) =>
        prisma.examResult.upsert({
          where: {
            examId_studentId: {
              examId: id,
              studentId: result.studentId,
            },
          },
          update: {
            marksObtained: result.marksObtained,
            grade: calculateGrade(result.marksObtained, exam.totalMarks),
            remarks: result.remarks,
            isAbsent: result.isAbsent || false,
          },
          create: {
            examId: id,
            studentId: result.studentId,
            marksObtained: result.marksObtained,
            grade: calculateGrade(result.marksObtained, exam.totalMarks),
            remarks: result.remarks,
            isAbsent: result.isAbsent || false,
          },
        })
      )
    );

    res.json({
      success: true,
      message: `Results entered for ${enteredResults.length} students`,
      data: { count: enteredResults.length },
    });
  } catch (error) {
    console.error('Enter results error:', error);
    res.status(500).json({ success: false, message: 'Failed to enter results' });
  }
};

// Get exam results
export const getExamResults = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const exam = await prisma.exam.findUnique({
      where: { id },
      include: {
        subject: { select: { name: true, code: true } },
      },
    });

    if (!exam) {
      res.status(404).json({ success: false, message: 'Exam not found' });
      return;
    }

    const results = await prisma.examResult.findMany({
      where: { examId: id },
      include: {
        student: {
          select: { firstName: true, lastName: true, registrationNo: true, rollNo: true },
        },
      },
      orderBy: { marksObtained: 'desc' },
    });

    // Calculate statistics
    const marks = results.map((r) => r.marksObtained);
    const passedCount = results.filter((r) => r.marksObtained >= exam.passingMarks).length;
    const average = marks.length > 0 ? marks.reduce((a, b) => a + b, 0) / marks.length : 0;
    const highest = marks.length > 0 ? Math.max(...marks) : 0;
    const lowest = marks.length > 0 ? Math.min(...marks) : 0;

    res.json({
      success: true,
      data: {
        exam,
        results: results.map(r => ({
          ...r,
          isPassed: r.marksObtained >= exam.passingMarks,
        })),
        statistics: {
          totalStudents: results.length,
          passed: passedCount,
          failed: results.length - passedCount,
          passPercentage: results.length > 0 ? ((passedCount / results.length) * 100).toFixed(1) : 0,
          average: average.toFixed(2),
          highest,
          lowest,
        },
      },
    });
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch results' });
  }
};

// Get student results
export const getStudentResults = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;
    const { academicYear, semester } = req.query;

    const where: Prisma.ExamResultWhereInput = { studentId };

    if (academicYear || semester) {
      where.exam = {};
      if (academicYear) where.exam.academicYear = String(academicYear);
      if (semester) where.exam.semester = Number(semester);
    }

    const results = await prisma.examResult.findMany({
      where,
      include: {
        exam: {
          include: {
            subject: { select: { name: true, code: true, credits: true } },
          },
        },
      },
      orderBy: { exam: { date: 'desc' } },
    });

    // Group by semester
    const bySemester: Record<number, typeof results> = {};
    results.forEach((result) => {
      const sem = result.exam.semester;
      if (!bySemester[sem]) bySemester[sem] = [];
      bySemester[sem].push(result);
    });

    // Calculate GPA per semester
    const gradePoints: Record<string, number> = {
      'A+': 10, A: 9, 'B+': 8, B: 7, C: 6, D: 5, F: 0,
    };

    const semesterGPA: Record<number, number> = {};
    Object.keys(bySemester).forEach((sem) => {
      const semResults = bySemester[Number(sem)];
      let totalCredits = 0;
      let totalPoints = 0;

      semResults.forEach((r) => {
        const credits = r.exam.subject?.credits || 3;
        totalCredits += credits;
        totalPoints += (gradePoints[r.grade || 'F'] || 0) * credits;
      });

      semesterGPA[Number(sem)] = totalCredits > 0 ? Number((totalPoints / totalCredits).toFixed(2)) : 0;
    });

    // Calculate CGPA
    const allCredits = results.reduce((sum, r) => sum + (r.exam.subject?.credits || 3), 0);
    const allPoints = results.reduce((sum, r) => {
      return sum + (gradePoints[r.grade || 'F'] || 0) * (r.exam.subject?.credits || 3);
    }, 0);
    const cgpa = allCredits > 0 ? (allPoints / allCredits).toFixed(2) : 0;

    // Compute pass status at runtime
    const resultsWithPassStatus = results.map(r => ({
      ...r,
      isPassed: r.marksObtained >= r.exam.passingMarks,
    }));

    const passedCount = resultsWithPassStatus.filter(r => r.isPassed).length;

    res.json({
      success: true,
      data: {
        results: resultsWithPassStatus,
        bySemester,
        semesterGPA,
        cgpa,
        summary: {
          totalExams: results.length,
          passed: passedCount,
          failed: results.length - passedCount,
        },
      },
    });
  } catch (error) {
    console.error('Get student results error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch results' });
  }
};

// Publish results
export const publishResults = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const exam = await prisma.exam.update({
      where: { id },
      data: { isPublished: true },
    });

    // Create notifications for students
    const results = await prisma.examResult.findMany({
      where: { examId: id },
      select: { studentId: true, student: { select: { userId: true } } },
    });

    await prisma.notification.createMany({
      data: results.map((r) => ({
        userId: r.student.userId,
        title: 'Exam Results Published',
        message: `Results for ${exam.name} have been published. Check your results.`,
        type: 'RESULT',
      })),
    });

    res.json({
      success: true,
      message: 'Results published and notifications sent',
      data: exam,
    });
  } catch (error) {
    console.error('Publish results error:', error);
    res.status(500).json({ success: false, message: 'Failed to publish results' });
  }
};
