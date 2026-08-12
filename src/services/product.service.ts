import { prisma } from '../lib/prisma';

export const productService = {
  create: async (data: { title: string; description?: string; price: number; stock: number; categoryId: string }) => {
    return prisma.product.create({
      data,
      include: {
        category: true,
      },
    });
  },

  findAll: async (filters: { categoryId?: string; minPrice?: number; maxPrice?: number; page?: number; limit?: number }) => {
    const { categoryId, minPrice, maxPrice, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where: any = { isDeleted: false };
    if (categoryId) where.categoryId = categoryId;
    if (minPrice !== undefined) where.price = { ...where.price, gte: minPrice };
    if (maxPrice !== undefined) where.price = { ...where.price, lte: maxPrice };

    const [data, total] = await Promise.all([
      prisma.product.findMany({
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
      prisma.product.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  findById: async (id: string) => {
    return prisma.product.findUnique({
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

  update: async (id: string, data: { title?: string; description?: string; price?: number; stock?: number; categoryId?: string }) => {
    return prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });
  },

  softDelete: async (id: string) => {
    return prisma.product.update({
      where: { id },
      data: { isDeleted: true },
    });
  },
};

export { prisma };
