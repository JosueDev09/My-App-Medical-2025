import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const busqueda = searchParams.get('busqueda');

    // Consultar estados desde la base de datos
    let query = `
      SELECT intEstado as id, strNombre as nombre
      FROM tbestados
    `;

    const params: any[] = [];

    // Si hay búsqueda, agregar filtro
    if (busqueda && busqueda.trim().length >= 2) {
      query += ` WHERE strNombre LIKE ?`;
      params.push(`%${busqueda}%`);
    }

    query += ` ORDER BY strNombre ASC`;

    const [estados]: any = await db.query(query, params);

    return NextResponse.json({
      success: true,
      data: estados,
    });

  } catch (error: any) {
    console.error('Error al buscar estados:', error);
    return NextResponse.json(
      { success: false, error: 'Error al buscar estados', details: error.message },
      { status: 500 }
    );
  }
}
