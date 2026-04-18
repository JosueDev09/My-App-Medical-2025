import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { intConsulta: string } }
) {
  try {
    const { intConsulta } =await  params;
    
    // Obtener datos de la consulta con información del doctor, paciente y signos vitales
    const query = `
      SELECT 
        c.*,
        d.strNombre as strNombreDoctor,
        d.strApellidos as strApellidosDoctor,
        d.strCedulaProfesional,
        e.strNombreEspecialidad,
        p.strNombre as strNombrePaciente,        sv.dblPeso,
        sv.dblTalla,
        sv.dblIMC,
        sv.strPresionArterial,
        sv.intFrecuenciaCardiaca,
        sv.intFrecuenciaRespiratoria,
        sv.dblTemperatura,
        sv.dblGlucosa,
        sv.dblSaturacionOxigeno
      FROM tbConsultas c
      INNER JOIN tbdoctores d ON c.intDoctor = d.intDoctor
      LEFT JOIN tbespecialidades e ON d.intEspecialidad = e.intEspecialidad
      INNER JOIN tbpacientes p ON c.intPaciente = p.intPaciente
      LEFT JOIN tbConsultaSignosVitales sv ON c.intConsulta = sv.intConsulta
      WHERE c.intConsulta = ?
    `;

    const [rows]: any = await db.query(query, [intConsulta]);

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Consulta no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      consulta: rows[0]
    });

  } catch (error: any) {
    console.error("Error al obtener consulta:", error);
    return NextResponse.json(
      { success: false, message: "Error al obtener la consulta", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { intConsulta: string } }
) {
  try {
    const { intConsulta } = params;
    const body = await req.json();
    const { strDiagnostico, strTratamiento, signosVitales } = body;

    // Iniciar transacción
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      // 1. Actualizar datos de la consulta
      const queryConsulta = `
        UPDATE tbConsultas 
        SET 
          strDiagnostico = ?,
          strTratamiento = ?
        WHERE intConsulta = ?
      `;

      await connection.query(queryConsulta, [
        strDiagnostico || null,
        strTratamiento || null,
        intConsulta
      ]);

      // 2. Actualizar signos vitales (si existen)
      if (signosVitales) {
        const querySignosVitales = `
          UPDATE tbConsultaSignosVitales
          SET
            strPresionArterial = ?,
            dblTemperatura = ?,
            dblPeso = ?,
            dblTalla = ?
          WHERE intConsulta = ?
        `;

        await connection.query(querySignosVitales, [
          signosVitales.strPresionArterial || null,
          signosVitales.dblTemperatura ? parseFloat(signosVitales.dblTemperatura) : null,
          signosVitales.dblPeso ? parseFloat(signosVitales.dblPeso) : null,
          signosVitales.dblTalla ? parseFloat(signosVitales.dblTalla) : null,
          intConsulta
        ]);
      }

      // Confirmar transacción
      await connection.commit();

      return NextResponse.json({
        success: true,
        message: "Receta actualizada exitosamente"
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error: any) {
    console.error("Error al actualizar consulta:", error);
    return NextResponse.json(
      { success: false, message: "Error al actualizar la receta", error: error.message },
      { status: 500 }
    );
  }
}
