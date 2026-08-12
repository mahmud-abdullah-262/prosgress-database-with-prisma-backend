import { prisma } from '../lib/prisma';

export const categoryService = {
  create: async (data: { name: string; description?: string }) => {
    return prisma.category.create({
      data,
    });
  },

  findAll: async () => {
    return prisma.category.findMany({
      where: { isDeleted: false },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  },

  findById: async (id: string) => {
    return prisma.category.findUnique({
      where: { id, isDeleted: false },
      include: {
        products: {
          where: { isDeleted: false },
        },
      },
    });
  },

  update: async (id: string, data: { name?: string; description?: string }) => {
    return prisma.category.update({
      where: { id },
      data,
    });
  },

  softDelete: async (id: string) => {
    return prisma.category.update({
      where: { id },
      data: { isDeleted: true },
    });
  },
};

export { prisma };
