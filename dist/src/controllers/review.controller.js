"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.updateReview = exports.getProductReviews = exports.createReview = void 0;
const errorHandler_1 = require("../middlewares/errorHandler");
const review_service_1 = require("../services/review.service");
const apiResponse_1 = require("../utils/apiResponse");
exports.createReview = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { rating, comment, productId } = req.body;
    const userId = req.user.id;
    const review = await review_service_1.reviewService.create({
        rating,
        comment,
        userId,
        productId,
    });
    return (0, apiResponse_1.successResponse)(res, review, 'Review created successfully', 201);
});
exports.getProductReviews = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { productId } = req.params;
    const reviews = await review_service_1.reviewService.findByProduct(productId);
    return (0, apiResponse_1.successResponse)(res, reviews);
});
exports.updateReview = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;
    const review = await review_service_1.reviewService.update(id, userId, { rating, comment });
    return (0, apiResponse_1.successResponse)(res, review, 'Review updated successfully');
});
exports.deleteReview = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    await review_service_1.reviewService.softDelete(id, userId);
    return (0, apiResponse_1.successResponse)(res, null, 'Review deleted successfully');
});
