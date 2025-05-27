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
      const idEspecialidad = searchParams.get('idEspecialidad');
      
      if (idEspecialidad) {
        const [rows]: any = await db.query(
          'CALL sp_tbDoctores_Get(?)',
          [idEspecialidad]
        );
        return NextResponse.json(rows[0], { status: 200 });
      }
    
      // Si no se pasa idEspecialidad, retorna todos los doctores
      const [rows]: any = await db.query('SELECT intDoctor, strNombreDoctor FROM tbDoctores');
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
      const [rows]: any = await db.query('CALL sp_tbCitas_List_Usuario(?)',email); // Puedes tipar `rows` mejor si conoces su estructura
      return NextResponse.json(rows[0], { status: 200 });
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
      strNombrePaciente,
      parseInt(intEdad),
      strGenero ,
      strCorreoPaciente ,
      strTelefonoPaciente ,
      parseInt(idEspecialidad) ,
      parseInt(intDoctor) ,
      datFecha ,
      intHora ,
      strMotivo ,
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
