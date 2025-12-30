#!/usr/bin/env node

/**
 * Test Database Connection and Environment Setup
 */

import { Client } from 'pg';
import dotenv from 'dotenv';
import { existsSync } from 'fs';

// Load environment variables
dotenv.config();

console.log('🔍 Testing Database Setup...');
console.log('===============================');

// Check if .env file exists
if (!existsSync('.env')) {
    console.log('❌ No .env file found');
    console.log('Please create a .env file with your DATABASE_URL');
    process.exit(1);
}

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
    console.log('❌ DATABASE_URL not found in environment');
    console.log('');
    console.log('Please add this to your .env file:');
    console.log('DATABASE_URL="postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"');
    console.log('');
    console.log('Get your connection string from:');
    console.log('https://console.neon.tech/app/projects/restless-sound-17286421/branches/br-restless-smoke-ah1mx7fi/tables');
    process.exit(1);
}

console.log('✅ .env file found');
console.log('✅ DATABASE_URL is set');

// Test database connection
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function testConnection() {
    try {
        console.log('🔌 Connecting to database...');
        await client.connect();
        console.log('✅ Connected successfully!');
        
        // Test query
        const result = await client.query('SELECT NOW() as current_time');
        console.log('✅ Database query successful');
        console.log(`⏰ Database time: ${result.rows[0].current_time}`);
        
        // Check if tables exist
        const tablesResult = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
        `);
        
        if (tablesResult.rows.length === 0) {
            console.log('📋 No tables found - ready for migration');
        } else {
            console.log(`📋 Found ${tablesResult.rows.length} existing tables:`);
            tablesResult.rows.forEach(row => {
                console.log(`   • ${row.table_name}`);
            });
        }
        
        console.log('');
        console.log('🎉 Database setup is ready!');
        console.log('You can now run: node migrate-neon.js');
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.log('');
        console.log('Common issues:');
        console.log('• Check your DATABASE_URL format');
        console.log('• Verify your Neon database is active');
        console.log('• Check network connectivity');
        process.exit(1);
    } finally {
        await client.end();
    }
}

testConnection();