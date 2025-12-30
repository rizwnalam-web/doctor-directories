import pkg from 'pg';
import dotenv from 'dotenv';
import crypto from 'crypto';

const { Pool } = pkg;

// Load environment variables
dotenv.config();

class Database {
    constructor() {
        if (!process.env.DATABASE_URL) {
            console.error('❌ DATABASE_URL environment variable is required');
            console.log('Please set DATABASE_URL in your .env file:');
            console.log('DATABASE_URL="postgresql://username:password@host/database?sslmode=require"');
            process.exit(1);
        }

        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        });
    }

    async query(text, params) {
        try {
            const result = await this.pool.query(text, params);
            return result;
        } catch (error) {
            console.error('Database query error:', error);
            throw error;
        }
    }

    async getClient() {
        return await this.pool.connect();
    }

    async close() {
        await this.pool.end();
    }

    // Helper methods for common operations
    async findById(table, id) {
        const result = await this.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
        return result.rows[0];
    }

    async findByEmail(email) {
        const result = await this.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    }

    async create(table, data) {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');
        const columns = keys.join(', ');

        const result = await this.query(
            `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`,
            values
        );
        return result.rows[0];
    }

    async update(table, id, data) {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');

        const result = await this.query(
            `UPDATE ${table} SET ${setClause}, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $${keys.length + 1} RETURNING *`,
            [...values, id]
        );
        return result.rows[0];
    }

    async delete(table, id) {
        const result = await this.query(`DELETE FROM ${table} WHERE id = $1 RETURNING *`, [id]);
        return result.rows[0];
    }

    // Generate UUID (alternative to Prisma's uuid())
    generateId() {
        return crypto.randomUUID();
    }
}

// Create singleton instance
const db = new Database();

// Handle graceful shutdown
process.on('beforeExit', async () => {
    await db.close();
});

process.on('SIGINT', async () => {
    await db.close();
    process.exit();
});

process.on('SIGTERM', async () => {
    await db.close();
    process.exit();
});

export default db;