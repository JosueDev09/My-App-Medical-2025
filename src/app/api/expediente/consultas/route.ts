import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Obtener consultas de un paciente
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
        c.intConsulta,
        c.datFechaConsulta,
        c.strMotivoConsulta,
        c.strDiagnostico,
        c.strTratamiento,
        c.strEstatusConsulta,
        CONCAT(d.strNombre, ' ', d.strApellidos) AS strNombreDoctor,
        e.strNombreEspecialidad
      FROM tbConsultas c
      INNER JOIN tbDoctores d ON c.intDoctor = d.intDoctor
      LEFT JOIN tbEspecialidades e ON d.intEspecialidad = e.intEspecialidad
      WHERE c.intPaciente = ? AND c.isEliminado = 0
      ORDER BY c.datFechaConsulta DESC
    `;

    const [consultas]: any = await db.query(query, [parseInt(intPaciente)]);

    return NextResponse.json({
      success: true,
      consultas,
    });
  } catch (error: any) {
    console.error("Error al obtener consultas:", error);
    return NextResponse.json(
      { error: "Error al obtener consultas" },
      { status: 500 }
    );
  }
}
