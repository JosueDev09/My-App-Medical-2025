import 'dotenv/config';
import { db } from '@/lib/db'; // Asegúrate de que la ruta sea correcta

async function testConnection() {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS resultado');
    console.log('✅ Conexión exitosa:', rows);
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
  }
}

testConnection();