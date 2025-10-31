import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function checkPasswordResetTable() {
    try {
        // Try to query the table
        const result = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'password_reset_tokens'
      );
    `;

        console.log('Table exists check:', result);

        if (result[0].exists) {
            // Check table structure
            const columns = await prisma.$queryRaw`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'password_reset_tokens'
        ORDER BY ordinal_position;
      `;

            console.log('\nTable structure:');
            console.table(columns);

            // Check if there are any existing records
            const count = await prisma.passwordResetToken.count();
            console.log('\nExisting records:', count);
        } else {
            console.log('Table does not exist! Running migration...');

            // Create the table using Prisma migrate
            await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
          "id" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "token" TEXT NOT NULL,
          "expiresAt" TIMESTAMP(3) NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          
          CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id"),
          CONSTRAINT "password_reset_tokens_token_key" UNIQUE ("token"),
          CONSTRAINT "password_reset_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
        );
      `;

            console.log('Table created successfully!');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkPasswordResetTable().catch(console.error);