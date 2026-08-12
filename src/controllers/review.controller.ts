import { Response } from 'express';
import { asyncHandler, AppError } from '../middlewares/errorHandler';
import { reviewService } from '../services/review.service';
import { successResponse } from '../utils/apiResponse';

export const createReview = asyncHandler(async (req: any, res: Response) => {
  const { rating, comment, productId } = req.body;
  const userId = req.user!.id;

  const review = await reviewService.create({
    rating,
    comment,
    userId,
    productId,
  });

  return successResponse(res, review, 'Review created successfully', 201);
});

export const getProductReviews = asyncHandler(async (req: any, res: Response) => {
  const { productId } = req.params;

  const reviews = await reviewService.findByProduct(productId);
  return successResponse(res, reviews);
});

export const updateReview = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user!.id;

  const review = await reviewService.update(id, userId, { rating, comment });
  return successResponse(res, review, 'Review updated successfully');
});

export const deleteReview = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;

  await reviewService.softDelete(id, userId);
  return successResponse(res, null, 'Review deleted successfully');
});
