"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getCategoryById = exports.getAllCategories = exports.createCategory = void 0;
const errorHandler_1 = require("../middlewares/errorHandler");
const category_service_1 = require("../services/category.service");
const apiResponse_1 = require("../utils/apiResponse");
exports.createCategory = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { name, description } = req.body;
    const existing = await category_service_1.prisma.category.findUnique({
        where: { name },
    });
    if (existing && !existing.isDeleted) {
        throw new errorHandler_1.AppError('Category with this name already exists', 409);
    }
    const category = await category_service_1.categoryService.create({ name, description });
    return (0, apiResponse_1.successResponse)(res, category, 'Category created successfully', 201);
});
exports.getAllCategories = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const categories = await category_service_1.categoryService.findAll();
    return (0, apiResponse_1.successResponse)(res, categories);
});
exports.getCategoryById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const category = await category_service_1.categoryService.findById(id);
    if (!category) {
        throw new errorHandler_1.AppError('Category not found', 404);
    }
    return (0, apiResponse_1.successResponse)(res, category);
});
exports.updateCategory = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const category = await category_service_1.prisma.category.findUnique({
        where: { id },
    });
    if (!category || category.isDeleted) {
        throw new errorHandler_1.AppError('Category not found', 404);
    }
    const updated = await category_service_1.categoryService.update(id, { name, description });
    return (0, apiResponse_1.successResponse)(res, updated, 'Category updated successfully');
});
exports.deleteCategory = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const category = await category_service_1.prisma.category.findUnique({
        where: { id },
    });
    if (!category || category.isDeleted) {
        throw new errorHandler_1.AppError('Category not found', 404);
    }
    await category_service_1.categoryService.softDelete(id);
    return (0, apiResponse_1.successResponse)(res, null, 'Category deleted successfully');
});
