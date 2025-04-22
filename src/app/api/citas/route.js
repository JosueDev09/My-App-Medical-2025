import { db } from '@/lib/db.js';

export async function GET(req) {
  try {
    const [rows] = await db.query('CALL tbCitas_List()'); // Llama al procedimiento almacenado
    return new Response(JSON.stringify(rows[0]), { status: 200 }); // Devuelve los datos como JSON
  } catch (error) {
    console.error("Error al obtener las citas:", error);
    return new Response('Error al obtener las citas', { status: 500 });
  }
}