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
    }),
    prisma.specialization.upsert({
      where: { name: 'Gynecology' },
      update: {},
      create: {
        name: 'Gynecology',
        description: 'Women\'s health',
        icon: '👩'
      }
    }),
    prisma.specialization.upsert({
      where: { name: 'Internal Medicine' },
      update: {},
      create: {
        name: 'Internal Medicine',
        description: 'Adult diseases and internal organs',
        icon: '⚕️'
      }
    }),
    prisma.specialization.upsert({
      where: { name: 'Emergency Medicine' },
      update: {},
      create: {
        name: 'Emergency Medicine',
        description: 'Emergency and urgent care',
        icon: '🚑'
      }
    }),
    prisma.specialization.upsert({
      where: { name: 'Radiology' },
      update: {},
      create: {
        name: 'Radiology',
        description: 'Medical imaging and diagnosis',
        icon: '📊'
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

  // Create additional doctors with different specialties
  const doctor3 = await prisma.user.upsert({
    where: { email: 'dr.brown@example.com' },
    update: {},
    create: {
      email: 'dr.brown@example.com',
      password: hashedPassword,
      firstName: 'Emily',
      lastName: 'Brown',
      role: 'DOCTOR',
      phone: '+1234567894',
      doctor: {
        create: {
          licenseNumber: 'MD-54321',
          status: 'VERIFIED',
          bio: 'Pediatrician with expertise in child development and preventive care. Committed to providing compassionate care for children of all ages.',
          yearsOfExperience: 12,
          consultationFee: 100.00,
          address: '321 Children\'s Clinic',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          specializations: {
            create: [
              {
                specialization: {
                  connect: { name: 'Pediatrics' }
                },
                isPrimary: true
              }
            ]
          },
          educations: {
            create: [
              {
                institution: 'University of Chicago',
                degree: 'MD',
                fieldOfStudy: 'Medicine',
                startYear: 2003,
                endYear: 2007
              }
            ]
          },
          experiences: {
            create: [
              {
                hospital: 'Children\'s Hospital of Chicago',
                position: 'Senior Pediatrician',
                startYear: 2009,
                description: 'Providing comprehensive pediatric care'
              }
            ]
          },
          availabilities: {
            create: [
              { dayOfWeek: 1, startTime: '08:00', endTime: '16:00' },
              { dayOfWeek: 2, startTime: '08:00', endTime: '16:00' },
              { dayOfWeek: 3, startTime: '08:00', endTime: '16:00' },
              { dayOfWeek: 4, startTime: '08:00', endTime: '12:00' }
            ]
          }
        }
      }
    }
  });

  const doctor4 = await prisma.user.upsert({
    where: { email: 'dr.davis@example.com' },
    update: {},
    create: {
      email: 'dr.davis@example.com',
      password: hashedPassword,
      firstName: 'Robert',
      lastName: 'Davis',
      role: 'DOCTOR',
      phone: '+1234567895',
      doctor: {
        create: {
          licenseNumber: 'MD-98765',
          status: 'VERIFIED',
          bio: 'Orthopedic surgeon specializing in sports medicine and joint replacement. Helping patients regain mobility and improve quality of life.',
          yearsOfExperience: 18,
          consultationFee: 200.00,
          address: '654 Orthopedic Center',
          city: 'Houston',
          state: 'TX',
          zipCode: '77001',
          specializations: {
            create: [
              {
                specialization: {
                  connect: { name: 'Orthopedics' }
                },
                isPrimary: true
              }
            ]
          },
          educations: {
            create: [
              {
                institution: 'Baylor College of Medicine',
                degree: 'MD',
                fieldOfStudy: 'Medicine',
                startYear: 1997,
                endYear: 2001
              }
            ]
          },
          experiences: {
            create: [
              {
                hospital: 'Texas Medical Center',
                position: 'Chief Orthopedic Surgeon',
                startYear: 2005,
                description: 'Leading orthopedic surgery department'
              }
            ]
          },
          availabilities: {
            create: [
              { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
              { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
              { dayOfWeek: 5, startTime: '09:00', endTime: '15:00' }
            ]
          }
        }
      }
    }
  });

  const doctor5 = await prisma.user.upsert({
    where: { email: 'dr.wilson@example.com' },
    update: {},
    create: {
      email: 'dr.wilson@example.com',
      password: hashedPassword,
      firstName: 'Lisa',
      lastName: 'Wilson',
      role: 'DOCTOR',
      phone: '+1234567896',
      doctor: {
        create: {
          licenseNumber: 'MD-11111',
          status: 'VERIFIED',
          bio: 'Neurologist specializing in stroke care and epilepsy. Dedicated to advancing neurological research and patient care.',
          yearsOfExperience: 14,
          consultationFee: 180.00,
          address: '987 Neuro Center',
          city: 'Phoenix',
          state: 'AZ',
          zipCode: '85001',
          specializations: {
            create: [
              {
                specialization: {
                  connect: { name: 'Neurology' }
                },
                isPrimary: true
              }
            ]
          },
          educations: {
            create: [
              {
                institution: 'University of Arizona',
                degree: 'MD',
                fieldOfStudy: 'Medicine',
                startYear: 2001,
                endYear: 2005
              }
            ]
          },
          experiences: {
            create: [
              {
                hospital: 'Banner University Medical Center',
                position: 'Neurologist',
                startYear: 2007,
                description: 'Specializing in neurological disorders'
              }
            ]
          },
          availabilities: {
            create: [
              { dayOfWeek: 1, startTime: '10:00', endTime: '16:00' },
              { dayOfWeek: 3, startTime: '10:00', endTime: '16:00' },
              { dayOfWeek: 5, startTime: '10:00', endTime: '14:00' }
            ]
          }
        }
      }
    }
  });

  console.log('Created additional doctors');

  // Create more patients
  const patient2 = await prisma.user.upsert({
    where: { email: 'jane.smith@example.com' },
    update: {},
    create: {
      email: 'jane.smith@example.com',
      password: hashedPassword,
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'PATIENT',
      phone: '+1234567897',
      patient: {
        create: {
          dateOfBirth: new Date('1985-06-20'),
          gender: 'Female',
          address: '456 Oak Avenue',
          city: 'Boston',
          state: 'MA',
          zipCode: '02101',
          emergencyContact: '+1234567898',
          medicalHistory: 'Hypertension, seasonal allergies'
        }
      }
    }
  });

  const patient3 = await prisma.user.upsert({
    where: { email: 'mike.wilson@example.com' },
    update: {},
    create: {
      email: 'mike.wilson@example.com',
      password: hashedPassword,
      firstName: 'Mike',
      lastName: 'Wilson',
      role: 'PATIENT',
      phone: '+1234567899',
      patient: {
        create: {
          dateOfBirth: new Date('1978-03-10'),
          gender: 'Male',
          address: '789 Pine Street',
          city: 'Seattle',
          state: 'WA',
          zipCode: '98101',
          emergencyContact: '+1234567800',
          medicalHistory: 'Diabetes Type 2, high cholesterol'
        }
      }
    }
  });

  const patient4 = await prisma.user.upsert({
    where: { email: 'sarah.brown@example.com' },
    update: {},
    create: {
      email: 'sarah.brown@example.com',
      password: hashedPassword,
      firstName: 'Sarah',
      lastName: 'Brown',
      role: 'PATIENT',
      phone: '+1234567801',
      patient: {
        create: {
          dateOfBirth: new Date('1992-11-25'),
          gender: 'Female',
          address: '321 Elm Drive',
          city: 'Denver',
          state: 'CO',
          zipCode: '80201',
          emergencyContact: '+1234567802',
          medicalHistory: 'Asthma, anxiety'
        }
      }
    }
  });

  console.log('Created additional patients');

  // Create sample appointments
  const appointments = await Promise.all([
    prisma.appointment.upsert({
      where: {
        patientId_doctorId_appointmentDate: {
          patientId: patient.id,
          doctorId: doctor1.id,
          appointmentDate: new Date('2024-02-15')
        }
      },
      update: {},
      create: {
        patientId: patient.id,
        doctorId: doctor1.id,
        appointmentDate: new Date('2024-02-15'),
        startTime: '10:00',
        endTime: '11:00',
        status: 'CONFIRMED',
        reason: 'Annual checkup and heart health consultation',
        notes: 'Patient reports occasional chest discomfort'
      }
    }),
    prisma.appointment.upsert({
      where: {
        patientId_doctorId_appointmentDate: {
          patientId: patient2.id,
          doctorId: doctor2.id,
          appointmentDate: new Date('2024-02-16')
        }
      },
      update: {},
      create: {
        patientId: patient2.id,
        doctorId: doctor2.id,
        appointmentDate: new Date('2024-02-16'),
        startTime: '14:00',
        endTime: '15:00',
        status: 'CONFIRMED',
        reason: 'Skin rash consultation',
        notes: 'Rash appeared 3 days ago, mild itching'
      }
    }),
    prisma.appointment.upsert({
      where: {
        patientId_doctorId_appointmentDate: {
          patientId: patient3.id,
          doctorId: doctor3.id,
          appointmentDate: new Date('2024-02-17')
        }
      },
      update: {},
      create: {
        patientId: patient3.id,
        doctorId: doctor3.id,
        appointmentDate: new Date('2024-02-17'),
        startTime: '09:00',
        endTime: '10:00',
        status: 'COMPLETED',
        reason: 'Child vaccination follow-up',
        notes: 'Vaccination series completed successfully'
      }
    })
  ]);

  console.log('Created sample appointments:', appointments.length);

  // Create sample reviews
  const reviews = await Promise.all([
    prisma.review.upsert({
      where: {
        patientId_doctorId: {
          patientId: patient.id,
          doctorId: doctor1.id
        }
      },
      update: {},
      create: {
        patientId: patient.id,
        doctorId: doctor1.id,
        rating: 5,
        comment: 'Dr. Smith is excellent! Very knowledgeable and caring. Explained everything clearly and made me feel comfortable.'
      }
    }),
    prisma.review.upsert({
      where: {
        patientId_doctorId: {
          patientId: patient2.id,
          doctorId: doctor2.id
        }
      },
      update: {},
      create: {
        patientId: patient2.id,
        doctorId: doctor2.id,
        rating: 4,
        comment: 'Dr. Johnson was professional and thorough. The treatment worked well, though the wait time was a bit long.'
      }
    }),
    prisma.review.upsert({
      where: {
        patientId_doctorId: {
          patientId: patient3.id,
          doctorId: doctor3.id
        }
      },
      update: {},
      create: {
        patientId: patient3.id,
        doctorId: doctor3.id,
        rating: 5,
        comment: 'Dr. Brown is wonderful with children! My son felt completely at ease and the appointment went smoothly.'
      }
    })
  ]);

  console.log('Created sample reviews:', reviews.length);

  console.log('Seed completed successfully!');
  console.log('\n=======================================');
  console.log('🎉 COMPREHENSIVE TEST DATA CREATED 🎉');
  console.log('=======================================');
  console.log('\n📊 Database Statistics:');
  console.log(`   • Specializations: ${specializations.length}`);
  console.log(`   • Doctors: 5 (all VERIFIED)`);
  console.log(`   • Patients: 4`);
  console.log(`   • Appointments: ${appointments.length}`);
  console.log(`   • Reviews: ${reviews.length}`);
  console.log('\n🔑 LOGIN CREDENTIALS (Password: admin123):');
  console.log('   👑 Admin: admin@doctordirectories.com');
  console.log('   🏥 Patient 1: patient@example.com');
  console.log('   🏥 Patient 2: jane.smith@example.com');
  console.log('   🏥 Patient 3: mike.wilson@example.com');
  console.log('   🏥 Patient 4: sarah.brown@example.com');
  console.log('   👨‍⚕️ Doctor 1 (Cardiology): dr.smith@example.com');
  console.log('   👩‍⚕️ Doctor 2 (Dermatology): dr.johnson@example.com');
  console.log('   👶 Doctor 3 (Pediatrics): dr.brown@example.com');
  console.log('   🦴 Doctor 4 (Orthopedics): dr.davis@example.com');
  console.log('   🧠 Doctor 5 (Neurology): dr.wilson@example.com');
  console.log('\n🌍 Geographic Coverage:');
  console.log('   • New York, NY • Los Angeles, CA • Chicago, IL');
  console.log('   • Houston, TX • Phoenix, AZ • Boston, MA');
  console.log('   • Seattle, WA • Denver, CO');
  console.log('\n💼 Specialties Available:');
  console.log('   • Cardiology • Dermatology • Pediatrics');
  console.log('   • Orthopedics • Neurology • General Practice');
  console.log('   • Psychiatry • Ophthalmology • Gynecology');
  console.log('   • Internal Medicine • Emergency Medicine • Radiology');
  console.log('\n📅 Sample Appointments Created:');
  console.log('   • Confirmed appointments with detailed notes');
  console.log('   • Completed appointments with reviews');
  console.log('   • Various appointment types and times');
  console.log('\n⭐ Reviews & Ratings:');
  console.log('   • 5-star and 4-star ratings');
  console.log('   • Detailed patient feedback');
  console.log('   • Real-world review scenarios');
  console.log('\n🔄 Ready for Testing:');
  console.log('   • All relationships properly linked');
  console.log('   • Realistic availability schedules');
  console.log('   • Complete education and experience data');
  console.log('   • Mobile-responsive test scenarios');
  console.log('\n=======================================');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
