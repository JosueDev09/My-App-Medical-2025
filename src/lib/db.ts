import mysql, { Pool, PoolConnection } from 'mysql2/promise';

 const pool = mysql.createPool({ 
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_DATABASE || 'dbMedical',
  port: parseInt(process.env.DB_PORT || '3306'),
 });  

 export const db = pool;

