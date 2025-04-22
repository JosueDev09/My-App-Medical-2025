// src/lib/db.js
import mysql from 'mysql2/promise';

export const dbSettings = {
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "admin",
  database: process.env.DB_DATABASE || "dbMedical",
  port: process.env.DB_PORT || 3306
};

// pool reutilizable
export const db = await mysql.createPool(dbSettings);

export async function getConnection() {
  return db.getConnection();      // ya usa el pool
}

export async function testConnection() {
  try {
    const [rows] = await db.query('SELECT 1');
    console.log("Database connection test successful:", rows);
  } catch (err) {
    console.error("Error testing the database connection:", err);
  }
}

export { mysql };

