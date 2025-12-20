import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // automatically reads .env

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : undefined,
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL');
});
