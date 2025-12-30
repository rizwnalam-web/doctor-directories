#!/usr/bin/env node

/**
 * Simple Node.js Database Migration for Neon PostgreSQL
 * Bypasses Prisma migrations and creates schema directly
 */

import { Client } from 'pg';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') });

console.log('🚀 Starting Neon Database Migration...');
console.log('====================================');

class NeonMigration {
    constructor() {
        this.databaseUrl = process.env.DATABASE_URL;
        if (!this.databaseUrl) {
            console.error('❌ DATABASE_URL environment variable is required');
            console.log('Please set DATABASE_URL in your .env file:');
            console.log('DATABASE_URL="postgresql://username:password@host/database?sslmode=require"');
            process.exit(1);
        }
        
        this.client = new Client({
            connectionString: this.databaseUrl,
            ssl: { rejectUnauthorized: false }
        });
    }

    async connect() {
        try {
            await this.client.connect();
            console.log('✅ Connected to Neon database');
        } catch (error) {
            throw new Error(`Failed to connect to database: ${error.message}`);
        }
    }

    async disconnect() {
        await this.client.end();
        console.log('🔌 Disconnected from database');
    }

    async createEnums() {
        console.log('📝 Creating enums...');
        
        const enumQueries = [
            `CREATE TYPE "UserRole" AS ENUM ('GUEST', 'PATIENT', 'DOCTOR', 'ADMIN')`,
            `CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED')`,
            `CREATE TYPE "DoctorStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED')`
        ];

        for (const query of enumQueries) {
            try {
                await this.client.query(query);
                console.log(`✅ Created enum: ${query.split('"')[1]}`);
            } catch (error) {
                if (error.code === '42710') { // Type already exists
                    console.log(`⚠️  Enum already exists: ${query.split('"')[1]}`);
                } else {
                    throw error;
                }
            }
        }
    }

    async createTables() {
        console.log('🏗️  Creating tables...');

        const tables = [
            {
                name: 'users',
                query: `
                    CREATE TABLE IF NOT EXISTS "users" (
                        "id" TEXT NOT NULL,
                        "email" TEXT NOT NULL,
                        "password" TEXT NOT NULL,
                        "role" "UserRole" NOT NULL DEFAULT 'PATIENT',
                        "firstName" TEXT NOT NULL,
                        "lastName" TEXT NOT NULL,
                        "phone" TEXT,
                        "avatar" TEXT,
                        "isActive" BOOLEAN NOT NULL DEFAULT true,
                        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        CONSTRAINT "users_pkey" PRIMARY KEY ("id")
                    )
                `
            },
            {
                name: 'patients',
                query: `
                    CREATE TABLE IF NOT EXISTS "patients" (
                        "id" TEXT NOT NULL,
                        "userId" TEXT NOT NULL,
                        "dateOfBirth" TIMESTAMP(3),
                        "gender" TEXT,
                        "address" TEXT,
                        "city" TEXT,
                        "state" TEXT,
                        "zipCode" TEXT,
                        "emergencyContact" TEXT,
                        "medicalHistory" TEXT,
                        CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
                    )
                `
            },
            {
                name: 'doctors',
                query: `
                    CREATE TABLE IF NOT EXISTS "doctors" (
                        "id" TEXT NOT NULL,
                        "userId" TEXT NOT NULL,
                        "status" "DoctorStatus" NOT NULL DEFAULT 'PENDING',
                        "licenseNumber" TEXT NOT NULL,
                        "bio" TEXT,
                        "yearsOfExperience" INTEGER,
                        "consultationFee" DOUBLE PRECISION,
                        "address" TEXT,
                        "city" TEXT,
                        "state" TEXT,
                        "zipCode" TEXT,
                        "latitude" DOUBLE PRECISION,
                        "longitude" DOUBLE PRECISION,
                        CONSTRAINT "doctors_pkey" PRIMARY KEY ("id")
                    )
                `
            },
            {
                name: 'specializations',
                query: `
                    CREATE TABLE IF NOT EXISTS "specializations" (
                        "id" TEXT NOT NULL,
                        "name" TEXT NOT NULL,
                        "description" TEXT,
                        "icon" TEXT,
                        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        CONSTRAINT "specializations_pkey" PRIMARY KEY ("id")
                    )
                `
            },
            {
                name: 'doctor_specializations',
                query: `
                    CREATE TABLE IF NOT EXISTS "doctor_specializations" (
                        "id" TEXT NOT NULL,
                        "doctorId" TEXT NOT NULL,
                        "specializationId" TEXT NOT NULL,
                        "isPrimary" BOOLEAN NOT NULL DEFAULT false,
                        CONSTRAINT "doctor_specializations_pkey" PRIMARY KEY ("id")
                    )
                `
            },
            {
                name: 'educations',
                query: `
                    CREATE TABLE IF NOT EXISTS "educations" (
                        "id" TEXT NOT NULL,
                        "doctorId" TEXT NOT NULL,
                        "institution" TEXT NOT NULL,
                        "degree" TEXT NOT NULL,
                        "fieldOfStudy" TEXT NOT NULL,
                        "startYear" INTEGER NOT NULL,
                        "endYear" INTEGER,
                        "description" TEXT,
                        CONSTRAINT "educations_pkey" PRIMARY KEY ("id")
                    )
                `
            },
            {
                name: 'experiences',
                query: `
                    CREATE TABLE IF NOT EXISTS "experiences" (
                        "id" TEXT NOT NULL,
                        "doctorId" TEXT NOT NULL,
                        "hospital" TEXT NOT NULL,
                        "position" TEXT NOT NULL,
                        "startYear" INTEGER NOT NULL,
                        "endYear" INTEGER,
                        "description" TEXT,
                        CONSTRAINT "experiences_pkey" PRIMARY KEY ("id")
                    )
                `
            },
            {
                name: 'availabilities',
                query: `
                    CREATE TABLE IF NOT EXISTS "availabilities" (
                        "id" TEXT NOT NULL,
                        "doctorId" TEXT NOT NULL,
                        "dayOfWeek" INTEGER NOT NULL,
                        "startTime" TEXT NOT NULL,
                        "endTime" TEXT NOT NULL,
                        "isActive" BOOLEAN NOT NULL DEFAULT true,
                        CONSTRAINT "availabilities_pkey" PRIMARY KEY ("id")
                    )
                `
            },
            {
                name: 'appointments',
                query: `
                    CREATE TABLE IF NOT EXISTS "appointments" (
                        "id" TEXT NOT NULL,
                        "patientId" TEXT NOT NULL,
                        "doctorId" TEXT NOT NULL,
                        "appointmentDate" TIMESTAMP(3) NOT NULL,
                        "startTime" TEXT NOT NULL,
                        "endTime" TEXT NOT NULL,
                        "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING',
                        "reason" TEXT,
                        "notes" TEXT,
                        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
                    )
                `
            },
            {
                name: 'reviews',
                query: `
                    CREATE TABLE IF NOT EXISTS "reviews" (
                        "id" TEXT NOT NULL,
                        "patientId" TEXT NOT NULL,
                        "doctorId" TEXT NOT NULL,
                        "rating" INTEGER NOT NULL,
                        "comment" TEXT,
                        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
                    )
                `
            },
            {
                name: 'password_reset_tokens',
                query: `
                    CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
                        "id" TEXT NOT NULL,
                        "userId" TEXT NOT NULL,
                        "token" TEXT NOT NULL,
                        "expiresAt" TIMESTAMP(3) NOT NULL,
                        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
                    )
                `
            }
        ];

        for (const table of tables) {
            try {
                await this.client.query(table.query);
                console.log(`✅ Created table: ${table.name}`);
            } catch (error) {
                throw new Error(`Failed to create table ${table.name}: ${error.message}`);
            }
        }
    }

    async createIndexes() {
        console.log('🔍 Creating indexes...');

        const indexes = [
            'CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email")',
            'CREATE UNIQUE INDEX IF NOT EXISTS "patients_userId_key" ON "patients"("userId")',
            'CREATE UNIQUE INDEX IF NOT EXISTS "doctors_userId_key" ON "doctors"("userId")',
            'CREATE UNIQUE INDEX IF NOT EXISTS "doctors_licenseNumber_key" ON "doctors"("licenseNumber")',
            'CREATE UNIQUE INDEX IF NOT EXISTS "specializations_name_key" ON "specializations"("name")',
            'CREATE UNIQUE INDEX IF NOT EXISTS "doctor_specializations_doctorId_specializationId_key" ON "doctor_specializations"("doctorId", "specializationId")',
            'CREATE UNIQUE INDEX IF NOT EXISTS "reviews_patientId_doctorId_key" ON "reviews"("patientId", "doctorId")',
            'CREATE UNIQUE INDEX IF NOT EXISTS "password_reset_tokens_token_key" ON "password_reset_tokens"("token")'
        ];

        for (const indexQuery of indexes) {
            try {
                await this.client.query(indexQuery);
                const indexName = indexQuery.match(/"([^"]+)"/g)[0];
                console.log(`✅ Created index: ${indexName}`);
            } catch (error) {
                console.log(`⚠️  Index might already exist: ${error.message}`);
            }
        }
    }

    async createForeignKeys() {
        console.log('🔗 Creating foreign key constraints...');

        const foreignKeys = [
            'ALTER TABLE "patients" ADD CONSTRAINT "patients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE',
            'ALTER TABLE "doctors" ADD CONSTRAINT "doctors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE',
            'ALTER TABLE "doctor_specializations" ADD CONSTRAINT "doctor_specializations_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE',
            'ALTER TABLE "doctor_specializations" ADD CONSTRAINT "doctor_specializations_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "specializations"("id") ON DELETE CASCADE ON UPDATE CASCADE',
            'ALTER TABLE "educations" ADD CONSTRAINT "educations_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE',
            'ALTER TABLE "experiences" ADD CONSTRAINT "experiences_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE',
            'ALTER TABLE "availabilities" ADD CONSTRAINT "availabilities_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE',
            'ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE',
            'ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE',
            'ALTER TABLE "reviews" ADD CONSTRAINT "reviews_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE',
            'ALTER TABLE "reviews" ADD CONSTRAINT "reviews_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE',
            'ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE'
        ];

        for (const fkQuery of foreignKeys) {
            try {
                await this.client.query(fkQuery);
                const constraintName = fkQuery.match(/"([^"]+_fkey)"/)[1];
                console.log(`✅ Created foreign key: ${constraintName}`);
            } catch (error) {
                if (error.code === '42710') { // Constraint already exists
                    const constraintName = fkQuery.match(/"([^"]+_fkey)"/)[1];
                    console.log(`⚠️  Foreign key already exists: ${constraintName}`);
                } else {
                    const constraintName = fkQuery.match(/"([^"]+_fkey)"/)?.[1] || 'unknown';
                    console.log(`⚠️  Foreign key creation failed for ${constraintName}: ${error.message}`);
                }
            }
        }
    }

    async insertInitialData() {
        console.log('🌱 Inserting initial data...');

        // Insert default specializations
        const specializations = [
            { id: 'uuid-1', name: 'General Medicine', description: 'Primary healthcare and general medical services', icon: 'stethoscope' },
            { id: 'uuid-2', name: 'Cardiology', description: 'Heart and cardiovascular system', icon: 'heart' },
            { id: 'uuid-3', name: 'Dermatology', description: 'Skin, hair, and nail conditions', icon: 'user' },
            { id: 'uuid-4', name: 'Orthopedics', description: 'Bone, joint, and muscle disorders', icon: 'bone' },
            { id: 'uuid-5', name: 'Pediatrics', description: 'Medical care for infants, children, and adolescents', icon: 'baby' },
            { id: 'uuid-6', name: 'Gynecology', description: 'Women\'s reproductive health', icon: 'female' },
            { id: 'uuid-7', name: 'Neurology', description: 'Brain and nervous system disorders', icon: 'brain' },
            { id: 'uuid-8', name: 'Psychiatry', description: 'Mental health and behavioral disorders', icon: 'mind' }
        ];

        for (const spec of specializations) {
            try {
                await this.client.query(
                    'INSERT INTO specializations (id, name, description, icon) VALUES ($1, $2, $3, $4) ON CONFLICT (name) DO NOTHING',
                    [spec.id, spec.name, spec.description, spec.icon]
                );
                console.log(`✅ Added specialization: ${spec.name}`);
            } catch (error) {
                console.log(`⚠️  Specialization might already exist: ${spec.name}`);
            }
        }
    }

    async verifyMigration() {
        console.log('🔍 Verifying migration...');
        
        try {
            const result = await this.client.query(`
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_type = 'BASE TABLE'
                ORDER BY table_name
            `);
            
            const tables = result.rows.map(row => row.table_name);
            console.log('✅ Tables created:', tables.join(', '));
            
            const countResult = await this.client.query('SELECT COUNT(*) FROM specializations');
            console.log(`✅ Specializations inserted: ${countResult.rows[0].count}`);
            
            return true;
        } catch (error) {
            console.error('❌ Verification failed:', error.message);
            return false;
        }
    }

    async run() {
        console.log('🚀 Starting Neon database migration...');
        console.log('=====================================');
        
        try {
            await this.connect();
            await this.createEnums();
            await this.createTables();
            await this.createIndexes();
            await this.createForeignKeys();
            await this.insertInitialData();
            
            const verified = await this.verifyMigration();
            
            if (verified) {
                console.log('=====================================');
                console.log('✅ Migration completed successfully!');
                console.log('🌐 Your Neon database is ready to use');
                console.log('🔗 Console: https://console.neon.tech/app/projects/restless-sound-17286421');
            } else {
                throw new Error('Migration verification failed');
            }
            
        } catch (error) {
            console.error('❌ Migration failed:', error.message);
            process.exit(1);
        } finally {
            await this.disconnect();
        }
    }
}

// Run migration if called directly
const scriptPath = fileURLToPath(import.meta.url);
const isMainModule = process.argv[1] === scriptPath;

if (isMainModule) {
    const migration = new NeonMigration();
    migration.run().catch(error => {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    });
}

export default NeonMigration;