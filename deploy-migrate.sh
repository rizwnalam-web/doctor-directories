# Production Database Migration Commands
# Run these AFTER creating your Render services

# 1. Install Render CLI (if you want to run commands remotely)
npm install -g @render/cli
render login

# 2. Or run these commands locally with production DATABASE_URL:
# Replace with your actual Render database URL
export DATABASE_URL="postgresql://username:password@host:5432/database"

# 3. Generate Prisma client for production
npx prisma generate

# 4. Deploy database schema to production
npx prisma migrate deploy

# 5. Seed the database (optional)
node server/seed.js

# 6. Verify database connection
npx prisma studio --browser none
