import { db } from '@/lib/db.js';
import { NextRequest, NextResponse } from 'next/server';
// Ajusta esta ruta según tu proyecto

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const [rows]: any = await db.query('CALL tbCitas_List()'); // Puedes tipar `rows` mejor si conoces su estructura
    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error("Error al obtener las citas:", error);
    return new NextResponse('Error al obtener las citas', { status: 500 });
  }
}
