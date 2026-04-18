import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const intPaciente = searchParams.get("intPaciente");

    if (!intPaciente) {
      return NextResponse.json(
        { error: "ID de paciente requerido" },
        { status: 400 }
      );
    }

    const connection = await db.getConnection();

    try {
      // Obtener todos los signos vitales del paciente desde consultas
      const [datos] = await connection.query<RowDataPacket[]>(
        `SELECT 
          c.datFechaConsulta as datFecha,
          sv.dblPeso,
          sv.dblTalla,
          sv.dblIMC,
          sv.dblTemperatura,
          sv.strPresionArterial,
          sv.intFrecuenciaCardiaca,
          sv.intFrecuenciaRespiratoria,
          sv.dblSaturacionOxigeno
        FROM tbConsultas c
        LEFT JOIN tbConsultaSignosVitales sv ON c.intConsulta = sv.intConsulta
        WHERE c.intPaciente = ? 
          AND c.isEliminado = 0
          AND (
            sv.dblPeso IS NOT NULL 
            OR sv.dblTalla IS NOT NULL 
            OR sv.dblTemperatura IS NOT NULL
            OR sv.strPresionArterial IS NOT NULL
          )
        ORDER BY c.datFechaConsulta ASC`,
        [intPaciente]
      );

      // Calcular IMC si no está calculado
      const datosConIMC = datos.map(dato => {
        let imc = dato.dblIMC;
        if (!imc && dato.dblPeso && dato.dblTalla && dato.dblTalla > 0) {
          imc = dato.dblPeso / (dato.dblTalla * dato.dblTalla);
        }
        return {
          ...dato,
          dblIMC: imc
        };
      });

      return NextResponse.json({
        success: true,
        datos: datosConIMC,
        total: datosConIMC.length
      });

    } finally {
      connection.release();
    }

  } catch (error: any) {
    console.error("Error en gráficas:", error);
    return NextResponse.json(
      { error: "Error al cargar datos de gráficas", details: error.message },
      { status: 500 }
    );
  }
}
