# Quick Start Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** (comes with Node.js)

## Step-by-Step Setup

### 1. Configure Environment Variables

Copy the example environment file and update it with your settings:

```bash
copy .env.example .env
```

Edit `.env` and update the following:

```env
# Update this with your PostgreSQL credentials
DATABASE_URL="postgresql://username:password@localhost:5432/doctor_directories?schema=public"

# Change this to a secure random string
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

**Example DATABASE_URL:**
```
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/doctor_directories?schema=public"
```

### 2. Install Dependencies

#### Option A: Using the install script (Recommended)
```bash
install.bat
```

#### Option B: Manual installation
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Set Up the Database

```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations (creates tables)
npm run prisma:migrate

# Seed the database with sample data
npm run seed
```

### 4. Start the Application

#### Option A: Using the start script (Recommended)
```bash
start.bat
```

#### Option B: Manual start
```bash
npm run dev
```

This will start both the backend and frontend servers:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## Default Login Credentials

After seeding the database, you can log in with these accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@doctordirectories.com | admin123 |
| Patient | patient@example.com | admin123 |
| Doctor | dr.smith@example.com | admin123 |
| Doctor | dr.johnson@example.com | admin123 |

## Troubleshooting

### Database Connection Issues

If you get a database connection error:

1. Make sure PostgreSQL is running
2. Verify your DATABASE_URL in `.env` is correct
3. Create the database manually if it doesn't exist:
   ```sql
   CREATE DATABASE doctor_directories;
   ```

### Port Already in Use

If port 5000 or 5173 is already in use:

1. Stop the process using that port, or
2. Change the port in:
   - Backend: `.env` file (PORT variable)
   - Frontend: `client/vite.config.ts` (server.port)

### PowerShell Execution Policy Error

If you get an execution policy error when running npm:

```powershell
# Run PowerShell as Administrator and execute:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Or use the `.bat` files instead of PowerShell scripts.

### Missing Dependencies

If you encounter module not found errors:

```bash
# Reinstall backend dependencies
rm -rf node_modules package-lock.json
npm install

# Reinstall frontend dependencies
cd client
rm -rf node_modules package-lock.json
npm install
cd ..
```

## Development Commands

```bash
# Start both server and client
npm run dev

# Start only the backend server
npm run server

# Start only the frontend client
cd client && npm run dev

# View/edit database with Prisma Studio
npm run prisma:studio

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Build frontend for production
cd client && npm run build
```

## Project Structure

```
doctor-directories/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components
│   │   ├── lib/         # Utilities
│   │   └── store/       # State management
│   └── package.json
├── server/              # Express backend
│   ├── controllers/     # Business logic
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   └── index.js
├── prisma/
│   └── schema.prisma    # Database schema
├── .env                 # Environment variables (create this)
└── package.json
```

## Next Steps

1. **Explore the Application**: Log in with different roles to see different features
2. **Read the Documentation**: Check `README.md` for detailed API documentation
3. **Customize**: Modify the code to fit your specific requirements
4. **Deploy**: Follow deployment guides for your hosting platform

## Need Help?

- Check the main `README.md` for detailed documentation
- Review the API endpoints in the README
- Open an issue on the repository for bugs or questions

---

Happy coding! 🚀
