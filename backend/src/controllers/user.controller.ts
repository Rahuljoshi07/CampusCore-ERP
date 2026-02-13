import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import bcrypt from 'bcryptjs';
const VALID_ROLES = ['SUPER_ADMIN', 'ADMIN', 'FACULTY', 'STUDENT', 'STAFF'];

export const userController = {
  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
          emailVerified: true,
          lastLogin: true,
          createdAt: true,
          studentProfile: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true,
              registrationNo: true,
              rollNo: true,
              currentSemester: true,
              department: { select: { name: true } },
              course: { select: { name: true } },
            },
          },
          facultyProfile: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true,
              employeeId: true,
              designation: true,
              department: { select: { name: true } },
            },
          },
          staffProfile: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              employeeId: true,
              designation: true,
              department: true,
            },
          },
        },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Get profile data based on role
      const profile = user.studentProfile || user.facultyProfile || user.staffProfile;
      
      res.json({
        success: true,
        data: {
          ...user,
          profile,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const { phone, address, city, state, pincode } = req.body;

      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { role: true },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Update profile based on role
      if (user.role === 'STUDENT') {
        await prisma.student.update({
          where: { userId: req.user.id },
          data: {
            ...(phone && { phone }),
            ...(address && { address }),
            ...(city && { city }),
            ...(state && { state }),
            ...(pincode && { pincode }),
          },
        });
      } else if (user.role === 'FACULTY') {
        await prisma.faculty.update({
          where: { userId: req.user.id },
          data: {
            ...(phone && { phone }),
            ...(address && { address }),
            ...(city && { city }),
            ...(state && { state }),
            ...(pincode && { pincode }),
          },
        });
      }

      res.json({
        success: true,
        message: 'Profile updated successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  async getAllUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { search, role, page = '1', limit = '20' } = req.query;
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const skip = (pageNum - 1) * limitNum;

      const where: any = {};
      
      if (search) {
        where.email = { contains: search as string, mode: 'insensitive' };
      }
      
      if (role && VALID_ROLES.includes(role as string)) {
        where.role = role as string;
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          select: {
            id: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
            studentProfile: {
              select: {
                firstName: true,
                lastName: true,
                registrationNo: true,
              },
            },
            facultyProfile: {
              select: {
                firstName: true,
                lastName: true,
                employeeId: true,
              },
            },
            staffProfile: {
              select: {
                firstName: true,
                lastName: true,
                employeeId: true,
              },
            },
          },
          skip,
          take: limitNum,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count({ where }),
      ]);

      // Transform users to include name from profile
      const transformedUsers = users.map(user => {
        const profile = user.studentProfile || user.facultyProfile || user.staffProfile;
        return {
          id: user.id,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
          firstName: profile?.firstName || '',
          lastName: profile?.lastName || '',
        };
      });

      res.json({
        success: true,
        data: {
          users: transformedUsers,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async getUserById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          studentProfile: {
            select: {
              firstName: true,
              lastName: true,
              registrationNo: true,
              department: { select: { name: true } },
              course: { select: { name: true } },
            },
          },
          facultyProfile: {
            select: {
              firstName: true,
              lastName: true,
              employeeId: true,
              department: { select: { name: true } },
            },
          },
          staffProfile: {
            select: {
              firstName: true,
              lastName: true,
              employeeId: true,
            },
          },
        },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateUserRole(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user || req.user.role !== 'ADMIN') {
        throw new AppError('Admin access required', 403);
      }

      const { id } = req.params;
      const { role } = req.body;

      if (!VALID_ROLES.includes(role)) {
        throw new AppError('Invalid role', 400);
      }

      const user = await prisma.user.update({
        where: { id },
        data: { role },
        select: {
          id: true,
          email: true,
          role: true,
        },
      });

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  async deactivateUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user || req.user.role !== 'ADMIN') {
        throw new AppError('Admin access required', 403);
      }

      const { id } = req.params;

      if (id === req.user.id) {
        throw new AppError('Cannot deactivate your own account', 400);
      }

      await prisma.user.update({
        where: { id },
        data: { isActive: false },
      });

      res.json({
        success: true,
        message: 'User deactivated',
      });
    } catch (error) {
      next(error);
    }
  },

  async changePassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const { currentPassword, newPassword } = req.body;

      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        throw new AppError('Current password is incorrect', 400);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);

      await prisma.user.update({
        where: { id: req.user.id },
        data: { password: hashedPassword },
      });

      res.json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteAccount(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const { password } = req.body;

      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new AppError('Invalid password', 400);
      }

      await prisma.user.delete({
        where: { id: req.user.id },
      });

      res.json({
        success: true,
        message: 'Account deleted',
      });
    } catch (error) {
      next(error);
    }
  },
};

