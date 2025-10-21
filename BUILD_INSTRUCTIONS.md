# Build Instructions for Doctor Directories

## Complete Build and Setup Process

### Prerequisites Check

1. **Verify Node.js Installation**
   ```bash
   node --version  # Should be v18 or higher
   npm --version   # Should be v9 or higher
   ```

2. **Verify PostgreSQL Installation**
   - Ensure PostgreSQL is installed and running
   - Note your database credentials (username, password, port)

### Step 1: Environment Configuration

1. Create `.env` file from template:
   ```bash
   copy .env.example .env
   ```

2. Edit `.env` with your configuration:
   ```env
   # Database Configuration
   DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/doctor_directories?schema=public"
   
   # JWT Configuration
   JWT_SECRET="change-this-to-a-secure-random-string-in-production"
   JWT_EXPIRES_IN="7d"
   
   # Server Configuration
   PORT=5000
   NODE_ENV="development"
   
   # Frontend URL
   CLIENT_URL="http://localhost:5173"
   ```

### Step 2: Install Backend Dependencies

```bash
# From the root directory (doctor-directories/)
npm install
```

**Expected packages to be installed:**
- express
- cors
- dotenv
- bcryptjs
- jsonwebtoken
- @prisma/client
- prisma
- And other dependencies...

**If installation fails:**
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`
- Try again: `npm install`

### Step 3: Install Frontend Dependencies

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install
```

**Expected packages to be installed:**
- react
- react-dom
- react-router-dom
- axios
- zustand
- tailwindcss
- And other dependencies...

```bash
# Return to root directory
cd ..
```

### Step 4: Generate Prisma Client

```bash
npm run prisma:generate
```

This command generates the Prisma Client based on your schema.

**Expected output:**
```
✔ Generated Prisma Client
```

### Step 5: Run Database Migrations

```bash
npm run prisma:migrate
```

**What this does:**
- Creates all database tables
- Sets up relationships
- Applies constraints

**You'll be prompted to name the migration** - you can use: `init` or `initial_setup`

**Expected output:**
```
✔ Database migrations completed
```

**If migration fails:**
- Verify DATABASE_URL is correct
- Ensure PostgreSQL is running
- Check if database exists (create it manually if needed):
  ```sql
  CREATE DATABASE doctor_directories;
  ```

### Step 6: Seed the Database

```bash
npm run seed
```

**What this does:**
- Creates specializations (Cardiology, Dermatology, etc.)
- Creates admin user
- Creates sample patient
- Creates sample doctors with profiles
- Sets up sample data for testing

**Expected output:**
```
Starting seed...
Created specializations: 8
Created admin user
Created sample patient
Created sample doctors
Seed completed successfully!

Default credentials:
Admin: admin@doctordirectories.com / admin123
Patient: patient@example.com / admin123
Doctor 1: dr.smith@example.com / admin123
Doctor 2: dr.johnson@example.com / admin123
```

### Step 7: Build the Application

#### Backend (No build needed - runs directly)
The backend runs directly with Node.js, no build step required.

#### Frontend Build (Optional - for production)
```bash
cd client
npm run build
cd ..
```

This creates an optimized production build in `client/dist/`

### Step 8: Start the Development Servers

#### Option A: Start Both Servers Together (Recommended)
```bash
npm run dev
```

This starts:
- Backend server on http://localhost:5000
- Frontend dev server on http://localhost:5173

#### Option B: Start Servers Separately

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### Verification Steps

1. **Check Backend is Running:**
   - Open browser: http://localhost:5000/api/health
   - Should see: `{"status":"ok","message":"Doctor Directories API is running"}`

2. **Check Frontend is Running:**
   - Open browser: http://localhost:5173
   - Should see the Doctor Directories homepage

3. **Test Login:**
   - Click "Login"
   - Use: admin@doctordirectories.com / admin123
   - Should redirect to admin dashboard

## Common Build Issues and Solutions

### Issue 1: "Cannot find module '@prisma/client'"
**Solution:**
```bash
npm run prisma:generate
```

### Issue 2: "Port 5000 is already in use"
**Solution:**
- Change PORT in `.env` file
- Or stop the process using port 5000

### Issue 3: "Database connection failed"
**Solutions:**
1. Verify PostgreSQL is running
2. Check DATABASE_URL in `.env`
3. Ensure database exists:
   ```sql
   CREATE DATABASE doctor_directories;
   ```

### Issue 4: "Module not found" errors in frontend
**Solution:**
```bash
cd client
rm -rf node_modules package-lock.json
npm install
cd ..
```

### Issue 5: PowerShell script execution errors
**Solution:**
Use `.bat` files instead:
- `install.bat` for installation
- `start.bat` to start servers

Or enable scripts:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue 6: "EACCES" permission errors
**Solution:**
- Run terminal as Administrator
- Or fix npm permissions: https://docs.npmjs.com/resolving-eacces-permissions-errors

## Production Build

### Backend Production Setup
1. Set `NODE_ENV=production` in `.env`
2. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server/index.js --name doctor-directories-api
   ```

### Frontend Production Build
1. Build the frontend:
   ```bash
   cd client
   npm run build
   ```

2. The build output is in `client/dist/`

3. Deploy to:
   - Netlify
   - Vercel
   - AWS S3 + CloudFront
   - Or any static hosting service

4. Update API URL in production build if needed

## Database Management Commands

```bash
# View database in Prisma Studio
npm run prisma:studio

# Create a new migration
npx prisma migrate dev --name your_migration_name

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Apply migrations in production
npx prisma migrate deploy

# Generate Prisma Client
npm run prisma:generate
```

## Development Workflow

1. **Make changes to code**
2. **Backend changes**: Server auto-restarts (nodemon)
3. **Frontend changes**: Page auto-reloads (Vite HMR)
4. **Database schema changes**:
   ```bash
   # Update prisma/schema.prisma
   npm run prisma:migrate
   npm run prisma:generate
   ```

## Testing the Application

### Manual Testing Checklist

- [ ] Homepage loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Doctor search and filters work
- [ ] Doctor profile displays correctly
- [ ] Appointment booking works (Patient)
- [ ] Doctor dashboard accessible
- [ ] Admin dashboard accessible
- [ ] Appointment management works
- [ ] Reviews can be created

### Test User Accounts

Use the seeded accounts to test different roles:

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| Admin | admin@doctordirectories.com | admin123 | Test admin features |
| Patient | patient@example.com | admin123 | Test patient features |
| Doctor | dr.smith@example.com | admin123 | Test doctor features |

## Next Steps After Build

1. **Customize the application** for your needs
2. **Add more specializations** via admin panel
3. **Configure email** settings for notifications
4. **Set up SSL** for production
5. **Configure backups** for database
6. **Set up monitoring** and logging
7. **Deploy to production** environment

## Support

If you encounter issues not covered here:
1. Check the main `README.md`
2. Review `QUICKSTART.md`
3. Check console/terminal for error messages
4. Verify all prerequisites are met

---

**Build Status Indicators:**
- ✅ Dependencies installed
- ✅ Prisma client generated
- ✅ Database migrated
- ✅ Database seeded
- ✅ Servers running

Once all indicators are ✅, your application is ready to use!
