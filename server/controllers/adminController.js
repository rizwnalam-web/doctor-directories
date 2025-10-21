import prisma from '../config/db.js';

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalPatients,
      totalDoctors,
      verifiedDoctors,
      pendingDoctors,
      totalAppointments,
      pendingAppointments,
      totalReviews
    ] = await Promise.all([
      prisma.user.count(),
      prisma.patient.count(),
      prisma.doctor.count(),
      prisma.doctor.count({ where: { status: 'VERIFIED' } }),
      prisma.doctor.count({ where: { status: 'PENDING' } }),
      prisma.appointment.count(),
      prisma.appointment.count({ where: { status: 'PENDING' } }),
      prisma.review.count()
    ]);

    res.json({
      stats: {
        totalUsers,
        totalPatients,
        totalDoctors,
        verifiedDoctors,
        pendingDoctors,
        totalAppointments,
        pendingAppointments,
        totalReviews
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { role, isActive, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      ...(role && { role }),
      ...(isActive !== undefined && { isActive: isActive === 'true' })
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit),
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
          patient: true,
          doctor: {
            select: {
              id: true,
              status: true,
              licenseNumber: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

export const getPendingDoctors = async (req, res) => {
  try {
    const pendingDoctors = await prisma.doctor.findMany({
      where: { status: 'PENDING' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            createdAt: true
          }
        },
        specializations: {
          include: {
            specialization: true
          }
        },
        educations: true,
        experiences: true
      },
      orderBy: { user: { createdAt: 'asc' } }
    });

    res.json({ doctors: pendingDoctors });
  } catch (error) {
    console.error('Get pending doctors error:', error);
    res.status(500).json({ message: 'Failed to fetch pending doctors', error: error.message });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isActive },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true
      }
    });

    res.json({
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Failed to update user status', error: error.message });
  }
};

export const verifyDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await prisma.doctor.update({
      where: { id },
      data: { status: 'VERIFIED' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    res.json({
      message: 'Doctor verified successfully',
      doctor
    });
  } catch (error) {
    console.error('Verify doctor error:', error);
    res.status(500).json({ message: 'Failed to verify doctor', error: error.message });
  }
};

export const rejectDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const doctor = await prisma.doctor.update({
      where: { id },
      data: { status: 'REJECTED' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    res.json({
      message: 'Doctor application rejected',
      doctor
    });
  } catch (error) {
    console.error('Reject doctor error:', error);
    res.status(500).json({ message: 'Failed to reject doctor', error: error.message });
  }
};
