import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";

/**
 * GET /api/cie10/buscar?q=termino
 * Busca códigos CIE-10 por término de búsqueda
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const termino = searchParams.get("q") || "";

    if (!termino || termino.length < 2) {
      return NextResponse.json(
        { error: "El término de búsqueda debe tener al menos 2 caracteres" },
        { status: 400 }
      );
    }

    const [rows] = await db.query<RowDataPacket[]>(
      "CALL sp_BuscarCIE10(?)",
      [termino]
    );

    // El stored procedure devuelve un array de arrays
    const resultados = rows[0] || [];

    return NextResponse.json({
      success: true,
      data: resultados,
      total: resultados.length,
    });
  } catch (error) {
    console.error("Error al buscar CIE-10:", error);
    return NextResponse.json(
      { error: "Error al buscar códigos CIE-10" },
      { status: 500 }
    );
  }
}
