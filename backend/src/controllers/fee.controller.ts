import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';

// ==================== FEE STRUCTURE ====================

// Create fee structure
export const createFeeStructure = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, amount, dueDate, courseId, semester, academicYear } = req.body;

    const feeStructure = await prisma.feeStructure.create({
      data: {
        name,
        amount,
        dueDate: dueDate ? new Date(dueDate) : null,
        courseId,
        semester,
        academicYear,
      },
      include: {
        course: { select: { name: true, code: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Fee structure created successfully',
      data: feeStructure,
    });
  } catch (error) {
    console.error('Create fee structure error:', error);
    res.status(500).json({ success: false, message: 'Failed to create fee structure' });
  }
};

// Get all fee structures
export const getAllFeeStructures = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId, academicYear, semester } = req.query;

    const where: any = { isActive: true };
    if (courseId) where.courseId = String(courseId);
    if (academicYear) where.academicYear = String(academicYear);
    if (semester) where.semester = Number(semester);

    const feeStructures = await prisma.feeStructure.findMany({
      where,
      include: {
        course: { select: { name: true, code: true } },
        _count: { select: { payments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: feeStructures });
  } catch (error) {
    console.error('Get fee structures error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch fee structures' });
  }
};

// ==================== FEE PAYMENTS ====================

// Get student fees
export const getStudentFees = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;

    const payments = await prisma.feePayment.findMany({
      where: { studentId },
      include: {
        feeStructure: {
          select: { name: true, amount: true, academicYear: true, semester: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate totals
    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
    const paidAmount = payments.reduce((sum, p) => sum + p.paidAmount, 0);
    const pendingAmount = totalAmount - paidAmount;

    res.json({
      success: true,
      data: {
        payments,
        summary: {
          totalAmount,
          paidAmount,
          pendingAmount,
          totalFees: payments.length,
          paidFees: payments.filter((p) => p.status === 'PAID').length,
          pendingFees: payments.filter((p) => p.status === 'PENDING' || p.status === 'OVERDUE').length,
        },
      },
    });
  } catch (error) {
    console.error('Get student fees error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch fees' });
  }
};

// Create fee payment record
export const createFeePayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { studentId, feeStructureId, dueDate } = req.body;

    const feeStructure = await prisma.feeStructure.findUnique({
      where: { id: feeStructureId },
    });

    if (!feeStructure) {
      res.status(404).json({ success: false, message: 'Fee structure not found' });
      return;
    }

    const payment = await prisma.feePayment.create({
      data: {
        studentId,
        feeStructureId,
        amount: feeStructure.amount,
        paidAmount: 0,
        status: 'PENDING',
        dueDate: dueDate ? new Date(dueDate) : feeStructure.dueDate || new Date(),
      },
      include: {
        student: { select: { firstName: true, lastName: true, registrationNo: true } },
        feeStructure: { select: { name: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Fee payment record created',
      data: payment,
    });
  } catch (error) {
    console.error('Create fee payment error:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment record' });
  }
};

// Process fee payment
export const processPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { amount, paymentMethod, transactionId, remarks } = req.body;

    const payment = await prisma.feePayment.findUnique({
      where: { id },
    });

    if (!payment) {
      res.status(404).json({ success: false, message: 'Payment record not found' });
      return;
    }

    const newPaidAmount = payment.paidAmount + amount;
    const newStatus = newPaidAmount >= payment.amount ? 'PAID' : 'PARTIAL';

    // Generate receipt number
    const receiptNo = `RCP${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    const updatedPayment = await prisma.feePayment.update({
      where: { id },
      data: {
        paidAmount: newPaidAmount,
        status: newStatus,
        paymentMethod,
        transactionId,
        paymentDate: new Date(),
        receiptNo,
        remarks,
      },
      include: {
        student: { select: { firstName: true, lastName: true, registrationNo: true } },
        feeStructure: { select: { name: true } },
      },
    });

    res.json({
      success: true,
      message: 'Payment processed successfully',
      data: updatedPayment,
    });
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({ success: false, message: 'Failed to process payment' });
  }
};

// Get pending fees report
export const getPendingFeesReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId, batchId, departmentId } = req.query;

    const where: any = {
      status: { in: ['PENDING', 'OVERDUE', 'PARTIAL'] },
    };

    if (courseId || batchId || departmentId) {
      where.student = {};
      if (courseId) where.student.courseId = String(courseId);
      if (batchId) where.student.batchId = String(batchId);
      if (departmentId) where.student.departmentId = String(departmentId);
    }

    const pendingPayments = await prisma.feePayment.findMany({
      where,
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            registrationNo: true,
            phone: true,
            fatherPhone: true,
            course: { select: { name: true } },
            batch: { select: { name: true } },
          },
        },
        feeStructure: { select: { name: true, academicYear: true } },
      },
      orderBy: { dueDate: 'asc' },
    });

    // Update overdue status
    const now = new Date();
    for (const payment of pendingPayments) {
      if (payment.status === 'PENDING' && payment.dueDate < now) {
        await prisma.feePayment.update({
          where: { id: payment.id },
          data: { status: 'OVERDUE' },
        });
        (payment as any).status = 'OVERDUE';
      }
    }

    const totalPending = pendingPayments.reduce(
      (sum, p) => sum + (p.amount - p.paidAmount),
      0
    );

    res.json({
      success: true,
      data: {
        payments: pendingPayments,
        summary: {
          totalRecords: pendingPayments.length,
          totalPendingAmount: totalPending,
          overdueCount: pendingPayments.filter((p) => p.status === 'OVERDUE').length,
        },
      },
    });
  } catch (error) {
    console.error('Get pending fees report error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch report' });
  }
};

// Get fee collection report
export const getFeeCollectionReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { startDate, endDate, courseId } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({ success: false, message: 'Start date and end date are required' });
      return;
    }

    const where: any = {
      status: 'PAID',
      paymentDate: {
        gte: new Date(String(startDate)),
        lte: new Date(String(endDate)),
      },
    };

    if (courseId) {
      where.student = { courseId: String(courseId) };
    }

    const payments = await prisma.feePayment.findMany({
      where,
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            registrationNo: true,
            course: { select: { name: true } },
          },
        },
        feeStructure: { select: { name: true } },
      },
      orderBy: { paymentDate: 'desc' },
    });

    // Group by payment method
    const byMethod = await prisma.feePayment.groupBy({
      by: ['paymentMethod'],
      where,
      _sum: { paidAmount: true },
      _count: true,
    });

    const totalCollected = payments.reduce((sum, p) => sum + p.paidAmount, 0);

    res.json({
      success: true,
      data: {
        payments,
        summary: {
          totalCollected,
          totalTransactions: payments.length,
          byMethod,
        },
      },
    });
  } catch (error) {
    console.error('Get fee collection report error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch report' });
  }
};
