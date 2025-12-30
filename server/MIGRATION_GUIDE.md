# Simple Neon Database Migration

This project now uses a simple Node.js migration system instead of Prisma migrations for direct control over the database schema.

## Migration Files

- **`server/migrate-neon.js`** - Main migration script
- **`migrate-neon.bat`** - Windows batch script to run migration
- **`server/config/database.js`** - Database connection and helper methods

## Quick Start

### 1. Setup Environment
Ensure your `server/.env` contains:
```env
DATABASE_URL="postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### 2. Run Migration

**Option A: Windows Batch Script**
```cmd
migrate-neon.bat
```

**Option B: Manual Commands**
```bash
cd server
npm install
node migrate-neon.js
```

**Option C: NPM Script**
```bash
cd server
npm run migrate
```

## What the Migration Does

1. ✅ Creates database enums (`UserRole`, `AppointmentStatus`, `DoctorStatus`)
2. ✅ Creates all tables with proper structure
3. ✅ Sets up indexes for performance
4. ✅ Creates foreign key relationships
5. ✅ Inserts initial specialization data
6. ✅ Verifies migration success

## Database Schema

### Tables Created:
- **users** - Base user authentication
- **patients** - Patient profiles
- **doctors** - Doctor profiles and info
- **specializations** - Medical specializations
- **doctor_specializations** - Doctor-specialty relationships
- **educations** - Doctor education history
- **experiences** - Doctor work experience
- **availabilities** - Doctor scheduling
- **appointments** - Booking system
- **reviews** - Patient reviews
- **password_reset_tokens** - Password reset functionality

### Default Specializations:
- General Medicine
- Cardiology  
- Dermatology
- Orthopedics
- Pediatrics
- Gynecology
- Neurology
- Psychiatry

## Database Usage

The new `server/config/database.js` provides helper methods:

```javascript
import db from './config/database.js';

// Basic queries
const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

// Helper methods
const user = await db.findById('users', userId);
const user = await db.findByEmail(email);
const newUser = await db.create('users', userData);
const updatedUser = await db.update('users', userId, updateData);
const deletedUser = await db.delete('users', userId);
```

## Advantages Over Prisma

- ✅ **No Prisma Client Generation** - Eliminates EPERM errors
- ✅ **Direct SQL Control** - Full control over queries
- ✅ **Lighter Dependencies** - Only requires `pg` package
- ✅ **Faster Startup** - No code generation step
- ✅ **Simpler Debugging** - Direct SQL queries
- ✅ **Better Error Messages** - PostgreSQL native errors

## Troubleshooting

### Migration Fails
- Check DATABASE_URL format
- Verify Neon database is active
- Ensure network connectivity

### Connection Issues  
- Verify SSL settings in connection string
- Check Neon console for database status
- Test connection: `node -e "import('./migrate-neon.js')"`

### Table Already Exists
The migration uses `CREATE TABLE IF NOT EXISTS` and `ON CONFLICT` clauses, so it's safe to run multiple times.

## Rollback (if needed)

To drop all tables and start fresh:
```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```

Then run the migration again.

## Next Steps

1. ✅ Migration completed
2. Update controllers to use new database config
3. Test API endpoints
4. Deploy to production

Your Neon database is ready at:
https://console.neon.tech/app/projects/restless-sound-17286421/branches/br-restless-smoke-ah1mx7fi/tables