import { prisma, OrderStatus } from '../lib/prisma';

export const orderService = {
  create: async (userId: string, items: { productId: string; quantity: number; price: number }[]) => {
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return prisma.order.create({
      data: {
        userId,
        totalAmount,
        status: OrderStatus.PENDING,
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

  findAll: async (filters: { userId?: string; status?: OrderStatus; page?: number; limit?: number }) => {
    const { userId, status, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where: any = { isDeleted: false };
    if (userId) where.userId = userId;
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      prisma.order.findMany({
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
      prisma.order.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  findById: async (id: string) => {
    return prisma.order.findUnique({
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

  updateStatus: async (id: string, status: OrderStatus) => {
    return prisma.order.update({
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

  softDelete: async (id: string) => {
    return prisma.order.update({
      where: { id },
      data: { isDeleted: true },
    });
  },
};

export { prisma };
