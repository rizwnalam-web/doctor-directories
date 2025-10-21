import express from 'express';
import { createReview, getReviewsByDoctor, updateReview, deleteReview } from '../controllers/reviewController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/doctor/:doctorId', getReviewsByDoctor);
router.post('/', authenticate, authorize('PATIENT'), createReview);
router.put('/:id', authenticate, authorize('PATIENT'), updateReview);
router.delete('/:id', authenticate, authorize('PATIENT'), deleteReview);

export default router;
