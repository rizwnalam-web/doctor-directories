import express from 'express';
import { getSpecializations, createSpecialization } from '../controllers/specializationController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getSpecializations);
router.post('/', authenticate, authorize('ADMIN'), createSpecialization);

export default router;
