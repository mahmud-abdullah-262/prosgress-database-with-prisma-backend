"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const errorHandler_1 = require("../middlewares/errorHandler");
const product_service_1 = require("../services/product.service");
const apiResponse_1 = require("../utils/apiResponse");
exports.createProduct = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { title, description, price, stock, categoryId } = req.body;
    const product = await product_service_1.productService.create({
        title,
        description,
        price,
        stock,
        categoryId,
    });
    return (0, apiResponse_1.successResponse)(res, product, 'Product created successfully', 201);
});
exports.getProducts = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { categoryId, minPrice, maxPrice } = req.query;
    const result = await product_service_1.productService.findAll({
        categoryId: categoryId,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        page,
        limit,
    });
    return (0, apiResponse_1.successResponse)(res, result);
});
exports.getProductById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const product = await product_service_1.productService.findById(id);
    if (!product) {
        throw new errorHandler_1.AppError('Product not found', 404);
    }
    return (0, apiResponse_1.successResponse)(res, product);
});
exports.updateProduct = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { title, description, price, stock, categoryId } = req.body;
    const product = await product_service_1.prisma.product.findUnique({
        where: { id },
    });
    if (!product || product.isDeleted) {
        throw new errorHandler_1.AppError('Product not found', 404);
    }
    const updated = await product_service_1.productService.update(id, {
        title,
        description,
        price,
        stock,
        categoryId,
    });
    return (0, apiResponse_1.successResponse)(res, updated, 'Product updated successfully');
});
exports.deleteProduct = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const product = await product_service_1.prisma.product.findUnique({
        where: { id },
    });
    if (!product || product.isDeleted) {
        throw new errorHandler_1.AppError('Product not found', 404);
    }
    await product_service_1.productService.softDelete(id);
    return (0, apiResponse_1.successResponse)(res, null, 'Product deleted successfully');
});
