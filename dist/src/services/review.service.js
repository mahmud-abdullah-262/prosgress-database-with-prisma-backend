"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = exports.reviewService = void 0;
const prisma_1 = require("../lib/prisma");
Object.defineProperty(exports, "prisma", { enumerable: true, get: function () { return prisma_1.prisma; } });
exports.reviewService = {
    create: async (data) => {
        return prisma_1.prisma.review.create({
            data,
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
                product: {
                    select: { id: true, title: true },
                },
            },
        });
    },
    findByProduct: async (productId) => {
        return prisma_1.prisma.review.findMany({
            where: { productId, isDeleted: false },
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    },
    update: async (id, userId, data) => {
        const review = await prisma_1.prisma.review.findUnique({
            where: { id },
        });
        if (!review || review.userId !== userId) {
            throw new Error('Review not found or unauthorized');
        }
        return prisma_1.prisma.review.update({
            where: { id },
            data,
            include: {
                user: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
    },
    softDelete: async (id, userId) => {
        const review = await prisma_1.prisma.review.findUnique({
            where: { id },
        });
        if (!review || review.userId !== userId) {
            throw new Error('Review not found or unauthorized');
        }
        return prisma_1.prisma.review.update({
            where: { id },
            data: { isDeleted: true },
        });
    },
};
