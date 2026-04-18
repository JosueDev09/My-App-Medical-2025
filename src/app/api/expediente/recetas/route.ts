import { NextRequest, NextResponse } from "next/server";
import {db} from "@/lib/db";

// GET - Obtener recetas de un paciente
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
        r.intReceta,
        r.strFolio,
        r.datFechaEmision,
        r.txtIndicacionesGenerales,
        r.strEstatus,
        r.strRutaPDF,
        CONCAT(d.strNombre, ' ', d.strApellidos) AS strNombreDoctor
      FROM tbRecetas r
      INNER JOIN tbDoctores d ON r.intDoctor = d.intDoctor
      WHERE r.intPaciente = ? AND r.isEliminado = 0
      ORDER BY r.datFechaEmision DESC
    `;

    const [recetas]: any = await db.query(query, [parseInt(intPaciente)]);

    return NextResponse.json({
      success: true,
      recetas,
    });
  } catch (error: any) {
    console.error("Error al obtener recetas:", error);
    return NextResponse.json(
      { error: "Error al obtener recetas" },
      { status: 500 }
    );
  }
}
