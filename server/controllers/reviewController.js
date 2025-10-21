import prisma from '../config/db.js';

export const createReview = async (req, res) => {
  try {
    const patientId = req.user.patient.id;
    const { doctorId, rating, comment } = req.body;

    // Check if patient has completed appointment with this doctor
    const completedAppointment = await prisma.appointment.findFirst({
      where: {
        patientId,
        doctorId,
        status: 'COMPLETED'
      }
    });

    if (!completedAppointment) {
      return res.status(403).json({ 
        message: 'You can only review doctors you have had completed appointments with' 
      });
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: {
        patientId_doctorId: {
          patientId,
          doctorId
        }
      }
    });

    if (existingReview) {
      return res.status(409).json({ message: 'You have already reviewed this doctor' });
    }

    const review = await prisma.review.create({
      data: {
        patientId,
        doctorId,
        rating: parseInt(rating),
        comment
      },
      include: {
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true
              }
            }
          }
        }
      }
    });

    res.status(201).json({
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Failed to create review', error: error.message });
  }
};

export const getReviewsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { doctorId },
        skip,
        take: parseInt(limit),
        include: {
          patient: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatar: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.review.count({ where: { doctorId } })
    ]);

    const avgRating = await prisma.review.aggregate({
      where: { doctorId },
      _avg: { rating: true }
    });

    res.json({
      reviews,
      averageRating: avgRating._avg.rating?.toFixed(1) || '0',
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const patientId = req.user.patient.id;
    const { rating, comment } = req.body;

    const review = await prisma.review.findUnique({
      where: { id }
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.patientId !== patientId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        ...(rating && { rating: parseInt(rating) }),
        ...(comment !== undefined && { comment })
      },
      include: {
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true
              }
            }
          }
        }
      }
    });

    res.json({
      message: 'Review updated successfully',
      review: updatedReview
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Failed to update review', error: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const patientId = req.user.patient.id;

    const review = await prisma.review.findUnique({
      where: { id }
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.patientId !== patientId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await prisma.review.delete({
      where: { id }
    });

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Failed to delete review', error: error.message });
  }
};
