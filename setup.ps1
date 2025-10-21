# Doctor Directories Setup Script for Windows
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Doctor Directories - Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed. Please install Node.js v18 or higher." -ForegroundColor Red
    exit 1
}

# Check if PostgreSQL is accessible
Write-Host "Checking PostgreSQL..." -ForegroundColor Yellow
Write-Host "Please ensure PostgreSQL is installed and running." -ForegroundColor Yellow
Write-Host ""

# Check if .env file exists
if (-Not (Test-Path ".env")) {
    Write-Host "Creating .env file from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ .env file created. Please update it with your database credentials." -ForegroundColor Green
    Write-Host ""
    Write-Host "IMPORTANT: Edit the .env file and configure:" -ForegroundColor Red
    Write-Host "  - DATABASE_URL (PostgreSQL connection string)" -ForegroundColor Yellow
    Write-Host "  - JWT_SECRET (change to a secure random string)" -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Press Enter after updating .env file to continue, or 'q' to quit"
    if ($continue -eq 'q') {
        exit 0
    }
}

# Install backend dependencies
Write-Host ""
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Backend dependencies installed" -ForegroundColor Green

# Install frontend dependencies
Write-Host ""
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location client
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}
Set-Location ..
Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green

# Generate Prisma client
Write-Host ""
Write-Host "Generating Prisma client..." -ForegroundColor Yellow
npm run prisma:generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Prisma client generated" -ForegroundColor Green

# Run database migrations
Write-Host ""
Write-Host "Running database migrations..." -ForegroundColor Yellow
Write-Host "This will create the database tables." -ForegroundColor Yellow
npm run prisma:migrate
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to run migrations. Please check your DATABASE_URL in .env" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Database migrations completed" -ForegroundColor Green

# Seed the database
Write-Host ""
Write-Host "Seeding database with sample data..." -ForegroundColor Yellow
npm run seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to seed database" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Database seeded successfully" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Default credentials:" -ForegroundColor Yellow
Write-Host "  Admin:   admin@doctordirectories.com / admin123" -ForegroundColor White
Write-Host "  Patient: patient@example.com / admin123" -ForegroundColor White
Write-Host "  Doctor:  dr.smith@example.com / admin123" -ForegroundColor White
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Yellow
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "The application will be available at:" -ForegroundColor Yellow
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "  Backend:  http://localhost:5000" -ForegroundColor White
Write-Host ""
