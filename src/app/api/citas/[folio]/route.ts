// app/api/citas/[folio]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { folio: string } }
): Promise<NextResponse> {
  try {
    const folio = params.folio;

    const [rows]: any = await db.query('SELECT * FROM tbCitas WHERE strFolio = ?', [folio]);

    if (rows.length === 0) {
      return new NextResponse('Cita no encontrada', { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('Error al obtener cita por folio:', error);
    return new NextResponse('Error en el servidor', { status: 500 });
  }
}
