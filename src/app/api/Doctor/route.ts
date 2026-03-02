import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
    try {
        // Obtener parámetros de búsqueda opcionales
        const { searchParams } = new URL(req.url);
        const tipo = searchParams.get('tipo');
        const id = searchParams.get('id');
        const especialidad = searchParams.get('especialidad');
        const estatus = searchParams.get('estatus');

    if (tipo === 'todos' || !tipo) {
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
    }
     if (tipo === 'detalle') {
      const idMedico = searchParams.get('id');
      
      if (!idMedico) {
        return NextResponse.json(
          { success: false, error: 'ID de medico requerido' },
          { status: 400 }
        );
      }

      const query = `
        SELECT 
          m.*,
          h.diasDisponibles,
          h.horarioInicio,
          h.horarioFin,
        e.strNombreEspecialidad,
          COUNT(c.intCita) as totalCitas,
          MAX(c.datFecha) as ultimaCita
        FROM tbdoctores m
        INNER JOIN tbdoctores_horarios h ON m.intDoctor = h.intDoctor
        INNER JOIN tbespecialidades e ON m.intEspecialidad = e.intEspecialidad
        LEFT JOIN tbcitas c ON m.intDoctor = c.intDoctor
        WHERE m.intDoctor = ?
        GROUP BY m.intDoctor,h.diasDisponibles, h.horarioInicio, h.horarioFin, e.strNombreEspecialidad
      `;

      const [medico]: any = await db.query(query, [idMedico]);

      if (!medico || medico.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Medico no encontrado' },
          { status: 404 }
        );
      }

      // Obtener historial de citas del medico  
      const citasQuery = `
        SELECT 
          c.intCita,
          c.datFecha,
          c.intHora,
          c.strMotivo,
          d.strNombre,
          e.strNombreEspecialidad
        FROM tbcitas c
        LEFT JOIN tbdoctores d ON c.intDoctor = d.intDoctor
        LEFT JOIN tbespecialidades e ON d.intEspecialidad = e.intEspecialidad
        WHERE c.intDoctor = ?
        ORDER BY c.datFecha DESC, c.intHora DESC
        LIMIT 10
      `;

      const [citas] = await db.query(citasQuery, [idMedico]);

      return NextResponse.json({
        success: true,
        data: {
          ...medico[0],
          historialCitas: citas,
        },
      });
    }

    } catch (error: any) {
        console.error('Error al obtener doctores:', error);
        return NextResponse.json({
            success: false,
            message: 'Error al obtener doctores',
            error: error.message
        }, { status: 500 });
    }
}