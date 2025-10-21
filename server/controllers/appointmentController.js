import prisma from '../config/db.js';

export const createAppointment = async (req, res) => {
  try {
    const patientId = req.user.patient.id;
    const { doctorId, appointmentDate, startTime, endTime, reason, notes } = req.body;

    // Check if doctor exists and is verified
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId, status: 'VERIFIED' }
    });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found or not verified' });
    }

    // Check for conflicting appointments
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId,
        appointmentDate: new Date(appointmentDate),
        status: { in: ['PENDING', 'CONFIRMED'] },
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } }
            ]
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } }
            ]
          }
        ]
      }
    });

    if (conflictingAppointment) {
      return res.status(409).json({ message: 'Time slot is already booked' });
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        appointmentDate: new Date(appointmentDate),
        startTime,
        endTime,
        reason,
        notes,
        status: 'PENDING'
      },
      include: {
        doctor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true
              }
            }
          }
        },
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true
              }
            }
          }
        }
      }
    });

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ message: 'Failed to create appointment', error: error.message });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    
    let where = {};
    
    if (req.user.role === 'PATIENT') {
      where.patientId = req.user.patient.id;
    } else if (req.user.role === 'DOCTOR') {
      where.doctorId = req.user.doctor.id;
    } else {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.appointmentDate = {};
      if (startDate) where.appointmentDate.gte = new Date(startDate);
      if (endDate) where.appointmentDate.lte = new Date(endDate);
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        doctor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
                phone: true,
                email: true
              }
            },
            specializations: {
              include: {
                specialization: true
              }
            }
          }
        },
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
                phone: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: [
        { appointmentDate: 'asc' },
        { startTime: 'asc' }
      ]
    });

    res.json({ appointments });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        doctor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
                phone: true,
                email: true
              }
            },
            specializations: {
              include: {
                specialization: true
              }
            }
          }
        },
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
                phone: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check authorization
    const isPatient = req.user.role === 'PATIENT' && appointment.patientId === req.user.patient.id;
    const isDoctor = req.user.role === 'DOCTOR' && appointment.doctorId === req.user.doctor.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isPatient && !isDoctor && !isAdmin) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json({ appointment });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ message: 'Failed to fetch appointment', error: error.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await prisma.appointment.findUnique({
      where: { id }
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Only doctor can confirm/complete, patient can cancel their own
    const isDoctor = req.user.role === 'DOCTOR' && appointment.doctorId === req.user.doctor.id;
    const isPatient = req.user.role === 'PATIENT' && appointment.patientId === req.user.patient.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isDoctor && !isPatient && !isAdmin) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Validate status transitions
    if (isPatient && status !== 'CANCELLED') {
      return res.status(403).json({ message: 'Patients can only cancel appointments' });
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: { status },
      include: {
        doctor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        },
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    res.json({
      message: 'Appointment status updated successfully',
      appointment: updatedAppointment
    });
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({ message: 'Failed to update appointment', error: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await prisma.appointment.findUnique({
      where: { id }
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const isPatient = req.user.role === 'PATIENT' && appointment.patientId === req.user.patient.id;
    const isDoctor = req.user.role === 'DOCTOR' && appointment.doctorId === req.user.doctor.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isPatient && !isDoctor && !isAdmin) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({ message: 'Failed to cancel appointment', error: error.message });
  }
};
