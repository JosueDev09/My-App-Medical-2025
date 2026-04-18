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
      const eventos: any[] = [];

      // 1. CONSULTAS
      const [consultas] = await connection.query<RowDataPacket[]>(
        `SELECT 
          c.intConsulta,
          c.datFechaConsulta as datFecha,
          c.strMotivoConsulta,
          c.strDiagnostico,
          c.strTratamiento,
          c.strEstatusConsulta,
          CONCAT(d.strNombre, ' ', d.strApellidos) as strNombreDoctor
        FROM tbConsultas c
        LEFT JOIN tbdoctores d ON c.intDoctor = d.intDoctor
        WHERE c.intPaciente = ? AND c.isEliminado = 0
        ORDER BY c.datFechaConsulta DESC`,
        [intPaciente]
      );

      consultas.forEach((c) => {
        eventos.push({
          intEvento: `c_${c.intConsulta}`,
          strTipo: 'CONSULTA',
          datFecha: c.datFecha,
          strTitulo: c.strMotivoConsulta || 'Consulta médica',
          strDescripcion: `Diagnóstico: ${c.strDiagnostico || 'N/A'}\nTratamiento: ${c.strTratamiento || 'N/A'}`,
          strDoctor: c.strNombreDoctor || 'N/A',
          strEstatus: c.strEstatusConsulta,
          intRegistro: c.intConsulta
        });
      });

      // 2. RECETAS (de consultas finalizadas)
      const [recetas] = await connection.query<RowDataPacket[]>(
        `SELECT 
          c.intConsulta,
          c.datFechaConsulta as datFecha,
          c.strTratamiento,
          c.strDiagnostico,
          CONCAT(d.strNombre, ' ', d.strApellidos) as strNombreDoctor
        FROM tbConsultas c
        LEFT JOIN tbdoctores d ON c.intDoctor = d.intDoctor
        WHERE c.intPaciente = ? 
          AND c.strEstatusConsulta = 'FINALIZADA'
          AND c.strTratamiento IS NOT NULL
          AND c.strTratamiento != ''
          AND c.isEliminado = 0
        ORDER BY c.datFechaConsulta DESC`,
        [intPaciente]
      );

      recetas.forEach((r) => {
        eventos.push({
          intEvento: `r_${r.intConsulta}`,
          strTipo: 'RECETA',
          datFecha: r.datFecha,
          strTitulo: 'Receta médica',
          strDescripcion: `Diagnóstico: ${r.strDiagnostico || 'N/A'}\n\nTratamiento prescrito:\n${r.strTratamiento}`,
          strDoctor: r.strNombreDoctor || 'N/A',
          strEstatus: 'FINALIZADA',
          intRegistro: r.intConsulta
        });
      });

      // 3. ESTUDIOS (opcional - solo si la tabla existe)
      try {
        const [estudios] = await connection.query<RowDataPacket[]>(
          `SELECT 
            e.intEstudio,
            e.strTipoEstudio,
            e.strNombreEstudio,
            e.datFechaSolicitud as datFecha,
            e.datFechaResultado,
            e.strEstatus,
            e.txtResultados,
            CONCAT(d.strNombre, ' ', d.strApellidos) as strNombreDoctor
          FROM tbEstudios e
          LEFT JOIN tbdoctores d ON e.intDoctor = d.intDoctor
          WHERE e.intPaciente = ?
          ORDER BY e.datFechaSolicitud DESC`,
          [intPaciente]
        );

        estudios.forEach((e) => {
          eventos.push({
            intEvento: `e_${e.intEstudio}`,
            strTipo: 'ESTUDIO',
            datFecha: e.datFecha,
            strTitulo: `${e.strTipoEstudio}: ${e.strNombreEstudio}`,
            strDescripcion: e.txtResultados 
              ? `Resultados:\n${e.txtResultados}\n\nFecha de resultado: ${e.datFechaResultado ? new Date(e.datFechaResultado).toLocaleDateString('es-MX') : 'Pendiente'}`
              : 'Estudio solicitado, pendiente de resultados',
            strDoctor: e.strNombreDoctor || 'N/A',
            strEstatus: e.strEstatus,
            intRegistro: e.intEstudio
          });
        });
      } catch (error) {
        console.log('Tabla tbEstudios no disponible, omitiendo estudios del timeline');
      }

      // 4. ARCHIVOS (opcional - solo si la tabla existe)
      try {
        const [archivos] = await connection.query<RowDataPacket[]>(
          `SELECT 
            a.intArchivo,
            a.strNombreArchivo,
            a.strCategoria,
            a.datFechaSubida as datFecha,
            a.txtDescripcion,
            CONCAT(d.strNombre, ' ', d.strApellidos) as strNombreDoctor
          FROM tbArchivosExpediente a
          LEFT JOIN tbdoctores d ON a.intDoctor = d.intDoctor
          WHERE a.intPaciente = ?
          ORDER BY a.datFechaSubida DESC`,
          [intPaciente]
        );

        archivos.forEach((a) => {
          eventos.push({
            intEvento: `a_${a.intArchivo}`,
            strTipo: 'ARCHIVO',
            datFecha: a.datFecha,
            strTitulo: `Archivo: ${a.strNombreArchivo}`,
            strDescripcion: `Categoría: ${a.strCategoria}\n${a.txtDescripcion || 'Sin descripción'}`,
            strDoctor: a.strNombreDoctor || 'Sistema',
            intRegistro: a.intArchivo
          });
        });
      } catch (error) {
        console.log('Tabla tbArchivosExpediente no disponible, omitiendo archivos del timeline');
      }

      // 5. EVOLUCIONES (opcional - solo si la tabla existe)
      try {
        const [evoluciones] = await connection.query<RowDataPacket[]>(
          `SELECT 
            e.intEvolucion,
            e.datFechaEvolucion as datFecha,
            e.txtNotasEvolucion,
            e.strEstadoGeneral,
            CONCAT(d.strNombre, ' ', d.strApellidos) as strNombreDoctor
          FROM tbEvolucionPaciente e
          LEFT JOIN tbdoctores d ON e.intDoctor = d.intDoctor
          WHERE e.intPaciente = ?
          ORDER BY e.datFechaEvolucion DESC`,
          [intPaciente]
        );

        evoluciones.forEach((ev) => {
          eventos.push({
            intEvento: `ev_${ev.intEvolucion}`,
            strTipo: 'CONSULTA',
            datFecha: ev.datFecha,
            strTitulo: `Nota de evolución - ${ev.strEstadoGeneral || 'Sin clasificar'}`,
            strDescripcion: ev.txtNotasEvolucion || 'Sin notas',
            strDoctor: ev.strNombreDoctor || 'N/A',
            intRegistro: ev.intEvolucion
          });
        });
      } catch (error) {
        console.log('Tabla tbEvolucionPaciente no disponible, omitiendo evoluciones del timeline');
      }

      // Ordenar todos los eventos por fecha (más recientes primero)
      eventos.sort((a, b) => {
        return new Date(b.datFecha).getTime() - new Date(a.datFecha).getTime();
      });

      return NextResponse.json({
        success: true,
        eventos,
        total: eventos.length
      });

    } finally {
      connection.release();
    }

  } catch (error: any) {
    console.error("Error en timeline:", error);
    return NextResponse.json(
      { error: "Error al cargar timeline", details: error.message },
      { status: 500 }
    );
  }
}
