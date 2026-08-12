"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getOrderById = exports.getOrders = exports.createOrder = void 0;
const errorHandler_1 = require("../middlewares/errorHandler");
const order_service_1 = require("../services/order.service");
const apiResponse_1 = require("../utils/apiResponse");
exports.createOrder = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { items } = req.body;
    const userId = req.user.id;
    if (!items || !Array.isArray(items) || items.length === 0) {
        throw new errorHandler_1.AppError('Order items are required', 400);
    }
    const order = await order_service_1.orderService.create(userId, items);
    return (0, apiResponse_1.successResponse)(res, order, 'Order created successfully', 201);
});
exports.getOrders = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const result = await order_service_1.orderService.findAll({
        userId,
        status: status,
        page,
        limit,
    });
    return (0, apiResponse_1.successResponse)(res, result);
});
exports.getOrderById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const order = await order_service_1.orderService.findById(id);
    if (!order || order.userId !== userId) {
        throw new errorHandler_1.AppError('Order not found', 404);
    }
    return (0, apiResponse_1.successResponse)(res, order);
});
exports.updateOrderStatus = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const order = await order_service_1.prisma.order.findUnique({
        where: { id },
    });
    if (!order) {
        throw new errorHandler_1.AppError('Order not found', 404);
    }
    const updated = await order_service_1.orderService.updateStatus(id, status);
    return (0, apiResponse_1.successResponse)(res, updated, 'Order status updated successfully');
});
