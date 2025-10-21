import express from 'express';
import {
  getAllUsers,
  updateUserStatus,
  verifyDoctor,
  rejectDoctor,
  getDashboardStats,
  getPendingDoctors
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require admin authentication
router.use(authenticate, authorize('ADMIN'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/doctors/pending', getPendingDoctors);
router.put('/users/:id/status', updateUserStatus);
router.put('/doctors/:id/verify', verifyDoctor);
router.put('/doctors/:id/reject', rejectDoctor);

export default router;
