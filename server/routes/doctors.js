import express from 'express';
import { 
  getDoctors, 
  getDoctorById, 
  updateDoctorProfile,
  addEducation,
  updateEducation,
  deleteEducation,
  addExperience,
  updateExperience,
  deleteExperience,
  updateAvailability,
  searchDoctors
} from '../controllers/doctorController.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes (with optional auth for enhanced data)
router.get('/search', optionalAuth, searchDoctors);
router.get('/', optionalAuth, getDoctors);
router.get('/:id', optionalAuth, getDoctorById);

// Protected routes - Doctor only
router.put('/profile', authenticate, authorize('DOCTOR'), updateDoctorProfile);
router.post('/education', authenticate, authorize('DOCTOR'), addEducation);
router.put('/education/:id', authenticate, authorize('DOCTOR'), updateEducation);
router.delete('/education/:id', authenticate, authorize('DOCTOR'), deleteEducation);
router.post('/experience', authenticate, authorize('DOCTOR'), addExperience);
router.put('/experience/:id', authenticate, authorize('DOCTOR'), updateExperience);
router.delete('/experience/:id', authenticate, authorize('DOCTOR'), deleteExperience);
router.put('/availability', authenticate, authorize('DOCTOR'), updateAvailability);

export default router;
