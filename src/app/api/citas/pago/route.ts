// app/api/citas/pago/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

async function obtenerTokenPaypal() {
  const auth = Buffer.from(`${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');

  const res = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await res.json();
  return data.access_token;
}

async function verificarOrdenPaypal(orderID: string, token: string) {
  const res = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('No se pudo verificar la orden con PayPal');

  const data = await res.json();

  //console.log('Respuesta de PayPal:', data);

  if (data.status !== 'APPROVED') throw new Error('El pago no se completó');

  return data;
}

export async function POST(req: NextRequest) {
  try {
    const { orderID, folio, metodo  } = await req.json();

    //console.log('Datos recibidos:', { orderID, folio });

    if (!orderID || !folio) {
      return new NextResponse('Faltan datos', { status: 400 });
    }

    const token = await obtenerTokenPaypal();
    const orden = await verificarOrdenPaypal(orderID, token);
    //console.log('Token de PayPal:', token);
    //console.log('Orden verificada:', orden);


    await db.query(
      'UPDATE tbCitas SET strEstatusPago = "PAGADO",strMetodoPago= ? WHERE strFolio = ?',[metodo || 'Efectivo', folio]
    );

    return NextResponse.json({ message: 'Pago verificado y registrado correctamente' });
  } catch (error) {
    console.error('Error al verificar el pago:', error);
    return new NextResponse('Error al verificar el pago', { status: 500 });
  }
}

