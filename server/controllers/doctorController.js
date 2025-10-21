import prisma from '../config/db.js';

export const searchDoctors = async (req, res) => {
  try {
    const {
      query,
      specialization,
      city,
      state,
      minExperience,
      maxFee,
      minRating,
      page = 1,
      limit = 12
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      status: 'VERIFIED',
      user: { isActive: true },
      ...(query && {
        OR: [
          { user: { firstName: { contains: query, mode: 'insensitive' } } },
          { user: { lastName: { contains: query, mode: 'insensitive' } } },
          { bio: { contains: query, mode: 'insensitive' } }
        ]
      }),
      ...(specialization && {
        specializations: {
          some: {
            specialization: {
              name: { contains: specialization, mode: 'insensitive' }
            }
          }
        }
      }),
      ...(city && { city: { contains: city, mode: 'insensitive' } }),
      ...(state && { state: { contains: state, mode: 'insensitive' } }),
      ...(minExperience && { yearsOfExperience: { gte: parseInt(minExperience) } }),
      ...(maxFee && { consultationFee: { lte: parseFloat(maxFee) } })
    };

    const [doctors, total] = await Promise.all([
      prisma.doctor.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: req.user ? true : false,
              phone: req.user ? true : false,
              avatar: true
            }
          },
          specializations: {
            include: {
              specialization: true
            }
          },
          reviews: {
            select: {
              rating: true
            }
          },
          _count: {
            select: {
              reviews: true,
              appointments: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.doctor.count({ where })
    ]);

    // Calculate average rating for each doctor
    const doctorsWithRatings = doctors.map(doctor => {
      const avgRating = doctor.reviews.length > 0
        ? doctor.reviews.reduce((sum, r) => sum + r.rating, 0) / doctor.reviews.length
        : 0;
      
      const { reviews, ...doctorData } = doctor;
      return {
        ...doctorData,
        averageRating: avgRating.toFixed(1),
        totalReviews: doctor._count.reviews
      };
    });

    // Filter by rating if specified
    let filteredDoctors = doctorsWithRatings;
    if (minRating) {
      filteredDoctors = doctorsWithRatings.filter(
        d => parseFloat(d.averageRating) >= parseFloat(minRating)
      );
    }

    res.json({
      doctors: filteredDoctors,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Search doctors error:', error);
    res.status(500).json({ message: 'Failed to search doctors', error: error.message });
  }
};

export const getDoctors = async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [doctors, total] = await Promise.all([
      prisma.doctor.findMany({
        where: {
          status: 'VERIFIED',
          user: { isActive: true }
        },
        skip,
        take: parseInt(limit),
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: req.user ? true : false,
              phone: req.user ? true : false,
              avatar: true
            }
          },
          specializations: {
            include: {
              specialization: true
            }
          },
          reviews: {
            select: {
              rating: true
            }
          },
          _count: {
            select: {
              reviews: true
            }
          }
        }
      }),
      prisma.doctor.count({
        where: {
          status: 'VERIFIED',
          user: { isActive: true }
        }
      })
    ]);

    const doctorsWithRatings = doctors.map(doctor => {
      const avgRating = doctor.reviews.length > 0
        ? doctor.reviews.reduce((sum, r) => sum + r.rating, 0) / doctor.reviews.length
        : 0;
      
      const { reviews, ...doctorData } = doctor;
      return {
        ...doctorData,
        averageRating: avgRating.toFixed(1),
        totalReviews: doctor._count.reviews
      };
    });

    res.json({
      doctors: doctorsWithRatings,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ message: 'Failed to fetch doctors', error: error.message });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: req.user ? true : false,
            phone: req.user ? true : false,
            avatar: true
          }
        },
        specializations: {
          include: {
            specialization: true
          }
        },
        educations: {
          orderBy: { startYear: 'desc' }
        },
        experiences: {
          orderBy: { startYear: 'desc' }
        },
        availabilities: {
          where: { isActive: true },
          orderBy: { dayOfWeek: 'asc' }
        },
        reviews: {
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
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: {
            reviews: true,
            appointments: true
          }
        }
      }
    });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Calculate average rating
    const avgRating = doctor.reviews.length > 0
      ? doctor.reviews.reduce((sum, r) => sum + r.rating, 0) / doctor.reviews.length
      : 0;

    res.json({
      ...doctor,
      averageRating: avgRating.toFixed(1),
      totalReviews: doctor._count.reviews
    });
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({ message: 'Failed to fetch doctor', error: error.message });
  }
};

export const updateDoctorProfile = async (req, res) => {
  try {
    const doctorId = req.user.doctor.id;
    const {
      bio,
      yearsOfExperience,
      consultationFee,
      address,
      city,
      state,
      zipCode,
      latitude,
      longitude,
      specializationIds
    } = req.body;

    const updatedDoctor = await prisma.doctor.update({
      where: { id: doctorId },
      data: {
        ...(bio !== undefined && { bio }),
        ...(yearsOfExperience !== undefined && { yearsOfExperience: parseInt(yearsOfExperience) }),
        ...(consultationFee !== undefined && { consultationFee: parseFloat(consultationFee) }),
        ...(address !== undefined && { address }),
        ...(city !== undefined && { city }),
        ...(state !== undefined && { state }),
        ...(zipCode !== undefined && { zipCode }),
        ...(latitude !== undefined && { latitude: parseFloat(latitude) }),
        ...(longitude !== undefined && { longitude: parseFloat(longitude) })
      },
      include: {
        user: true,
        specializations: {
          include: {
            specialization: true
          }
        }
      }
    });

    // Update specializations if provided
    if (specializationIds && Array.isArray(specializationIds)) {
      await prisma.doctorSpecialization.deleteMany({
        where: { doctorId }
      });

      await prisma.doctorSpecialization.createMany({
        data: specializationIds.map((specId, index) => ({
          doctorId,
          specializationId: specId,
          isPrimary: index === 0
        }))
      });
    }

    res.json({
      message: 'Profile updated successfully',
      doctor: updatedDoctor
    });
  } catch (error) {
    console.error('Update doctor profile error:', error);
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};

export const addEducation = async (req, res) => {
  try {
    const doctorId = req.user.doctor.id;
    const { institution, degree, fieldOfStudy, startYear, endYear, description } = req.body;

    const education = await prisma.education.create({
      data: {
        doctorId,
        institution,
        degree,
        fieldOfStudy,
        startYear: parseInt(startYear),
        endYear: endYear ? parseInt(endYear) : null,
        description
      }
    });

    res.status(201).json({
      message: 'Education added successfully',
      education
    });
  } catch (error) {
    console.error('Add education error:', error);
    res.status(500).json({ message: 'Failed to add education', error: error.message });
  }
};

export const updateEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user.doctor.id;
    const { institution, degree, fieldOfStudy, startYear, endYear, description } = req.body;

    const education = await prisma.education.updateMany({
      where: { id, doctorId },
      data: {
        ...(institution && { institution }),
        ...(degree && { degree }),
        ...(fieldOfStudy && { fieldOfStudy }),
        ...(startYear && { startYear: parseInt(startYear) }),
        ...(endYear !== undefined && { endYear: endYear ? parseInt(endYear) : null }),
        ...(description !== undefined && { description })
      }
    });

    if (education.count === 0) {
      return res.status(404).json({ message: 'Education not found' });
    }

    res.json({ message: 'Education updated successfully' });
  } catch (error) {
    console.error('Update education error:', error);
    res.status(500).json({ message: 'Failed to update education', error: error.message });
  }
};

export const deleteEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user.doctor.id;

    const result = await prisma.education.deleteMany({
      where: { id, doctorId }
    });

    if (result.count === 0) {
      return res.status(404).json({ message: 'Education not found' });
    }

    res.json({ message: 'Education deleted successfully' });
  } catch (error) {
    console.error('Delete education error:', error);
    res.status(500).json({ message: 'Failed to delete education', error: error.message });
  }
};

export const addExperience = async (req, res) => {
  try {
    const doctorId = req.user.doctor.id;
    const { hospital, position, startYear, endYear, description } = req.body;

    const experience = await prisma.experience.create({
      data: {
        doctorId,
        hospital,
        position,
        startYear: parseInt(startYear),
        endYear: endYear ? parseInt(endYear) : null,
        description
      }
    });

    res.status(201).json({
      message: 'Experience added successfully',
      experience
    });
  } catch (error) {
    console.error('Add experience error:', error);
    res.status(500).json({ message: 'Failed to add experience', error: error.message });
  }
};

export const updateExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user.doctor.id;
    const { hospital, position, startYear, endYear, description } = req.body;

    const experience = await prisma.experience.updateMany({
      where: { id, doctorId },
      data: {
        ...(hospital && { hospital }),
        ...(position && { position }),
        ...(startYear && { startYear: parseInt(startYear) }),
        ...(endYear !== undefined && { endYear: endYear ? parseInt(endYear) : null }),
        ...(description !== undefined && { description })
      }
    });

    if (experience.count === 0) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    res.json({ message: 'Experience updated successfully' });
  } catch (error) {
    console.error('Update experience error:', error);
    res.status(500).json({ message: 'Failed to update experience', error: error.message });
  }
};

export const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user.doctor.id;

    const result = await prisma.experience.deleteMany({
      where: { id, doctorId }
    });

    if (result.count === 0) {
      return res.status(404).json({ message: 'Experience not found' });
    }

    res.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Delete experience error:', error);
    res.status(500).json({ message: 'Failed to delete experience', error: error.message });
  }
};

export const updateAvailability = async (req, res) => {
  try {
    const doctorId = req.user.doctor.id;
    const { availabilities } = req.body;

    // Delete existing availabilities
    await prisma.availability.deleteMany({
      where: { doctorId }
    });

    // Create new availabilities
    if (availabilities && Array.isArray(availabilities)) {
      await prisma.availability.createMany({
        data: availabilities.map(av => ({
          doctorId,
          dayOfWeek: parseInt(av.dayOfWeek),
          startTime: av.startTime,
          endTime: av.endTime,
          isActive: av.isActive !== false
        }))
      });
    }

    const updatedAvailabilities = await prisma.availability.findMany({
      where: { doctorId },
      orderBy: { dayOfWeek: 'asc' }
    });

    res.json({
      message: 'Availability updated successfully',
      availabilities: updatedAvailabilities
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({ message: 'Failed to update availability', error: error.message });
  }
};
