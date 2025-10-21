import prisma from '../config/db.js';

export const updatePatientProfile = async (req, res) => {
  try {
    const patientId = req.user.patient.id;
    const {
      dateOfBirth,
      gender,
      address,
      city,
      state,
      zipCode,
      emergencyContact,
      medicalHistory
    } = req.body;

    const updatedPatient = await prisma.patient.update({
      where: { id: patientId },
      data: {
        ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
        ...(gender && { gender }),
        ...(address && { address }),
        ...(city && { city }),
        ...(state && { state }),
        ...(zipCode && { zipCode }),
        ...(emergencyContact && { emergencyContact }),
        ...(medicalHistory !== undefined && { medicalHistory })
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            avatar: true
          }
        }
      }
    });

    res.json({
      message: 'Patient profile updated successfully',
      patient: updatedPatient
    });
  } catch (error) {
    console.error('Update patient profile error:', error);
    res.status(500).json({ message: 'Failed to update patient profile', error: error.message });
  }
};
