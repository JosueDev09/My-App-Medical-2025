import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
    try {
        // Obtener parámetros de búsqueda opcionales
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const especialidad = searchParams.get('especialidad');
        const estatus = searchParams.get('estatus');

        let query = `
       SELECT D.*, E.strNombreEspecialidad
       FROM tbdoctores d
       INNER JOIN tbespecialidades e ON d.intEspecialidad = e.intEspecialidad
      `;
        const conditions: string[] = [];
        const params: any[] = [];

        // Filtrar por ID
        if (id) {
            conditions.push('d.intDoctor = ?');
            params.push(id);
        }

        // Filtrar por especialidad
        if (especialidad) {
            conditions.push('d.intEspecialidad = ?');
            params.push(especialidad);
        }

        // Filtrar por estatus
        if (estatus) {
            conditions.push('d.strEstatus = ?');
            params.push(estatus);
        }

        // Agregar condiciones WHERE si existen
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY d.strNombre ASC';
       
        const [rows] = await db.execute(query, params);

        return NextResponse.json({
            success: true,
            data: rows,
            message: 'Doctores obtenidos exitosamente'
        }, { status: 200 });

    } catch (error: any) {
        console.error('Error al obtener doctores:', error);
        return NextResponse.json({
            success: false,
            message: 'Error al obtener doctores',
            error: error.message
        }, { status: 500 });
    }
}