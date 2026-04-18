import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Obtener archivos de un paciente
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
        a.intArchivo,
        a.strNombreArchivo,
        a.strRutaArchivo,
        a.strTipoArchivo,
        a.dblTamanoArchivo,
        a.strCategoria,
        a.txtDescripcion,
        a.datFechaSubida,
        CONCAT(d.strNombre, ' ', d.strApellidos) AS strNombreDoctor
      FROM tbArchivosAdjuntos a
      LEFT JOIN tbDoctores d ON a.intDoctor = d.intDoctor
      WHERE a.intPaciente = ? AND a.isEliminado = 0
      ORDER BY a.datFechaSubida DESC
    `;

    const [archivos]: any = await db.query(query, [parseInt(intPaciente)]);

    return NextResponse.json({
      success: true,
      archivos,
    });
  } catch (error: any) {
    console.error("Error al obtener archivos:", error);
    return NextResponse.json(
      { error: "Error al obtener archivos" },
      { status: 500 }
    );
  }
}
