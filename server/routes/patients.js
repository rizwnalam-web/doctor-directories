import express from 'express';
import { updatePatientProfile } from '../controllers/patientController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.put('/profile', authenticate, authorize('PATIENT'), updatePatientProfile);

export default router;
