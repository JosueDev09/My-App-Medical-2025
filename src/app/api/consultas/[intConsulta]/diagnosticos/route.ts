import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

/**
 * GET /api/consultas/[intConsulta]/diagnosticos
 * Obtiene todos los diagnósticos de una consulta
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { intConsulta: string } }
) {
  try {
    const { intConsulta } = params;

    const [rows] = await db.query<RowDataPacket[]>(
      "CALL sp_ObtenerDiagnosticosConsulta(?)",
      [parseInt(intConsulta)]
    );

    // El stored procedure devuelve un array de arrays
    const diagnosticos = rows[0] || [];

    return NextResponse.json({
      success: true,
      data: diagnosticos,
    });
  } catch (error) {
    console.error("Error al obtener diagnósticos:", error);
    return NextResponse.json(
      { error: "Error al obtener diagnósticos de la consulta" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/consultas/[intConsulta]/diagnosticos
 * Agrega un diagnóstico a una consulta
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { intConsulta: string } }
) {
  try {
    const { intConsulta } = params;
    const body = await request.json();
    const { intCIE10, strTipoDiagnostico, txtNotasDiagnostico } = body;

    if (!intCIE10) {
      return NextResponse.json(
        { error: "El código CIE-10 es requerido" },
        { status: 400 }
      );
    }

    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO tbConsultaDiagnosticos 
       (intConsulta, intCIE10, strTipoDiagnostico, txtNotasDiagnostico) 
       VALUES (?, ?, ?, ?)`,
      [
        parseInt(intConsulta),
        intCIE10,
        strTipoDiagnostico || "PRINCIPAL",
        txtNotasDiagnostico || null,
      ]
    );

    return NextResponse.json({
      success: true,
      data: {
        intConsultaDiagnostico: result.insertId,
      },
      message: "Diagnóstico agregado exitosamente",
    });
  } catch (error) {
    console.error("Error al agregar diagnóstico:", error);
    return NextResponse.json(
      { error: "Error al agregar diagnóstico" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/consultas/[intConsulta]/diagnosticos?id=123
 * Elimina un diagnóstico de una consulta
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { intConsulta: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const intConsultaDiagnostico = searchParams.get("id");

    if (!intConsultaDiagnostico) {
      return NextResponse.json(
        { error: "ID del diagnóstico es requerido" },
        { status: 400 }
      );
    }

    await db.query(
      "DELETE FROM tbConsultaDiagnosticos WHERE intConsultaDiagnostico = ?",
      [parseInt(intConsultaDiagnostico)]
    );

    return NextResponse.json({
      success: true,
      message: "Diagnóstico eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar diagnóstico:", error);
    return NextResponse.json(
      { error: "Error al eliminar diagnóstico" },
      { status: 500 }
    );
  }
}
