import { Router } from 'express';
import { createReview, getProductReviews, updateReview, deleteReview } from '../controllers/review.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/', authenticate, createReview);
router.get('/product/:productId', getProductReviews);
router.put('/:id', authenticate, updateReview);
router.delete('/:id', authenticate, deleteReview);

export default router;
