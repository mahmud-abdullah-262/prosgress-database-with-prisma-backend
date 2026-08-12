import { Response } from 'express';
import { asyncHandler, AppError } from '../middlewares/errorHandler';
import { orderService, prisma } from '../services/order.service';
import { successResponse } from '../utils/apiResponse';

export const createOrder = asyncHandler(async (req: any, res: Response) => {
  const { items } = req.body;
  const userId = req.user!.id;

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new AppError('Order items are required', 400);
  }

  const order = await orderService.create(userId, items);
  return successResponse(res, order, 'Order created successfully', 201);
});

export const getOrders = asyncHandler(async (req: any, res: Response) => {
  const userId = req.user!.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const status = req.query.status as string | undefined;

  const result = await orderService.findAll({
    userId,
    status: status as any,
    page,
    limit,
  });

  return successResponse(res, result);
});

export const getOrderById = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;

  const order = await orderService.findById(id);

  if (!order || order.userId !== userId) {
    throw new AppError('Order not found', 404);
  }

  return successResponse(res, order);
});

export const updateOrderStatus = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await prisma.order.findUnique({
    where: { id },
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  const updated = await orderService.updateStatus(id, status);
  return successResponse(res, updated, 'Order status updated successfully');
});
