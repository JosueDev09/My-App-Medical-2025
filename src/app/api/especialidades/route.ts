/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const busqueda = searchParams.get('busqueda');

    // Consultar especialidades desde la base de datos
    let query = `
      SELECT 
        intEspecialidad as id, 
        strNombreEspecialidad as nombre,
        strDescripcion
      FROM tbespecialidades
      WHERE 1=1
    `;

    const params: any[] = [];

    // Si hay búsqueda, agregar filtro
    if (busqueda && busqueda.trim().length >= 2) {
      query += ` AND strNombreEspecialidad LIKE ?`;
      params.push(`%${busqueda}%`);
    }

    query += ` ORDER BY strNombreEspecialidad ASC`;

    const [especialidades]: any = await db.query(query, params);

    return NextResponse.json({
      success: true,
      data: especialidades,
    });

  } catch (error: any) {
    console.error('Error al obtener especialidades:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener especialidades', details: error.message },
      { status: 500 }
    );
  }
}