# Environment Setup Guide

## 🚀 Quick Setup

### For Development:
```bash
# 1. Copy development environment file
cp .env.development .env

# 2. Update .env with your local settings
# Edit .env file with your database and email credentials

# 3. Install dependencies
npm install

# 4. Start development servers
npm run dev
```

### For Production (Render):
```bash
# 1. Copy production environment file
cp .env.production .env

# 2. Update .env with your production settings
# Edit .env file with production database and email credentials

# 3. Deploy to Render (see RENDER_DEPLOYMENT.md)
```

## 📁 Environment Files Explained

### `.env.development`
- **Purpose:** Local development settings
- **Database:** Local PostgreSQL
- **Email:** Your personal Gmail (for testing)
- **Frontend URL:** http://localhost:5173

### `.env.production`
- **Purpose:** Production deployment settings
- **Database:** Render PostgreSQL
- **Email:** Production email service
- **Frontend URL:** Your production domain

### `.env.example`
- **Purpose:** Template for both environments
- **Usage:** Copy to create new environment files
- **Note:** Never commit real credentials!

## 🔧 Required Setup Steps

### 1. Database Setup
```bash
# For development (local PostgreSQL)
createdb doctor_directories

# For production (handled by Render)
# Database is created automatically in Render
```

### 2. Email Setup
```bash
# For Gmail (both development and production)
# 1. Enable 2-Factor Authentication
# 2. Generate App Password: Google Account → Security → App passwords
# 3. Use the 16-character app password in EMAIL_PASS
```

### 3. Environment Variables
Update these values in your `.env` file:

**Development:**
```env
DATABASE_URL="postgresql://your-username:your-password@localhost:5432/doctor_directories"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-16-character-app-password"
```

**Production:**
```env
DATABASE_URL="postgresql://user:pass@host:5432/db"  # From Render
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-16-character-app-password"
CLIENT_URL="https://your-app-name.onrender.com"
```

## 🧪 Testing Your Setup

### Development Testing:
```bash
npm run dev
# Visit: http://localhost:5173
# Test: Registration, login, password reset
```

### Production Testing:
```bash
npm run build
# Deploy to Render
# Test: All functionality on production URL
```

## 🔒 Security Notes

- ✅ **Development credentials** are safe locally
- ✅ **Production credentials** configured in hosting platform
- ✅ **No secrets** committed to version control
- ✅ **App passwords** used instead of real passwords
- ✅ **Strong JWT secrets** required for production

## 📚 Troubleshooting

### Common Issues:

**Database Connection Failed:**
- Verify DATABASE_URL format
- Check PostgreSQL is running
- Ensure credentials are correct

**Email Not Sending:**
- Verify app password (not regular password)
- Check Gmail app password generation
- Test with different email provider

**Build Fails:**
- Check Node.js version compatibility
- Verify all environment variables set
- Clear node_modules and reinstall

## 🚦 Environment Indicators

The application will show which environment it's running in:
- **Development:** Shows demo credentials, relaxed security
- **Production:** Full security, no demo data, optimized performance

**Your environment is now properly configured! 🎉**
