import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/apiResponse';
import { asyncHandler, AppError } from '../middlewares/errorHandler';
import { userService, hashPassword, comparePassword } from '../services/user.service';
import { authenticate } from '../middlewares/auth';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  const existingUser = await userService.prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError('User with this email already exists', 409);
  }

  const hashedPassword = await hashPassword(password);

  const user = await userService.prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || 'USER',
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return successResponse(res, user, 'User registered successfully', 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await userService.prisma.user.findUnique({
    where: { email, isDeleted: false },
  });

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  const { password: _, ...userWithoutPassword } = user;

  return successResponse(res, { user: userWithoutPassword }, 'Login successful');
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.prisma.user.findUnique({
    where: { id: req.user!.id, isDeleted: false },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return successResponse(res, user);
});

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    userService.prisma.user.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    userService.prisma.user.count({
      where: { isDeleted: false },
    }),
  ]);

  return successResponse(res, {
    data: users,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
});
