import { NextResponse } from "next/server";
import {db} from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth-helper";

// GET - Obtener historial médico con filtros por rol
export async function GET(request: Request) {
  try {
    // Verificar autenticación
    const user = await getAuthenticatedUser();
    
    const { searchParams } = new URL(request.url);
    const intPaciente = searchParams.get("intPaciente");
    const intDoctor = searchParams.get("intDoctor");
    
    
    let query = `
      SELECT 
        c.intCita,
        c.strFolio,
        c.datFecha,
        c.intHora,
        c.strMotivo,
        c.strEstatuscita,
        p.strNombre AS strNombrePaciente,
        p.intEdad,
        p.strGenero,
        p.strTelefono AS strTelefonoPaciente,
        p.strEmail AS strCorreoPaciente,
        CONCAT(d.strNombre, ' ', d.strApellidos) AS strNombreDoctor,
        e.strNombreEspecialidad,
        c.intPaciente,
        c.intDoctor,
        co.intConsulta,
        co.strMotivoConsulta,
        co.strPadecimientoActual,
        co.strExploracionFisica,
        co.strDiagnostico,
        co.strNotasConsulta,
        co.strTratamiento,
        co.strIndicaciones,
        csv.dblPeso,
        csv.dblTalla,
        csv.dblTemperatura,
        csv.dblGlucosa,
        csv.dblSaturacionOxigeno

      FROM tbcitas c
      INNER JOIN tbpacientes p ON c.intPaciente = p.intPaciente
      INNER JOIN tbdoctores d ON c.intDoctor = d.intDoctor
      INNER JOIN tbespecialidades e ON d.intEspecialidad = e.intEspecialidad
      LEFT JOIN tbConsultas co ON c.intCita = co.intCita
      LEFT JOIN tbConsultaSignosVitales csv ON co.intConsulta = csv.intConsulta
      WHERE c.strEstatuscita = 'FINALIZADA'
 
    `;

    const params: any[] = [];

    
    console.log("Usuario autenticado en GET de historial médico:", user.email, "Rol:", user.rol);
    // Filtrar según el rol del usuario
    if (user.rol === "doctor" && user.intDoctor) {
      // Doctor solo ve sus propias consultas
      query += ` AND c.intDoctor = ?`;
      params.push(user.intDoctor);
    } 

       // console.log("Query antes de filtros adicionales:", query);  
    
    // Filtros adicionales opcionales
    if (intPaciente) {
      query += ` AND c.intPaciente = ?`;
      params.push(intPaciente);
    }

    if (intDoctor && (user.rol === "superdmin" || user.rol === "recepcion")) {
      query += ` AND c.intDoctor = ?`;
      params.push(intDoctor);
    }

    query += ` ORDER BY c.datFecha DESC, c.intHora DESC`;

    const [historiales]: any = await db.query(query, params);

   // console.log("Historiales obtenidos:", historiales);

    return NextResponse.json(historiales);
  } catch (error: any) {
    console.error("Error al obtener historial médico:", error);
    
    if (error.message.includes("Token") || error.message.includes("autenticado")) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al obtener el historial médico" },
      { status: 500 }
    );
  }
}

// GET para obtener listado de pacientes (para filtro)
export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    const body = await request.json();
    const { tipo } = body;

    if (tipo === "pacientes") {
      // Obtener lista de pacientes con consultas finalizadas
      let query = `
        SELECT DISTINCT
          p.intPaciente,
         p.strNombre AS strNombreCompleto
        FROM tbpacientes p
        INNER JOIN tbcitas c ON p.intPaciente = c.intPaciente
        WHERE c.strEstatuscita = 'FINALIZADA'
      `;
      
      const params: any[] = [];

      if (user.rol === "Doctor" && user.intDoctor) {
        query += ` AND c.intDoctor = ?`;
        params.push(user.intDoctor);
      }

      query += ` ORDER BY p.strNombre`;

      const [pacientes]: any = await db.query(query, params);
      return NextResponse.json(pacientes);
    }

    if (tipo === "doctores") {

     
      // Solo admin y recepción pueden obtener lista de doctores
      //console.log("Usuario en POST de historial médico para doctores:", user.email, "Rol:", user.rol);
      if (user.rol !== "superadmin" && user.rol !== "recepcion") {
        return NextResponse.json(
          { error: "No tiene permisos" },
          { status: 403 }
        );
      }

      const query = `
        SELECT DISTINCT
          d.intDoctor,
          CONCAT(d.strNombre, ' ', d.strApellidos) AS strNombreCompleto
        FROM tbdoctores d
        INNER JOIN tbcitas c ON d.intDoctor = c.intDoctor
        WHERE c.strEstatuscita = 'FINALIZADA'
        
      `;

      const [doctores]: any = await db.query(query);
      return NextResponse.json(doctores);
    }

    return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });
  } catch (error: any) {
    console.error("Error en POST historial médico:", error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
