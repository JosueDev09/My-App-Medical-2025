import { NextRequest, NextResponse } from "next/server";
import { db } from '@/lib/db';
import { getAuthenticatedUser, hasRole } from '@/lib/auth-helper';

// GET - Obtener citas para la agenda
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fecha = searchParams.get("fecha");
    const idDoctor = searchParams.get("idDoctor");
    const estado = searchParams.get("estado");

    //console.log("Parámetros recibidos - fecha:", fecha, "idDoctor:", idDoctor, "estado:", estado);
    // Obtener usuario autenticado
    let user;
    try {
      user = await getAuthenticatedUser();
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

   // console.log("Usuario autenticado:", user.email, "Rol:", user.rol);

    let query = `
      SELECT 
        c.intCita,
        c.intPaciente,
        c.intDoctor,
        c.datFecha,
        c.intHora,
        c.strMotivo,
        c.strEstatuscita,
        p.strNombre as strNombrePaciente,
        p.strTelefono as strTelefonoPaciente,
        p.strEmail as strCorreoPaciente,
        p.strGenero,
        TIMESTAMPDIFF(YEAR, p.datFechaNacimiento, CURDATE()) as intEdad,
        CONCAT(d.strNombre, ' ', d.strApellidos) as strNombreDoctor,
        e.strNombreEspecialidad
      FROM tbcitas c
      INNER JOIN tbpacientes p ON c.intPaciente = p.intPaciente
      INNER JOIN tbdoctores d ON c.intDoctor = d.intDoctor
      INNER JOIN tbespecialidades e ON d.intEspecialidad = e.intEspecialidad
      WHERE 1=1
    `;

    const params: any[] = [];
    
    // Si es doctor, solo puede ver sus propias citas
   
    if (user.rol === 'doctor') {
       
      if (!user.intDoctor) {
        return NextResponse.json(
          { error: "Doctor no asociado al usuario" },
          { status: 400 }
        );
      }

      query += ` AND c.intDoctor = ?`;
      params.push(user.intDoctor);
    } 
    // Si es admin o recepción, puede filtrar por doctor
    else if (hasRole(user, ['superadmin', 'recepcion'])) {
        
      if (idDoctor) {
        query += ` AND c.intDoctor = ?`;
        params.push(parseInt(idDoctor));
      }
    } 
    // Rol no autorizado
    else {
      return NextResponse.json(
        { error: "Rol no autorizado" },
        { status: 403 }
      );
    }

    // Filtrar por fecha si se proporciona
    // if (fecha) {
    //   query += ` AND DATE(c.datFecha) = ?`;
    //   params.push(fecha);
    // }

    // Filtrar por estado si se proporciona
    if (estado && estado !== "todos") {
      query += ` AND c.strEstatuscita = ?`;
      params.push(estado);
    }

    query += ` ORDER BY c.datFecha DESC, c.intHora`;

    const [rows] = await db.query(query, params);

    //console.log("Citas obtenidas:", rows);

    //console.log("Citas obtenidas:", [rows]);

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
      SET strEstatuscita = ?
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
