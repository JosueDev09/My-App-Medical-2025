import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      intPaciente, 
      intDoctor, 
      intCita,
      consulta, 
      signosVitales 
    } = body;

    // Validar datos requeridos
    if (!intPaciente || !intDoctor) {
      return NextResponse.json(
        { success: false, message: "Datos del paciente o doctor faltantes" },
        { status: 400 }
      );
    }

    // Iniciar transacción para garantizar que ambas inserciones sean exitosas
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      // 1. Insertar consulta en tbConsultas
      const queryConsulta = `
        INSERT INTO tbConsultas (
          intPaciente,
          intCita,
          intDoctor,
          datFechaConsulta,
          strMotivoConsulta,
          strPadecimientoActual,
          strExploracionFisica,
          strNotasConsulta,
          strDiagnostico,
          strTratamiento,
          strIndicaciones,
          strPronostico,
          strEstatusConsulta
        ) VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, 'FINALIZADA')
      `;

      const [resultConsulta]: any = await connection.query(queryConsulta, [
        intPaciente,
        intCita || null,
        intDoctor,
        consulta.strMotivoConsulta || null,
        consulta.strPadecimientoActual || null,
        consulta.strExploracionFisica || null,
        consulta.strNotasConsulta || null,
        consulta.strDiagnostico || null,
        consulta.strTratamiento || null,
        consulta.strIndicaciones || null,
        consulta.strPronostico || null
      ]);

      const intConsulta = resultConsulta.insertId;

      // 2. Insertar signos vitales en tbConsultaSignosVitales
      const querySignosVitales = `
        INSERT INTO tbConsultaSignosVitales (
          intConsulta,
          dblPeso,
          dblTalla,
          dblIMC,
          strPresionArterial,
          intFrecuenciaCardiaca,
          intFrecuenciaRespiratoria,
          dblTemperatura,
          dblGlucosa,
          dblSaturacionOxigeno
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      await connection.query(querySignosVitales, [
        intConsulta,
        signosVitales.dblPeso ? parseFloat(signosVitales.dblPeso) : null,
        signosVitales.dblTalla ? parseFloat(signosVitales.dblTalla) : null,
        signosVitales.dblIMC ? parseFloat(signosVitales.dblIMC) : null,
        signosVitales.strPresionArterial || null,
        signosVitales.intFrecuenciaCardiaca ? parseInt(signosVitales.intFrecuenciaCardiaca) : null,
        signosVitales.intFrecuenciaRespiratoria ? parseInt(signosVitales.intFrecuenciaRespiratoria) : null,
        signosVitales.dblTemperatura ? parseFloat(signosVitales.dblTemperatura) : null,
        signosVitales.dblGlucosa ? parseFloat(signosVitales.dblGlucosa) : null,
        signosVitales.dblSaturacionOxigeno ? parseFloat(signosVitales.dblSaturacionOxigeno) : null
      ]);

      // Confirmar transacción
      await connection.commit();

      return NextResponse.json({
        success: true,
        message: "Consulta y signos vitales guardados exitosamente",
        intConsulta: intConsulta
      });

    } catch (error) {
      // Revertir transacción en caso de error
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error: any) {
    console.error("Error al guardar consulta:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Error al guardar la consulta",
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// GET: Obtener consultas de un paciente
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const intPaciente = searchParams.get("intPaciente");
    const intConsulta = searchParams.get("intConsulta");

    if (intConsulta) {
      // Obtener una consulta específica con sus signos vitales
      const queryConsulta = `
        SELECT 
          c.*,
          p.strNombre as strNombrePaciente,
          p.strApellidos as strApellidosPaciente,
          d.strNombre as strNombreDoctor,
          d.strApellidos as strApellidosDoctor
        FROM tbConsultas c
        INNER JOIN tbPacientes p ON c.intPaciente = p.intPaciente
        INNER JOIN tbDoctores d ON c.intDoctor = d.intDoctor
        WHERE c.intConsulta = ? AND c.isEliminado = 0
      `;

      const [consultas]: any = await db.query(queryConsulta, [intConsulta]);

      if (consultas.length === 0) {
        return NextResponse.json(
          { success: false, message: "Consulta no encontrada" },
          { status: 404 }
        );
      }

      // Obtener signos vitales
      const querySignos = `
        SELECT * FROM tbConsultaSignosVitales 
        WHERE intConsulta = ?
      `;

      const [signosVitales]: any = await db.query(querySignos, [intConsulta]);

      return NextResponse.json({
        success: true,
        consulta: consultas[0],
        signosVitales: signosVitales[0] || null
      });

    } else if (intPaciente) {
      // Obtener todas las consultas de un paciente
      const query = `
        SELECT 
          c.*,
          d.strNombre as strNombreDoctor,
          d.strApellidos as strApellidosDoctor
        FROM tbConsultas c
        INNER JOIN tbDoctores d ON c.intDoctor = d.intDoctor
        WHERE c.intPaciente = ? AND c.isEliminado = 0
        ORDER BY c.datFechaConsulta DESC
      `;

      const [consultas]: any = await db.query(query, [intPaciente]);

      return NextResponse.json({
        success: true,
        data: consultas
      });

    } else {
      return NextResponse.json(
        { success: false, message: "Parámetro intPaciente o intConsulta requerido" },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error("Error al obtener consultas:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Error al obtener consultas",
        error: error.message 
      },
      { status: 500 }
    );
  }
}
