import prisma from '../lib/prisma';

interface CreateNotificationParams {
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
}

export const notificationService = {
  async create(params: CreateNotificationParams) {
    const { userId, type, title, message, link } = params;

    return prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        link,
      },
    });
  },

  async getUserNotifications(userId: string, page: number = 1, limit: number = 20, unreadOnly: boolean = false) {
    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(unreadOnly && { isRead: false }),
    };

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    return {
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async markAsRead(notificationId: string, userId: string) {
    return prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId,
      },
      data: { isRead: true },
    });
  },

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: { isRead: true },
    });
  },

  async deleteNotification(notificationId: string, userId: string) {
    return prisma.notification.deleteMany({
      where: {
        id: notificationId,
        userId,
      },
    });
  },

  // Helper methods for CampusCore ERP notification types
  async notifyAttendanceMarked(
    userId: string,
    subjectName: string,
    status: string,
    date: string
  ) {
    return this.create({
      userId,
      type: 'attendance',
      title: 'Attendance Marked',
      message: `Your attendance for ${subjectName} on ${date} has been marked as ${status}`,
      link: '/student/attendance',
    });
  },

  async notifyFeePaymentDue(
    userId: string,
    feeType: string,
    amount: number,
    dueDate: string
  ) {
    return this.create({
      userId,
      type: 'fee',
      title: 'Fee Payment Due',
      message: `${feeType} fee of ₹${amount} is due on ${dueDate}`,
      link: '/student/fees',
    });
  },

  async notifyExamSchedule(
    userId: string,
    examName: string,
    subjectName: string,
    date: string
  ) {
    return this.create({
      userId,
      type: 'exam',
      title: 'Exam Scheduled',
      message: `${examName} for ${subjectName} is scheduled on ${date}`,
      link: '/student/exams',
    });
  },

  async notifyExamResult(
    userId: string,
    examName: string,
    subjectName: string
  ) {
    return this.create({
      userId,
      type: 'exam',
      title: 'Exam Result Published',
      message: `Results for ${examName} - ${subjectName} have been published`,
      link: '/student/results',
    });
  },

  async notifyNewNotice(
    userId: string,
    noticeTitle: string
  ) {
    return this.create({
      userId,
      type: 'notice',
      title: 'New Notice',
      message: `New notice: ${noticeTitle}`,
      link: '/notices',
    });
  },

  async notifyLeaveStatus(
    userId: string,
    status: string,
    leaveType: string
  ) {
    return this.create({
      userId,
      type: 'leave',
      title: 'Leave Application Update',
      message: `Your ${leaveType} leave application has been ${status}`,
      link: '/student/leaves',
    });
  },
};
