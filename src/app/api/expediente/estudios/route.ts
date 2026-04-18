import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Obtener estudios de un paciente
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const intPaciente = searchParams.get("intPaciente");

    if (!intPaciente) {
      return NextResponse.json(
        { error: "ID de paciente requerido" },
        { status: 400 }
      );
    }

    const query = `
      SELECT 
        e.intEstudio,
        e.strTipoEstudio,
        e.strNombreEstudio,
        e.datFechaSolicitud,
        e.datFechaResultado,
        e.strEstatus,
        e.strRutaArchivo,
        e.txtResultados,
        e.txtInterpretacion,
        CONCAT(d.strNombre, ' ', d.strApellidos) AS strNombreDoctor
      FROM tbEstudios e
      INNER JOIN tbDoctores d ON e.intDoctor = d.intDoctor
      WHERE e.intPaciente = ? AND e.isEliminado = 0
      ORDER BY e.datFechaSolicitud DESC
    `;

    const [estudios]: any = await db.query(query, [parseInt(intPaciente)]);

    return NextResponse.json({
      success: true,
      estudios,
    });
  } catch (error: any) {
    console.error("Error al obtener estudios:", error);
    return NextResponse.json(
      { error: "Error al obtener estudios" },
      { status: 500 }
    );
  }
}
