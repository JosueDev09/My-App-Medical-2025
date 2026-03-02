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
        strDescripcion as descripcion
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

export async function POST(req: NextRequest) {
  try {
    const { nombre, descripcion } = await req.json();

    if (!nombre || nombre.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'El nombre de la especialidad es requerido' },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO tbespecialidades (strNombreEspecialidad, strDescripcion)
      VALUES (?, ?)
    `;

    const [result]: any = await db.query(query, [nombre.trim(), descripcion || null]);

    return NextResponse.json({
      success: true,
      message: 'Especialidad creada exitosamente',
      data: { id: result.insertId }
    });

  } catch (error: any) {
    console.error('Error al crear especialidad:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear especialidad', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, nombre, descripcion } = await req.json();

    if (!id || !nombre || nombre.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'ID y nombre son requeridos' },
        { status: 400 }
      );
    }

    const query = `
      UPDATE tbespecialidades 
      SET strNombreEspecialidad = ?, strDescripcion = ?
      WHERE intEspecialidad = ?
    `;

    await db.query(query, [nombre.trim(), descripcion || null, id]);

    return NextResponse.json({
      success: true,
      message: 'Especialidad actualizada exitosamente'
    });

  } catch (error: any) {
    console.error('Error al actualizar especialidad:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar especialidad', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID es requerido' },
        { status: 400 }
      );
    }

    const query = `DELETE FROM tbespecialidades WHERE intEspecialidad = ?`;
    await db.query(query, [id]);

    return NextResponse.json({
      success: true,
      message: 'Especialidad eliminada exitosamente'
    });

  } catch (error: any) {
    console.error('Error al eliminar especialidad:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar especialidad', details: error.message },
      { status: 500 }
    );
  }
}