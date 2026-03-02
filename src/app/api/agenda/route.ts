import { NextRequest, NextResponse } from "next/server";
import { db } from '@/lib/db';

// GET - Obtener citas para la agenda
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fecha = searchParams.get("fecha");
    const idDoctor = searchParams.get("idDoctor");
    const estado = searchParams.get("estado");

    let query = `
      SELECT 
        c.intCita,
        c.datFecha,
        c.intHora,
        c.strMotivo,
        c.strEstado,
        p.strNombre as strNombrePaciente,
        p.strTelefono as strTelefonoPaciente,
        p.strCorreo as strCorreoPaciente,
        p.intEdad,
        p.strGenero,
        CONCAT(d.strNombre, ' ', d.strApellidoPaterno, ' ', d.strApellidoMaterno) as strNombreDoctor,
        e.strNombreEspecialidad as strNombreEspecialidad
      FROM tbcitas c
      INNER JOIN tbpacientes p ON c.intIdPaciente = p.intIdPaciente
      INNER JOIN tbdoctores d ON c.intIdDoctor = d.intDoctor
      INNER JOIN tbespecialidades e ON d.intEspecialidad = e.intEspecialidad
      WHERE 1=1
    `;

    const params: any[] = [];

    // Filtrar por fecha si se proporciona
    if (fecha) {
      query += ` AND DATE(c.datFecha) = ?`;
      params.push(fecha);
    }

    // Filtrar por doctor si se proporciona
    if (idDoctor) {
      query += ` AND c.intIdDoctor = ?`;
      params.push(idDoctor);
    }

    // Filtrar por estado si se proporciona
    if (estado && estado !== "todos") {
      query += ` AND c.strEstado = ?`;
      params.push(estado);
    }

    query += ` ORDER BY c.datFecha, c.intHora`;

    const [rows] = await db.query(query, params);

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error al obtener agenda:", error);
    return NextResponse.json(
      { error: "Error al obtener la agenda" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar estado de una cita
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { intCita, strEstado } = body;

    if (!intCita || !strEstado) {
      return NextResponse.json(
        { error: "Se requiere intCita y strEstado" },
        { status: 400 }
      );
    }

    const query = `
      UPDATE tbcitas 
      SET strEstado = ?
      WHERE intCita = ?
    `;

    await db.query(query, [strEstado, intCita]);

    return NextResponse.json(
      { success: true, message: "Estado actualizado exitosamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    return NextResponse.json(
      { error: "Error al actualizar el estado de la cita" },
      { status: 500 }
    );
  }
}

// POST - Guardar información de consulta médica
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      intCita,
      strNotasConsulta,
      strDiagnostico,
      strReceta,
      strSignosVitales,
    } = body;

    if (!intCita) {
      return NextResponse.json(
        { error: "Se requiere el ID de la cita" },
        { status: 400 }
      );
    }

    // Actualizar la cita con los datos de la consulta
    const query = `
      UPDATE tbcitas 
      SET 
        strNotasConsulta = ?,
        strDiagnostico = ?,
        strReceta = ?,
        strSignosVitales = ?,
        strEstado = 'FINALIZADA',
        datFechaActualizacion = NOW()
      WHERE intCita = ?
    `;

    await db.query(query, [
      strNotasConsulta || null,
      strDiagnostico || null,
      strReceta || null,
      strSignosVitales || null,
      intCita,
    ]);

    return NextResponse.json(
      { success: true, message: "Consulta guardada exitosamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al guardar consulta:", error);
    return NextResponse.json(
      { error: "Error al guardar la consulta" },
      { status: 500 }
    );
  }
}
