import express from 'express';
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment
} from '../controllers/appointmentController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/', authorize('PATIENT'), createAppointment);
router.get('/', getAppointments);
router.get('/:id', getAppointmentById);
router.put('/:id/status', updateAppointmentStatus);
router.delete('/:id', cancelAppointment);

export default router;
