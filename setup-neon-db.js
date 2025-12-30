#!/usr/bin/env node

/**
 * Neon Database Setup and Migration Script
 * Automated setup for Neon PostgreSQL database
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

const log = (message, color = colors.reset) => {
    console.log(`${color}${message}${colors.reset}`);
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// Neon database configuration
const NEON_CONFIG = {
    project: 'restless-sound-17286421',
    branch: 'br-restless-smoke-ah1mx7fi',
    consoleUrl: 'https://console.neon.tech/app/projects/restless-sound-17286421/branches/br-restless-smoke-ah1mx7fi/tables'
};

class NeonDatabaseSetup {
    constructor() {
        this.serverPath = join(__dirname, 'server');
        this.envPath = join(this.serverPath, '.env');
    }

    async run() {
        try {
            log('========================================', colors.cyan);
            log('Neon Database Setup and Migration Script', colors.cyan);
            log('========================================', colors.cyan);
            console.log();

            await this.checkPrerequisites();
            await this.setupEnvironment();
            await this.installDependencies();
            await this.generatePrismaClient();
            await this.testConnection();
            await this.applyMigrations();
            await this.seedDatabase();
            await this.verifySetup();

            this.printSuccessMessage();
        } catch (error) {
            log(`Error: ${error.message}`, colors.red);
            process.exit(1);
        } finally {
            rl.close();
        }
    }

    async checkPrerequisites() {
        log('Step 1: Checking prerequisites...', colors.blue);

        try {
            execSync('node --version', { stdio: 'pipe' });
            execSync('npm --version', { stdio: 'pipe' });
            log('✓ Node.js and npm are installed', colors.green);
        } catch (error) {
            throw new Error('Node.js or npm not found. Please install Node.js first.');
        }

        log(`Neon Project: ${NEON_CONFIG.project}`, colors.yellow);
        log(`Branch: ${NEON_CONFIG.branch}`, colors.yellow);
        console.log();
    }

    async setupEnvironment() {
        log('Step 2: Setting up environment...', colors.blue);

        if (!existsSync(this.envPath)) {
            log('Creating server/.env file...', colors.yellow);
            writeFileSync(this.envPath, '');
        } else {
            log('✓ Found existing server/.env file', colors.green);
        }

        // Check if DATABASE_URL is configured
        if (existsSync(this.envPath)) {
            const envContent = readFileSync(this.envPath, 'utf8');
            if (!envContent.includes('DATABASE_URL')) {
                log('⚠ DATABASE_URL not found in .env file', colors.yellow);
                console.log('Please ensure your server/.env file contains:');
                log('DATABASE_URL="postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"', colors.cyan);

                const proceed = await question('\nPress Enter to continue once you\'ve set up DATABASE_URL, or type "exit" to quit: ');
                if (proceed.toLowerCase() === 'exit') {
                    process.exit(0);
                }
            }
        }
        console.log();
    }

    async installDependencies() {
        log('Step 3: Installing dependencies...', colors.blue);
        try {
            process.chdir(this.serverPath);
            execSync('npm install', { stdio: 'inherit' });
            log('✓ Dependencies installed successfully', colors.green);
        } catch (error) {
            throw new Error('Failed to install dependencies');
        }
        console.log();
    }

    async generatePrismaClient() {
        log('Step 4: Generating Prisma client...', colors.blue);

        let attempts = 0;
        const maxAttempts = 3;

        while (attempts < maxAttempts) {
            attempts++;

            try {
                if (attempts > 1) {
                    log(`Attempt ${attempts}/${maxAttempts}: Retrying Prisma client generation...`, colors.yellow);

                    // Clear Prisma client cache on retry
                    try {
                        const prismaClientPath = join(this.serverPath, 'node_modules', '.prisma');
                        if (existsSync(prismaClientPath)) {
                            log('Clearing Prisma client cache...', colors.yellow);
                            execSync(`rmdir /s /q "${prismaClientPath}"`, { stdio: 'pipe' });
                        }
                    } catch (clearError) {
                        // Ignore clear errors
                    }

                    // Wait a bit before retry
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }

                execSync('npx prisma generate', { stdio: 'inherit' });
                log('✓ Prisma client generated successfully', colors.green);
                return;

            } catch (error) {
                if (attempts === maxAttempts) {
                    log('Failed to generate Prisma client after multiple attempts', colors.red);
                    log('This is often caused by:', colors.yellow);
                    console.log('  • Antivirus software blocking file operations');
                    console.log('  • Windows file permissions');
                    console.log('  • Running processes locking files');
                    console.log();

                    const retry = await question('Try alternative solutions? (y/N): ');
                    if (retry.toLowerCase() === 'y') {
                        return await this.alternativePrismaSetup();
                    }
                    throw new Error('Failed to generate Prisma client');
                } else {
                    log(`Attempt ${attempts} failed, retrying...`, colors.yellow);
                }
            }
        }
    }

    async alternativePrismaSetup() {
        log('Trying alternative Prisma setup methods...', colors.blue);

        try {
            // Method 1: Clear everything and reinstall
            log('Method 1: Complete cleanup and reinstall...', colors.yellow);

            const confirmCleanup = await question('This will remove node_modules and package-lock.json. Continue? (y/N): ');
            if (confirmCleanup.toLowerCase() === 'y') {
                try {
                    if (existsSync('node_modules')) {
                        log('Removing node_modules...', colors.yellow);
                        execSync('rmdir /s /q node_modules', { stdio: 'pipe' });
                    }
                    if (existsSync('package-lock.json')) {
                        execSync('del package-lock.json', { stdio: 'pipe' });
                    }

                    log('Reinstalling dependencies...', colors.yellow);
                    execSync('npm install', { stdio: 'inherit' });

                    log('Generating Prisma client with admin privileges...', colors.yellow);
                    execSync('npx prisma generate', { stdio: 'inherit' });

                    log('✓ Prisma client generated successfully with cleanup method', colors.green);
                    return;

                } catch (cleanupError) {
                    log('Cleanup method failed', colors.red);
                }
            }

            // Method 2: Manual installation
            log('Method 2: Manual Prisma installation...', colors.yellow);
            try {
                execSync('npm uninstall @prisma/client prisma', { stdio: 'pipe' });
                execSync('npm install @prisma/client prisma@latest', { stdio: 'inherit' });
                execSync('npx prisma generate', { stdio: 'inherit' });

                log('✓ Prisma client generated successfully with manual installation', colors.green);
                return;

            } catch (manualError) {
                log('Manual installation failed', colors.red);
            }

            throw new Error('All alternative methods failed');

        } catch (error) {
            log('Alternative setup failed. Please try:', colors.red);
            console.log('  1. Run Command Prompt as Administrator');
            console.log('  2. Temporarily disable antivirus');
            console.log('  3. Close all VS Code/editor windows');
            console.log('  4. Run: npm run prisma:generate');
            throw error;
        }
    }

    async testConnection() {
        log('Step 5: Testing database connection...', colors.blue);
        try {
            execSync('npx prisma db pull --schema=./prisma/schema.prisma', { stdio: 'pipe' });
            log('✓ Database connection successful', colors.green);
        } catch (error) {
            log('⚠ Could not connect to database. Please verify your DATABASE_URL', colors.red);
            const proceed = await question('Continue anyway? (y/N): ');
            if (proceed.toLowerCase() !== 'y') {
                throw new Error('Database connection failed');
            }
        }
        console.log();
    }

    async applyMigrations() {
        log('Step 6: Applying database migrations...', colors.blue);
        try {
            execSync('npx prisma migrate deploy', { stdio: 'inherit' });
            log('✓ Migrations applied successfully', colors.green);
        } catch (error) {
            log('Migration failed. Attempting database reset...', colors.yellow);
            const reset = await question('This will recreate your database schema. Continue? (y/N): ');

            if (reset.toLowerCase() === 'y') {
                try {
                    execSync('npx prisma migrate reset --force', { stdio: 'inherit' });
                    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
                    log('✓ Database reset and migrated successfully', colors.green);
                } catch (resetError) {
                    throw new Error('Failed to reset and migrate database');
                }
            } else {
                throw new Error('Migration cancelled by user');
            }
        }
        console.log();
    }

    async seedDatabase() {
        log('Step 7: Database seeding...', colors.blue);
        const seed = await question('Do you want to seed the database with sample data? (y/N): ');

        if (seed.toLowerCase() === 'y') {
            try {
                execSync('node seed.js', { stdio: 'inherit' });
                log('✓ Database seeded successfully', colors.green);
            } catch (error) {
                log('⚠ Database seeding failed or was skipped', colors.yellow);
            }
        } else {
            log('Database seeding skipped', colors.yellow);
        }
        console.log();
    }

    async verifySetup() {
        log('Step 8: Verifying setup...', colors.blue);
        try {
            execSync('npx prisma db pull --print', { stdio: 'pipe' });
            log('✓ Database schema verified successfully', colors.green);
        } catch (error) {
            log('⚠ Could not verify database schema', colors.yellow);
        }
        console.log();
    }

    printSuccessMessage() {
        process.chdir(__dirname);

        log('========================================', colors.green);
        log('Neon Database Setup Complete!', colors.green);
        log('========================================', colors.green);
        console.log();

        log('Your database is ready at:', colors.cyan);
        log(NEON_CONFIG.consoleUrl, colors.blue);
        console.log();

        log('Next steps:', colors.yellow);
        console.log('1. Your server can now connect to Neon database');
        console.log('2. Update your production environment variables');
        console.log('3. Deploy your application');
        console.log();

        log('Setup completed successfully!', colors.green);
    }
}

// Run the setup
const setup = new NeonDatabaseSetup();
setup.run().catch((error) => {
    console.error('Setup failed:', error.message);
    process.exit(1);
});