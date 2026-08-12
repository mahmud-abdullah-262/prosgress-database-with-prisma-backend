import { Response } from 'express';
import { asyncHandler, AppError } from '../middlewares/errorHandler';
import { productService, prisma } from '../services/product.service';
import { successResponse } from '../utils/apiResponse';

export const createProduct = asyncHandler(async (req: any, res: Response) => {
  const { title, description, price, stock, categoryId } = req.body;

  const product = await productService.create({
    title,
    description,
    price,
    stock,
    categoryId,
  });

  return successResponse(res, product, 'Product created successfully', 201);
});

export const getProducts = asyncHandler(async (req: any, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const { categoryId, minPrice, maxPrice } = req.query;

  const result = await productService.findAll({
    categoryId: categoryId as string | undefined,
    minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
    page,
    limit,
  });

  return successResponse(res, result);
});

export const getProductById = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;
  const product = await productService.findById(id);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  return successResponse(res, product);
});

export const updateProduct = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;
  const { title, description, price, stock, categoryId } = req.body;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product || product.isDeleted) {
    throw new AppError('Product not found', 404);
  }

  const updated = await productService.update(id, {
    title,
    description,
    price,
    stock,
    categoryId,
  });

  return successResponse(res, updated, 'Product updated successfully');
});

export const deleteProduct = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product || product.isDeleted) {
    throw new AppError('Product not found', 404);
  }

  await productService.softDelete(id);
  return successResponse(res, null, 'Product deleted successfully');
});
