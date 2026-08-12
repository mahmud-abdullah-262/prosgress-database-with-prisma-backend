"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = exports.orderService = void 0;
const prisma_1 = require("../lib/prisma");
Object.defineProperty(exports, "prisma", { enumerable: true, get: function () { return prisma_1.prisma; } });
const client_1 = require("@prisma/client");
exports.orderService = {
    create: async (userId, items) => {
        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        return prisma_1.prisma.order.create({
            data: {
                userId,
                totalAmount,
                status: client_1.OrderStatus.PENDING,
                orderItems: {
                    create: items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
    },
    findAll: async (filters) => {
        const { userId, status, page = 1, limit = 10 } = filters;
        const skip = (page - 1) * limit;
        const where = { isDeleted: false };
        if (userId)
            where.userId = userId;
        if (status)
            where.status = status;
        const [data, total] = await Promise.all([
            prisma_1.prisma.order.findMany({
                where,
                include: {
                    orderItems: {
                        include: {
                            product: true,
                        },
                    },
                    user: {
                        select: { id: true, name: true, email: true },
                    },
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma_1.prisma.order.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    },
    findById: async (id) => {
        return prisma_1.prisma.order.findUnique({
            where: { id, isDeleted: false },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
    },
    updateStatus: async (id, status) => {
        return prisma_1.prisma.order.update({
            where: { id },
            data: { status },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });
    },
    softDelete: async (id) => {
        return prisma_1.prisma.order.update({
            where: { id },
            data: { isDeleted: true },
        });
    },
};
