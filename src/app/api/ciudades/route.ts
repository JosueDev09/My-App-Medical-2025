import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const busqueda = searchParams.get('busqueda');
    const estadoNombre = searchParams.get('estado');

    // Si no hay estado seleccionado, retornar array vacío o mensaje
    if (!estadoNombre) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'Selecciona un estado primero',
      });
    }

    // Primero, obtener el ID del estado por su nombre
    const queryEstado = `
      SELECT intEstado, strNombre 
      FROM tbestados 
      WHERE strNombre = ?
      LIMIT 1
    `;

    const [estadoResult]: any = await db.query(queryEstado, [estadoNombre]);

    if (!estadoResult || estadoResult.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'Estado no encontrado',
      });
    }

    const intEstado = estadoResult[0].intEstado;

    // Ahora obtener las ciudades de ese estado
    let query = `
      SELECT intCiudad as id, strNombre as nombre
      FROM tbciudades
      WHERE intEstado = ?
    `;

    const params: any[] = [intEstado];

    // Si hay búsqueda, agregar filtro
    if (busqueda && busqueda.trim().length >= 2) {
      query += ` AND strNombre LIKE ?`;
      params.push(`%${busqueda}%`);
    }

    query += ` ORDER BY strNombre ASC LIMIT 50`;

    const [ciudades]: any = await db.query(query, params);

    return NextResponse.json({
      success: true,
      data: ciudades,
    });

  } catch (error: any) {
    console.error('Error al buscar ciudades:', error);
    return NextResponse.json(
      { success: false, error: 'Error al buscar ciudades', details: error.message },
      { status: 500 }
    );
  }
}
