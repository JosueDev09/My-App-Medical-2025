/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from '@/auth';
import { getAuthenticatedUser } from '@/lib/auth-helper';
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
      const session = await getAuthenticatedUser();
      const email = session?.email;
//   console.log("Tipo de usuario:", req.nextUrl);
     
      // Verifica si el usuario está presente
      console.log("Usuario:", email);
      if (!email) {
        return new NextResponse("Usuario no proporcionado", { status: 400 });
      }
      const [rows]: any = await db.query('CALL sp_tbCitas_List_Usuario(?)', [email]); // Puedes tipar `rows` mejor si conoces su estructura
      return NextResponse.json(rows[0], { status: 200 });
    }

    if(tipo === 'lista-citas-doctor'){
      const session = await getAuthenticatedUser();
      const email = session?.email;
      
    //  console.log("Usuario Doctor:", session);
      if (!email) {
        return new NextResponse("Usuario no proporcionado", { status: 400 });
      }
      
      // Obtener citas del doctor usando su email
      const query = `
        SELECT 
          c.intCita,
          c.strNombrePaciente,
          c.intEdad,
          c.strGenero,
          c.strCorreoPaciente,
          c.strTelefonoPaciente,
          c.intEspecialidad,
          c.intDoctor,
          c.datFecha,
          c.intHora,
          c.strEstatusPago,
          c.dblTotal,
          c.strFolio,
          c.strMotivo,
          c.datFechaAlta,
          c.datFechaModificacion,
          c.strMetodoPago,
          c.intPaciente,
          c.strEstatusCita,
          d.strNombre ,
          d.strApellidos,
          e.strNombreEspecialidad
        FROM tbcitas c
        INNER JOIN tbdoctores d ON c.intDoctor = d.intDoctor
        LEFT JOIN tbespecialidades e ON c.intEspecialidad = e.intEspecialidad
        WHERE d.strEmail = ?
        ORDER BY c.datFecha DESC, c.intHora DESC
      `;
      
      const [rows]: any = await db.query(query, [email]);
      return NextResponse.json(rows, { status: 200 });
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
    const { strNombrePaciente,intEdad,strGenero,strTelefonoPaciente,strCorreoPaciente,intEspecialidad,intDoctor,datFecha,intHora,strMotivo } = crearCita;

    const parametros = [
      strNombrePaciente || '',
      parseInt(intEdad) || 0,
      strGenero || '',
      strCorreoPaciente || '',
      strTelefonoPaciente || '',
      parseInt(intEspecialidad) || 0,
      parseInt(intDoctor) || 0,
      datFecha || null,
      intHora || '',
      strMotivo || '',
    ]
    //console.log('Parámetros enviados:', parametros.length, parametros);
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
