import mysql, { Pool, PoolConnection } from 'mysql2/promise';

export const dbSettings = {
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_DATABASE || 'dbMedical',
  port: parseInt(process.env.DB_PORT || '3306'),
};

let db: Pool;

export async function initDB(): Promise<void> {
  if (!db) {
    db = mysql.createPool(dbSettings);
  }
}

export async function getConnection(): Promise<PoolConnection> {
  if (!db) {
    await initDB();
  }
  return db.getConnection();
}

export async function testConnection(): Promise<void> {
  try {
    if (!db) {
      await initDB();
    }
    const [rows] = await db.query('SELECT 1');
    console.log('Database connection test successful:', rows);
  } catch (err) {
    console.error('Error testing the database connection:', err);
  }
}

export { mysql, db };


