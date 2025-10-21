import prisma from '../config/db.js';

export const getSpecializations = async (req, res) => {
  try {
    const specializations = await prisma.specialization.findMany({
      include: {
        _count: {
          select: { doctors: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json({ specializations });
  } catch (error) {
    console.error('Get specializations error:', error);
    res.status(500).json({ message: 'Failed to fetch specializations', error: error.message });
  }
};

export const createSpecialization = async (req, res) => {
  try {
    const { name, description, icon } = req.body;

    const specialization = await prisma.specialization.create({
      data: { name, description, icon }
    });

    res.status(201).json({
      message: 'Specialization created successfully',
      specialization
    });
  } catch (error) {
    console.error('Create specialization error:', error);
    res.status(500).json({ message: 'Failed to create specialization', error: error.message });
  }
};
