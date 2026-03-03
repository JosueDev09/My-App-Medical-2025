/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from '@/auth';
import { db } from '@/lib/db'; // Asegúrate de que la ruta sea correcta
import { NextRequest, NextResponse } from 'next/server';

// Ajusta esta ruta según tu proyecto

export async function GET(req: NextRequest): Promise<NextResponse>  {
  const { searchParams } = new URL(req.url);
  const tipo = searchParams.get('tipo');
  try {
    if (tipo === 'especialidades') {
      const [rows]: any = await db.query('CALL sp_tbEspecialidades_Get');
      return NextResponse.json(rows, { status: 200 });
    }

    if (tipo === 'doctores') {
      const intEspecialidad = searchParams.get('intEspecialidad');
      
      if (intEspecialidad) {  
        const [rows]: any = await db.query(
          'CALL sp_tbDoctores_Get(?)',
          [parseInt(intEspecialidad)]
        );
        return NextResponse.json(rows[0], { status: 200 });
      }
    
      // Si no se pasa idEspecialidad, retorna todos los doctores
      const [rows]: any = await db.query('SELECT intDoctor, strNombre, strApellidos FROM tbDoctores');
      return NextResponse.json(rows, { status: 200 });
    }
    if(tipo === 'lista-citas-admin'){
      const [rows]: any = await db.query('CALL sp_tbCitas_List'); // Puedes tipar `rows` mejor si conoces su estructura
      return NextResponse.json(rows[0], { status: 200 });
    }
     if(tipo === 'lista-citas-paciente'){
      const session = await auth();
     // console.log("Sesión obtenida:", session?.user.email);
      const email = session?.user?.email; // Asegúrate de que el usuario esté en la sesión
//   console.log("Tipo de usuario:", req.nextUrl);
     
      // Verifica si el usuario está presente
      console.log("Usuario:", email);
      if (!email) {
        return new NextResponse("Usuario no proporcionado", { status: 400 });
      }
      const [rows]: any = await db.query('CALL sp_tbCitas_List_Usuario(?)', [email]); // Puedes tipar `rows` mejor si conoces su estructura
      return NextResponse.json(rows[0], { status: 200 });
    }

    if(tipo === 'agenda-doctor'){
      const session = await auth();
      const email = session?.user?.email;
      const idDoctor = searchParams.get('idDoctor');

      if (!email) {
        return new NextResponse("Usuario no autenticado", { status: 401 });
      }

      // Obtener información del usuario
      const [userRows]: any = await db.query(
        'SELECT strRol, intDoctor FROM tbusuarios WHERE strCorreo = ?',
        [email]
      );

      if (!userRows || userRows.length === 0) {
        return new NextResponse("Usuario no encontrado", { status: 404 });
      }

      const user = userRows[0];
      const rol = user.strRol?.toLowerCase();
      
      // Si es doctor, solo puede ver sus propias citas
      if (rol === 'doctor') {
        const doctorId = user.intDoctor;
        if (!doctorId) {
          return new NextResponse("Doctor no asociado al usuario", { status: 400 });
        }

        const [rows]: any = await db.query(
          `SELECT 
            c.intCita,
            c.datFecha,
            c.intHora,
            c.strMotivo,
            c.strEstado,
            p.strNombre as strNombrePaciente,
            p.strTelefono as strTelefonoPaciente,
            p.strCorreo as strCorreoPaciente,
            p.intEdad,
            p.strGenero,
            CONCAT(d.strNombre, ' ', d.strApellidoPaterno, ' ', d.strApellidoMaterno) as strNombreDoctor,
            e.strNombreEspecialidad
          FROM tbcitas c
          INNER JOIN tbpacientes p ON c.intIdPaciente = p.intIdPaciente
          INNER JOIN tbdoctores d ON c.intIdDoctor = d.intDoctor
          INNER JOIN tbespecialidades e ON d.intEspecialidad = e.intEspecialidad
          WHERE c.intIdDoctor = ?
          ORDER BY c.datFecha DESC, c.intHora`,
          [doctorId]
        );
        return NextResponse.json(rows, { status: 200 });
      }

      // Si es admin o recepción, puede filtrar por doctor
      if (rol === 'superadmin' || rol === 'recepcion') {
        let query = `
          SELECT 
            c.intCita,
            c.datFecha,
            c.intHora,
            c.strMotivo,
            c.strEstado,
            p.strNombre as strNombrePaciente,
            p.strTelefono as strTelefonoPaciente,
            p.strCorreo as strCorreoPaciente,
            p.intEdad,
            p.strGenero,
            CONCAT(d.strNombre, ' ', d.strApellidoPaterno, ' ', d.strApellidoMaterno) as strNombreDoctor,
            e.strNombreEspecialidad
          FROM tbcitas c
          INNER JOIN tbpacientes p ON c.intIdPaciente = p.intIdPaciente
          INNER JOIN tbdoctores d ON c.intIdDoctor = d.intDoctor
          INNER JOIN tbespecialidades e ON d.intEspecialidad = e.intEspecialidad
        `;
        
        const params: any[] = [];
        
        if (idDoctor) {
          query += ' WHERE c.intIdDoctor = ?';
          params.push(parseInt(idDoctor));
        }
        
        query += ' ORDER BY c.datFecha DESC, c.intHora';
        
        const [rows]: any = await db.query(query, params);
        return NextResponse.json(rows, { status: 200 });
      }

      return new NextResponse("Rol no autorizado", { status: 403 });
    }
    return new NextResponse('Parámetro tipo inválido', { status: 400 });
   
  } catch (error) {
    console.error("Error al obtener las citas:", error);
    return new NextResponse('Error al obtener las citas', { status: 500 });
  }
}



export async function POST(req: NextRequest): Promise<NextResponse> {
  try{
    const crearCita = await req.json();
    const { strNombrePaciente,intEdad,strGenero,strTelefonoPaciente,strCorreoPaciente,idEspecialidad,intDoctor,datFecha,intHora,strMotivo } = crearCita;

    const parametros = [
      strNombrePaciente || '',
      parseInt(intEdad) || 0,
      strGenero || '',
      strCorreoPaciente || '',
      strTelefonoPaciente || '',
      parseInt(idEspecialidad) || 0,
      parseInt(intDoctor) || 0,
      datFecha || null,
      intHora || '',
      strMotivo || '',
    ]
   // console.log('Parámetros enviados:', parametros.length, parametros);
    const [rows]: any = await db.query('CALL sp_tbCitas_Save(?,?,?,?,?,?,?,?,?,?)',parametros);
    const cita = rows[0][0];
    return NextResponse.json(cita, { status: 200 });

  } catch (error) {
    console.error("Error al crear la cita:", error);
    return new NextResponse('Error al crear la cita', { status: 500 });
  }
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    const { intCita, strEstado } = await req.json();

    if (!intCita || !strEstado) {
      return NextResponse.json(
        { success: false, error: 'ID de cita y estado son requeridos' },
        { status: 400 }
      );
    }

    const query = `UPDATE tbcitas SET strEstado = ? WHERE intCita = ?`;
    await db.query(query, [strEstado, intCita]);

    return NextResponse.json({
      success: true,
      message: 'Estado actualizado exitosamente'
    });

  } catch (error: any) {
    console.error("Error al actualizar estado:", error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar estado', details: error.message },
      { status: 500 }
    );
  }
}
