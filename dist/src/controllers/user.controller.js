"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.getProfile = exports.login = exports.register = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const errorHandler_1 = require("../middlewares/errorHandler");
const user_service_1 = require("../services/user.service");
exports.register = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { name, email, password, role } = req.body;
    const existingUser = await user_service_1.prisma.user.findUnique({
        where: { email },
    });
    if (existingUser) {
        throw new errorHandler_1.AppError('User with this email already exists', 409);
    }
    const hashedPassword = await (0, user_service_1.hashPassword)(password);
    const user = await user_service_1.prisma.user.create({
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
    return (0, apiResponse_1.successResponse)(res, user, 'User registered successfully', 201);
});
exports.login = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    const user = await user_service_1.prisma.user.findUnique({
        where: { email, isDeleted: false },
    });
    if (!user) {
        throw new errorHandler_1.AppError('Invalid email or password', 401);
    }
    const isPasswordValid = await (0, user_service_1.comparePassword)(password, user.password);
    if (!isPasswordValid) {
        throw new errorHandler_1.AppError('Invalid email or password', 401);
    }
    const { password: _, ...userWithoutPassword } = user;
    return (0, apiResponse_1.successResponse)(res, { user: userWithoutPassword }, 'Login successful');
});
exports.getProfile = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const user = await user_service_1.prisma.user.findUnique({
        where: { id: req.user.id, isDeleted: false },
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
        throw new errorHandler_1.AppError('User not found', 404);
    }
    return (0, apiResponse_1.successResponse)(res, user);
});
exports.getAllUsers = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
        user_service_1.prisma.user.findMany({
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
        user_service_1.prisma.user.count({
            where: { isDeleted: false },
        }),
    ]);
    return (0, apiResponse_1.successResponse)(res, {
        data: users,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    });
});
