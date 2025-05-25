/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';;
import { sendEmailWithQR } from '@/lib/mailer';

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    //console.log('Iniciando la función GET');
    const folio:any =  req.nextUrl.pathname.split('/').pop();


   //console.log('Folio recibido:', folio);

    const [rows]: any = await db.query('CALL sp_tbCitas_Get_Cita(?)', [folio]);
   
    if (rows.length === 0) {
      return new NextResponse('Cita no encontrada', { status: 404 });
    }
    const cita = rows[0][0];
    if (cita.strCorreo === null || cita.strCorreo === '') {
      return new NextResponse('Cita no encontrada', { status: 404 });
    }
    //console.log('Datos de la cita:', cita);
    // Enviar correo con el QR
    if(cita.strCorreoPaciente !== null && cita.strCorreoPaciente !== '') { 
      console.log('Enviando correo a:', cita.strCorreoPaciente);
      console.log('Enviando correo a:', cita.strCorreoPaciente);
        await sendEmailWithQR(cita.strCorreoPaciente, folio);
    }


    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('Error al obtener cita por folio:', error);
    return new NextResponse('Error en el servidor', { status: 500 });
  }
}
