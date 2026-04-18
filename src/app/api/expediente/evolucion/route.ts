import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Obtener evolución (signos vitales en el tiempo) de un paciente
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
        c.datFechaConsulta AS fecha,
        csv.dblPeso AS peso,
        csv.strPresionArterial AS presion,
        csv.dblGlucosa AS glucosa,
        csv.dblTemperatura AS temperatura,
        csv.dblIMC AS imc
      FROM tbConsultas c
      LEFT JOIN tbConsultaSignosVitales csv ON c.intConsulta = csv.intConsulta
      WHERE c.intPaciente = ? AND c.isEliminado = 0
      ORDER BY c.datFechaConsulta DESC
      LIMIT 20
    `;

    const [evolucion]: any = await db.query(query, [parseInt(intPaciente)]);

    return NextResponse.json({
      success: true,
      evolucion,
    });
  } catch (error: any) {
    console.error("Error al obtener evolución:", error);
    return NextResponse.json(
      { error: "Error al obtener evolución" },
      { status: 500 }
    );
  }
}
