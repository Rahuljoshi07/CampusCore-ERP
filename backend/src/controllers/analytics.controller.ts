import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { Prisma } from '@prisma/client';

export const analyticsController = {
  // Get dashboard stats for CampusCore ERP
  async getDashboardStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const [
        totalStudents,
        totalFaculty,
        totalCourses,
        totalDepartments,
        activeStudents,
        studentsByGender,
        recentAdmissions,
        upcomingExams,
        feeSummary,
        attendanceToday,
      ] = await Promise.all([
        prisma.student.count(),
        prisma.faculty.count(),
        prisma.course.count(),
        prisma.department.count(),
        prisma.student.count({ where: { isActive: true } }),
        prisma.student.groupBy({
          by: ['gender'],
          _count: true,
        }),
        prisma.student.findMany({
          where: {
            admissionDate: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            registrationNo: true,
            admissionDate: true,
            course: { select: { name: true } },
          },
          orderBy: { admissionDate: 'desc' },
          take: 5,
        }),
        prisma.exam.findMany({
          where: {
            date: {
              gte: new Date(),
              lte: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            },
          },
          include: {
            subject: { select: { name: true, code: true } },
          },
          orderBy: { date: 'asc' },
          take: 5,
        }),
        prisma.feePayment.aggregate({
          _sum: { paidAmount: true },
          _count: true,
        }),
        prisma.attendance.groupBy({
          by: ['status'],
          where: {
            date: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lt: new Date(new Date().setHours(23, 59, 59, 999)),
            },
          },
          _count: true,
        }),
      ]);

      const stats = {
        overview: {
          totalStudents,
          activeStudents,
          totalFaculty,
          totalCourses,
          totalDepartments,
        },
        studentsByGender: studentsByGender.reduce((acc, curr) => {
          if (curr.gender) acc[curr.gender] = curr._count;
          return acc;
        }, {} as Record<string, number>),
        recentAdmissions,
        upcomingExams,
        feeSummary: {
          totalCollected: feeSummary._sum?.paidAmount || 0,
          totalPayments: feeSummary._count,
        },
        attendanceToday: attendanceToday.reduce((acc, curr) => {
          acc[curr.status] = curr._count;
          return acc;
        }, {} as Record<string, number>),
      };

      res.json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  },

  // Get department-wise analytics
  async getDepartmentAnalytics(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const departments = await prisma.department.findMany({
        include: {
          _count: {
            select: { faculty: true, students: true, courses: true },
          },
        },
        orderBy: { name: 'asc' },
      });

      const analytics = departments.map(dept => ({
        id: dept.id,
        name: dept.name,
        code: dept.code,
        studentCount: dept._count.students,
        facultyCount: dept._count.faculty,
        courseCount: dept._count.courses,
      }));

      res.json({ success: true, data: analytics });
    } catch (error) {
      next(error);
    }
  },

  // Get attendance analytics
  async getAttendanceAnalytics(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const { startDate, endDate } = req.query;

      const dateFilter: Prisma.AttendanceWhereInput = {};
      if (startDate && endDate) {
        dateFilter.date = {
          gte: new Date(String(startDate)),
          lte: new Date(String(endDate)),
        };
      }

      const attendanceStats = await prisma.attendance.groupBy({
        by: ['status'],
        where: dateFilter,
        _count: true,
      });

      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        return date;
      }).reverse();

      const dailyTrend = await Promise.all(
        last7Days.map(async (date) => {
          const nextDay = new Date(date);
          nextDay.setDate(nextDay.getDate() + 1);

          const stats = await prisma.attendance.groupBy({
            by: ['status'],
            where: { date: { gte: date, lt: nextDay } },
            _count: true,
          });

          return {
            date: date.toISOString().split('T')[0],
            present: stats.find(s => s.status === 'PRESENT')?._count || 0,
            absent: stats.find(s => s.status === 'ABSENT')?._count || 0,
            late: stats.find(s => s.status === 'LATE')?._count || 0,
          };
        })
      );

      const total = attendanceStats.reduce((sum, s) => sum + s._count, 0);
      const present = attendanceStats.find(s => s.status === 'PRESENT')?._count || 0;
      const attendancePercentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

      res.json({
        success: true,
        data: {
          summary: attendanceStats.reduce((acc, curr) => {
            acc[curr.status] = curr._count;
            return acc;
          }, {} as Record<string, number>),
          attendancePercentage,
          dailyTrend,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Get exam analytics
  async getExamAnalytics(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const { examId } = req.query;

      const whereClause: Prisma.ExamResultWhereInput = {};
      if (examId) whereClause.examId = String(examId);

      const results = await prisma.examResult.findMany({
        where: whereClause,
        include: {
          exam: { select: { name: true, totalMarks: true, passingMarks: true } },
        },
      });

      let passed = 0;
      let failed = 0;
      let totalMarksObtained = 0;
      let totalMaxMarks = 0;

      results.forEach(result => {
        if (result.exam.passingMarks && result.marksObtained >= result.exam.passingMarks) {
          passed++;
        } else {
          failed++;
        }
        totalMarksObtained += result.marksObtained;
        totalMaxMarks += result.exam.totalMarks;
      });

      const averagePercentage = totalMaxMarks > 0 
        ? ((totalMarksObtained / totalMaxMarks) * 100).toFixed(1) 
        : 0;

      const gradeDistribution = results.reduce((acc, curr) => {
        if (curr.grade) acc[curr.grade] = (acc[curr.grade] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      res.json({
        success: true,
        data: {
          totalResults: results.length,
          passed,
          failed,
          passPercentage: results.length > 0 ? ((passed / results.length) * 100).toFixed(1) : 0,
          averagePercentage,
          gradeDistribution,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // Get fee analytics
  async getFeeAnalytics(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const [totalCollected, paymentsByMethod, monthlyCollection, pendingFees] = await Promise.all([
        prisma.feePayment.aggregate({ _sum: { paidAmount: true } }),
        prisma.feePayment.groupBy({
          by: ['paymentMethod'],
          _sum: { paidAmount: true },
          _count: true,
        }),
        Promise.all(
          Array.from({ length: 6 }, (_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
            const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            return prisma.feePayment.aggregate({
              where: { paymentDate: { gte: startOfMonth, lte: endOfMonth } },
              _sum: { paidAmount: true },
            }).then(result => ({
              month: startOfMonth.toLocaleString('default', { month: 'short', year: 'numeric' }),
              amount: result._sum?.paidAmount || 0,
            }));
          })
        ),
        prisma.feePayment.count({ where: { status: { in: ['PENDING', 'PARTIAL'] } } }),
      ]);

      res.json({
        success: true,
        data: {
          totalCollected: totalCollected._sum?.paidAmount || 0,
          paymentsByMethod: paymentsByMethod.map((p: { paymentMethod: string | null; _sum: { paidAmount: number | null }; _count: number }) => ({
            method: p.paymentMethod,
            amount: p._sum?.paidAmount || 0,
            count: p._count,
          })),
          monthlyCollection: monthlyCollection.reverse(),
          pendingFeeRecords: pendingFees,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
