# Neon Database Setup and Migration

This directory contains scripts to set up and migrate your database with Neon PostgreSQL.

## Neon Database Details
- **Project ID**: restless-sound-17286421
- **Branch**: br-restless-smoke-ah1mx7fi
- **Console URL**: https://console.neon.tech/app/projects/restless-sound-17286421/branches/br-restless-smoke-ah1mx7fi/tables

## Available Scripts

### 1. Windows Batch Script (`setup-neon-db.bat`)
For Windows users with Command Prompt:
```cmd
setup-neon-db.bat
```

### 2. Shell Script (`setup-neon-db.sh`)
For Linux/macOS or Windows with Git Bash/WSL:
```bash
chmod +x setup-neon-db.sh
./setup-neon-db.sh
```

### 3. Node.js Script (`setup-neon-db.js`)
Cross-platform Node.js script:
```bash
node setup-neon-db.js
```

## Prerequisites

1. **Node.js** (version 16 or higher)
2. **npm** or **yarn**
3. **Neon Database URL** - Get this from your Neon console

## Setup Steps

### 1. Configure Database URL

Create or update `server/.env` with your Neon database connection string:

```env
DATABASE_URL="postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

**To get your Neon DATABASE_URL:**
1. Go to [Neon Console](https://console.neon.tech/app/projects/restless-sound-17286421/branches/br-restless-smoke-ah1mx7fi/tables)
2. Navigate to your project dashboard
3. Click on "Connection Details" or "Connect"
4. Copy the PostgreSQL connection string

### 2. Run Setup Script

Choose one of the scripts based on your platform and run it. The script will:

1. ✅ Check prerequisites (Node.js, npm)
2. ✅ Create/verify `.env` file
3. ✅ Install server dependencies
4. ✅ Generate Prisma client
5. ✅ Test database connection
6. ✅ Apply database migrations
7. ✅ Optionally seed sample data
8. ✅ Verify setup

### 3. Manual Migration Commands

If you prefer to run commands manually:

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Apply migrations
npx prisma migrate deploy

# Optional: Reset database (if needed)
npx prisma migrate reset --force

# Optional: Seed data
node seed.js

# Optional: Open Prisma Studio
npx prisma studio
```

## Database Schema

The application uses the following main models:
- **User** - Base user authentication
- **Patient** - Patient profiles and information
- **Doctor** - Doctor profiles, specializations, and availability
- **Appointment** - Booking and scheduling
- **Review** - Patient reviews for doctors
- **Specialization** - Medical specializations

## Troubleshooting

### Connection Issues
- Verify your `DATABASE_URL` is correct
- Check your Neon database is active
- Ensure your IP is whitelisted (if applicable)

### Migration Issues
- Try resetting the database: `npx prisma migrate reset --force`
- Check for schema conflicts
- Verify Prisma schema matches your database

### Dependency Issues
- Clear node_modules: `rm -rf node_modules package-lock.json`
- Reinstall: `npm install`
- Update Prisma: `npm install @prisma/client prisma@latest`

## Environment Variables

Make sure your `server/.env` includes:

```env
# Database
DATABASE_URL="your-neon-connection-string"

# JWT
JWT_SECRET="your-jwt-secret"

# Email (optional for password reset)
SMTP_HOST="your-smtp-host"
SMTP_PORT=587
SMTP_USER="your-email"
SMTP_PASS="your-password"
FROM_EMAIL="your-from-email"

# App
NODE_ENV="production"
PORT=5000
```

## Support

If you encounter issues:
1. Check the Neon console for database status
2. Verify your connection string format
3. Review the error logs in terminal
4. Check Prisma documentation for migration issues