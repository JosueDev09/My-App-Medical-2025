import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Obtener un paciente específico por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { intPaciente: string } }
) {
  try {
   //const intPaciente = await parseInt(params.intPaciente);
    const { intPaciente } = await params; // ✅ aquí está la clave
    const intPacienteId = parseInt(intPaciente);  

    if (isNaN(intPacienteId)) {
      return NextResponse.json(
        { error: "ID de paciente inválido" },
        { status: 400 }
      );
    }

    const query = `
      SELECT 
        intPaciente,
        strNombre,
        strGenero,
        datFechaNacimiento,
        intEdad,
        strCurp,
        strTelefono,
        strTelefonoEmergencia,
        strEmail,
        strDireccion,
        strCiudad,
        strEstado,
        strCodigoPostal,
        strTipoSangre,
        strAlergias,
        strEnfermedadesCronicas,
        strMedicamentosActuales,
        strEstatus,
        datFechaRegistro
      FROM tbPacientes
      WHERE intPaciente = ? AND isEliminado = 0
    `;

    const [rows]: any = await db.query(query, [intPacienteId]);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Paciente no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      paciente: rows[0],
    });
  } catch (error: any) {
    console.error("Error al obtener paciente:", error);
    return NextResponse.json(
      { error: "Error al obtener información del paciente" },
      { status: 500 }
    );
  }
}
