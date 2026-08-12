"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = exports.categoryService = void 0;
const prisma_1 = require("../lib/prisma");
Object.defineProperty(exports, "prisma", { enumerable: true, get: function () { return prisma_1.prisma; } });
exports.categoryService = {
    create: async (data) => {
        return prisma_1.prisma.category.create({
            data,
        });
    },
    findAll: async () => {
        return prisma_1.prisma.category.findMany({
            where: { isDeleted: false },
            include: {
                _count: {
                    select: { products: true },
                },
            },
        });
    },
    findById: async (id) => {
        return prisma_1.prisma.category.findUnique({
            where: { id, isDeleted: false },
            include: {
                products: {
                    where: { isDeleted: false },
                },
            },
        });
    },
    update: async (id, data) => {
        return prisma_1.prisma.category.update({
            where: { id },
            data,
        });
    },
    softDelete: async (id) => {
        return prisma_1.prisma.category.update({
            where: { id },
            data: { isDeleted: true },
        });
    },
};
