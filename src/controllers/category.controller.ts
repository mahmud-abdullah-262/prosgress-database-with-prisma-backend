import { Response } from 'express';
import { asyncHandler, AppError } from '../middlewares/errorHandler';
import { categoryService, prisma } from '../services/category.service';
import { successResponse, errorResponse } from '../utils/apiResponse';

export const createCategory = asyncHandler(async (req: any, res: Response) => {
  const { name, description } = req.body;

  const existing = await prisma.category.findUnique({
    where: { name },
  });

  if (existing && !existing.isDeleted) {
    throw new AppError('Category with this name already exists', 409);
  }

  const category = await categoryService.create({ name, description });
  return successResponse(res, category, 'Category created successfully', 201);
});

export const getAllCategories = asyncHandler(async (req: any, res: Response) => {
  const categories = await categoryService.findAll();
  return successResponse(res, categories);
});

export const getCategoryById = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;
  const category = await categoryService.findById(id);

  if (!category) {
    throw new AppError('Category not found', 404);
  }

  return successResponse(res, category);
});

export const updateCategory = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category || category.isDeleted) {
    throw new AppError('Category not found', 404);
  }

  const updated = await categoryService.update(id, { name, description });
  return successResponse(res, updated, 'Category updated successfully');
});

export const deleteCategory = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;

  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category || category.isDeleted) {
    throw new AppError('Category not found', 404);
  }

  await categoryService.softDelete(id);
  return successResponse(res, null, 'Category deleted successfully');
});
