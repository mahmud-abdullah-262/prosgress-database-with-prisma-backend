import { prisma } from '../lib/prisma';

export const reviewService = {
  create: async (data: { rating: number; comment?: string; userId: string; productId: string }) => {
    return prisma.review.create({
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

  findByProduct: async (productId: string) => {
    return prisma.review.findMany({
      where: { productId, isDeleted: false },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  update: async (id: string, userId: string, data: { rating?: number; comment?: string }) => {
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review || review.userId !== userId) {
      throw new Error('Review not found or unauthorized');
    }

    return prisma.review.update({
      where: { id },
      data,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  },

  softDelete: async (id: string, userId: string) => {
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review || review.userId !== userId) {
      throw new Error('Review not found or unauthorized');
    }

    return prisma.review.update({
      where: { id },
      data: { isDeleted: true },
    });
  },
};

export { prisma };
