import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create specializations
  const specializations = await Promise.all([
    prisma.specialization.upsert({
      where: { name: 'Cardiology' },
      update: {},
      create: {
        name: 'Cardiology',
        description: 'Heart and cardiovascular system',
        icon: '❤️'
      }
    }),
    prisma.specialization.upsert({
      where: { name: 'Dermatology' },
      update: {},
      create: {
        name: 'Dermatology',
        description: 'Skin, hair, and nails',
        icon: '🧴'
      }
    }),
    prisma.specialization.upsert({
      where: { name: 'Pediatrics' },
      update: {},
      create: {
        name: 'Pediatrics',
        description: 'Children\'s health',
        icon: '👶'
      }
    }),
    prisma.specialization.upsert({
      where: { name: 'Orthopedics' },
      update: {},
      create: {
        name: 'Orthopedics',
        description: 'Bones, joints, and muscles',
        icon: '🦴'
      }
    }),
    prisma.specialization.upsert({
      where: { name: 'Neurology' },
      update: {},
      create: {
        name: 'Neurology',
        description: 'Brain and nervous system',
        icon: '🧠'
      }
    }),
    prisma.specialization.upsert({
      where: { name: 'General Practice' },
      update: {},
      create: {
        name: 'General Practice',
        description: 'Primary care and general health',
        icon: '🏥'
      }
    }),
    prisma.specialization.upsert({
      where: { name: 'Psychiatry' },
      update: {},
      create: {
        name: 'Psychiatry',
        description: 'Mental health',
        icon: '🧘'
      }
    }),
    prisma.specialization.upsert({
      where: { name: 'Ophthalmology' },
      update: {},
      create: {
        name: 'Ophthalmology',
        description: 'Eye care',
        icon: '👁️'
      }
    })
  ]);

  console.log('Created specializations:', specializations.length);

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@doctordirectories.com' },
    update: {},
    create: {
      email: 'admin@doctordirectories.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      phone: '+1234567890'
    }
  });

  console.log('Created admin user');

  // Create sample patient
  const patient = await prisma.user.upsert({
    where: { email: 'patient@example.com' },
    update: {},
    create: {
      email: 'patient@example.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'PATIENT',
      phone: '+1234567891',
      patient: {
        create: {
          dateOfBirth: new Date('1990-01-15'),
          gender: 'Male',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001'
        }
      }
    }
  });

  console.log('Created sample patient');

  // Create sample doctors
  const doctor1 = await prisma.user.upsert({
    where: { email: 'dr.smith@example.com' },
    update: {},
    create: {
      email: 'dr.smith@example.com',
      password: hashedPassword,
      firstName: 'Sarah',
      lastName: 'Smith',
      role: 'DOCTOR',
      phone: '+1234567892',
      doctor: {
        create: {
          licenseNumber: 'MD-12345',
          status: 'VERIFIED',
          bio: 'Experienced cardiologist with over 15 years of practice. Specialized in interventional cardiology and heart disease prevention.',
          yearsOfExperience: 15,
          consultationFee: 150.00,
          address: '456 Medical Plaza',
          city: 'New York',
          state: 'NY',
          zipCode: '10002',
          specializations: {
            create: [
              {
                specialization: {
                  connect: { name: 'Cardiology' }
                },
                isPrimary: true
              }
            ]
          },
          educations: {
            create: [
              {
                institution: 'Harvard Medical School',
                degree: 'MD',
                fieldOfStudy: 'Medicine',
                startYear: 2000,
                endYear: 2004
              },
              {
                institution: 'Johns Hopkins University',
                degree: 'Residency',
                fieldOfStudy: 'Cardiology',
                startYear: 2004,
                endYear: 2008
              }
            ]
          },
          experiences: {
            create: [
              {
                hospital: 'New York Presbyterian Hospital',
                position: 'Senior Cardiologist',
                startYear: 2008,
                description: 'Leading cardiology department'
              }
            ]
          },
          availabilities: {
            create: [
              { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
              { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
              { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
              { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
              { dayOfWeek: 5, startTime: '09:00', endTime: '13:00' }
            ]
          }
        }
      }
    }
  });

  const doctor2 = await prisma.user.upsert({
    where: { email: 'dr.johnson@example.com' },
    update: {},
    create: {
      email: 'dr.johnson@example.com',
      password: hashedPassword,
      firstName: 'Michael',
      lastName: 'Johnson',
      role: 'DOCTOR',
      phone: '+1234567893',
      doctor: {
        create: {
          licenseNumber: 'MD-67890',
          status: 'VERIFIED',
          bio: 'Board-certified dermatologist specializing in cosmetic and medical dermatology.',
          yearsOfExperience: 10,
          consultationFee: 120.00,
          address: '789 Health Center',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90001',
          specializations: {
            create: [
              {
                specialization: {
                  connect: { name: 'Dermatology' }
                },
                isPrimary: true
              }
            ]
          },
          educations: {
            create: [
              {
                institution: 'Stanford University',
                degree: 'MD',
                fieldOfStudy: 'Medicine',
                startYear: 2005,
                endYear: 2009
              }
            ]
          },
          experiences: {
            create: [
              {
                hospital: 'UCLA Medical Center',
                position: 'Dermatologist',
                startYear: 2012,
                description: 'Providing comprehensive skin care'
              }
            ]
          },
          availabilities: {
            create: [
              { dayOfWeek: 1, startTime: '10:00', endTime: '18:00' },
              { dayOfWeek: 3, startTime: '10:00', endTime: '18:00' },
              { dayOfWeek: 5, startTime: '10:00', endTime: '18:00' }
            ]
          }
        }
      }
    }
  });

  console.log('Created sample doctors');

  console.log('Seed completed successfully!');
  console.log('\nDefault credentials:');
  console.log('Admin: admin@doctordirectories.com / admin123');
  console.log('Patient: patient@example.com / admin123');
  console.log('Doctor 1: dr.smith@example.com / admin123');
  console.log('Doctor 2: dr.johnson@example.com / admin123');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
