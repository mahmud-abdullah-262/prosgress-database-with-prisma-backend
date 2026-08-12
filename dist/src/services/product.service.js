"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = exports.productService = void 0;
const prisma_1 = require("../lib/prisma");
Object.defineProperty(exports, "prisma", { enumerable: true, get: function () { return prisma_1.prisma; } });
exports.productService = {
    create: async (data) => {
        return prisma_1.prisma.product.create({
            data,
            include: {
                category: true,
            },
        });
    },
    findAll: async (filters) => {
        const { categoryId, minPrice, maxPrice, page = 1, limit = 10 } = filters;
        const skip = (page - 1) * limit;
        const where = { isDeleted: false };
        if (categoryId)
            where.categoryId = categoryId;
        if (minPrice !== undefined)
            where.price = { ...where.price, gte: minPrice };
        if (maxPrice !== undefined)
            where.price = { ...where.price, lte: maxPrice };
        const [data, total] = await Promise.all([
            prisma_1.prisma.product.findMany({
                where,
                include: {
                    category: true,
                    reviews: {
                        where: { isDeleted: false },
                        select: { rating: true },
                    },
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma_1.prisma.product.count({ where }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    },
    findById: async (id) => {
        return prisma_1.prisma.product.findUnique({
            where: { id, isDeleted: false },
            include: {
                category: true,
                reviews: {
                    where: { isDeleted: false },
                    include: {
                        user: {
                            select: { id: true, name: true, email: true },
                        },
                    },
                },
            },
        });
    },
    update: async (id, data) => {
        return prisma_1.prisma.product.update({
            where: { id },
            data,
            include: {
                category: true,
            },
        });
    },
    softDelete: async (id) => {
        return prisma_1.prisma.product.update({
            where: { id },
            data: { isDeleted: true },
        });
    },
};
