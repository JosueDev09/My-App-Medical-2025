/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const busqueda = searchParams.get('busqueda');

    // Consultar roles desde la base de datos
    let query = `
      SELECT 
            intRol as id, 
            strRol as nombre
      FROM tbroles
      WHERE intEstatus=1
    `;

    const params: any[] = [];

    // Si hay búsqueda, agregar filtro
    if (busqueda && busqueda.trim().length >= 2) {
      query += ` AND strRol LIKE ?`;
      params.push(`%${busqueda}%`);
    }

    query += ` ORDER BY strRol ASC`;
    const [roles]: any = await db.query(query, params);

    return NextResponse.json({
      success: true,
      data: roles,
    });

  } catch (error: any) {
    console.error('Error al obtener roles:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener roles', details: error.message },
      { status: 500 }
    );
  }
}