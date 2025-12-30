#!/bin/bash

echo "========================================"
echo "Neon Database Setup and Migration Script"
echo "========================================"
echo

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Setting up Neon Database Environment${NC}"
echo "Neon Project: restless-sound-17286421"
echo "Branch: br-restless-smoke-ah1mx7fi"
echo

# Check if .env exists in server directory
if [ ! -f "server/.env" ]; then
    echo -e "${YELLOW}Creating server/.env file...${NC}"
    touch "server/.env"
else
    echo -e "${GREEN}Found existing server/.env file${NC}"
fi

echo -e "${BLUE}Step 2: Configuring Database URL${NC}"
echo "Please ensure your server/.env file contains:"
echo -e "${YELLOW}DATABASE_URL=\"postgresql://[username]:[password]@[host]/[database]?sslmode=require\"${NC}"
echo
echo "For Neon, your DATABASE_URL should look like:"
echo -e "${YELLOW}DATABASE_URL=\"postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require\"${NC}"
echo

# Navigate to server directory
cd server || exit 1

echo -e "${BLUE}Step 3: Installing dependencies...${NC}"
npm install

echo
echo -e "${BLUE}Step 4: Generating Prisma client...${NC}"
npx prisma generate

echo
echo -e "${BLUE}Step 5: Checking database connection...${NC}"
if npx prisma db pull --schema=./prisma/schema.prisma >/dev/null 2>&1; then
    echo -e "${GREEN}Connection successful!${NC}"
else
    echo -e "${RED}Warning: Could not connect to database. Please verify your DATABASE_URL${NC}"
    echo
    read -p "Press Enter to continue or Ctrl+C to exit..."
    exit 1
fi

echo
echo -e "${BLUE}Step 6: Applying database migrations...${NC}"
if ! npx prisma migrate deploy; then
    echo
    echo -e "${YELLOW}Migration failed. Attempting to reset and migrate...${NC}"
    echo "This will recreate your database schema."
    read -p "Continue? (y/N): " confirm
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
        echo "Migration cancelled."
        exit 1
    fi
    
    echo -e "${YELLOW}Resetting database...${NC}"
    npx prisma migrate reset --force
    npx prisma migrate deploy
fi

echo
echo -e "${BLUE}Step 7: Seeding database with initial data...${NC}"
read -p "Do you want to seed the database with sample data? (y/N): " seed
if [[ $seed =~ ^[Yy]$ ]]; then
    if node seed.js; then
        echo -e "${GREEN}Database seeded successfully!${NC}"
    else
        echo -e "${YELLOW}Warning: Database seeding failed or was skipped.${NC}"
    fi
fi

echo
echo -e "${BLUE}Step 8: Verification${NC}"
echo "Running database introspection to verify setup..."
if npx prisma db pull --print >/dev/null 2>&1; then
    echo -e "${GREEN}Database schema verified successfully!${NC}"
else
    echo -e "${YELLOW}Warning: Could not verify database schema.${NC}"
fi

echo
echo "========================================"
echo -e "${GREEN}Neon Database Setup Complete!${NC}"
echo "========================================"
echo
echo "Your database is ready at:"
echo -e "${BLUE}https://console.neon.tech/app/projects/restless-sound-17286421/branches/br-restless-smoke-ah1mx7fi/tables${NC}"
echo
echo "Next steps:"
echo "1. Your server can now connect to Neon database"
echo "2. Update your production environment variables"
echo "3. Deploy your application"
echo

# Navigate back to root
cd ..

echo "Setup completed successfully!"