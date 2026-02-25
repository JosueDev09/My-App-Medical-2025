/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tipo = searchParams.get('tipo');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    // Si se solicita obtener todos los pacientes
    if (tipo === 'todos' || !tipo) {
      let query = `
        SELECT 
          p.intPaciente,
          p.strNombre,
          p.strEmail,
          p.strTelefono,
          p.strGenero,
          p.datFechaRegistro,
          COUNT(c.intCita) as totalCitas
        FROM tbpacientes p
        LEFT JOIN tbcitas c ON p.intPaciente = c.intPaciente
      `;

      const params: any[] = [];

      // Si hay búsqueda, agregar filtro
      if (search) {
        query += ` WHERE 
          p.strNombre LIKE ? OR 
          p.strCorreo LIKE ? OR 
          p.strTelefono LIKE ?
        `;
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      query += ` GROUP BY p.intPaciente ORDER BY p.datFechaRegistro DESC`;

      // Agregar paginación si se especifica
      if (limit) {
        query += ` LIMIT ?`;
        params.push(parseInt(limit));
        
        if (offset) {
          query += ` OFFSET ?`;
          params.push(parseInt(offset));
        }
      }

      const [pacientes] = await db.query(query, params);

      // Obtener total de pacientes para paginación
      let countQuery = `SELECT COUNT(*) as total FROM tbpacientes p`;
      const countParams: any[] = [];

      if (search) {
        countQuery += ` WHERE 
          p.strNombre LIKE ? OR 
          p.strCorreo LIKE ? OR 
          p.strTelefono LIKE ?
        `;
        const searchTerm = `%${search}%`;
        countParams.push(searchTerm, searchTerm, searchTerm);
      }

      const [countResult]: any = await db.query(countQuery, countParams);
      const total = countResult[0]?.total || 0;

      return NextResponse.json({
        success: true,
        data: pacientes,
        total,
        limit: limit ? parseInt(limit) : null,
        offset: offset ? parseInt(offset) : null,
      });
    }

    // Si se solicita un paciente específico por ID
    if (tipo === 'detalle') {
      const idPaciente = searchParams.get('id');
      
      if (!idPaciente) {
        return NextResponse.json(
          { success: false, error: 'ID de paciente requerido' },
          { status: 400 }
        );
      }

      const query = `
        SELECT 
          p.*,
          COUNT(c.intCita) as totalCitas,
          MAX(c.datFecha) as ultimaCita
        FROM tbpacientes p
        LEFT JOIN tbcitas c ON p.intPaciente = c.intPaciente
        WHERE p.intPaciente = ?
        GROUP BY p.intPaciente
      `;

      const [paciente]: any = await db.query(query, [idPaciente]);

      if (!paciente || paciente.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Paciente no encontrado' },
          { status: 404 }
        );
      }

      // Obtener historial de citas del paciente
      const citasQuery = `
        SELECT 
          c.intCita,
          c.datFecha,
          c.intHora,
          c.strMotivo,
          c.strEstado,
          d.strNombreDoctor,
          e.strNombreEspecialidad
        FROM tbcitas c
        INNER JOIN tbdoctores d ON c.intDoctor = d.intDoctor
        INNER JOIN tbespecialidades e ON d.idEspecialidad = e.intEspecialidad
        WHERE c.intPaciente = ?
        ORDER BY c.datFecha DESC, c.intHora DESC
        LIMIT 10
      `;

      const [citas] = await db.query(citasQuery, [idPaciente]);

      return NextResponse.json({
        success: true,
        data: {
          ...paciente[0],
          historialCitas: citas,
        },
      });
    }

    // Estadísticas de pacientes
    if (tipo === 'estadisticas') {
      const statsQuery = `
        SELECT 
          COUNT(DISTINCT p.intPaciente) as totalPacientes,
          COUNT(DISTINCT CASE WHEN DATE(p.datFechaRegistro) = CURDATE() THEN p.intPaciente END) as nuevosHoy,
          COUNT(DISTINCT CASE WHEN MONTH(p.datFechaRegistro) = MONTH(CURDATE()) 
            AND YEAR(p.datFechaRegistro) = YEAR(CURDATE()) THEN p.intPaciente END) as nuevosMes,
          AVG(p.intEdad) as edadPromedio
        FROM tbpacientes p
      `;

      const [stats]: any = await db.query(statsQuery);

      return NextResponse.json({
        success: true,
        data: stats[0],
      });
    }

    return NextResponse.json(
      { success: false, error: 'Tipo de consulta no válido' },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('Error al obtener pacientes:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener pacientes', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      strNombrePaciente,
      strCorreoPaciente,
      strTelefonoPaciente,
      intEdad,
      strGenero,
    } = body;

    // Validaciones
    if (!strNombrePaciente || !strCorreoPaciente || !strTelefonoPaciente) {
      return NextResponse.json(
        { success: false, error: 'Campos obligatorios faltantes' },
        { status: 400 }
      );
    }

    // Verificar si el correo ya existe
    const [existente]: any = await db.query(
      'SELECT intPaciente FROM tbpacientes WHERE strCorreoPaciente = ?',
      [strCorreoPaciente]
    );

    if (existente && existente.length > 0) {
      return NextResponse.json(
        { success: false, error: 'El correo ya está registrado' },
        { status: 409 }
      );
    }

    const query = `
      INSERT INTO tbpacientes 
      (strNombre, strCorreo, strTelefono, intEdad, strGenero, datFechaRegistro) 
      VALUES (?, ?, ?, ?, ?, NOW())
    `;

    const [result]: any = await db.query(query, [
      strNombrePaciente,
      strCorreoPaciente,
      strTelefonoPaciente,
      intEdad || null,
      strGenero || null,
    ]);

    return NextResponse.json({
      success: true,
      message: 'Paciente registrado exitosamente',
      data: {
        intPaciente: result.insertId,
      },
    });

  } catch (error: any) {
    console.error('Error al registrar paciente:', error);
    return NextResponse.json(
      { success: false, error: 'Error al registrar paciente', details: error.message },
      { status: 500 }
    );
  }
}
