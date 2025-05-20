import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { sendCorreo } from '@/lib/mailer';

// Simulación: reemplaza con tu lógica real de base de datos
const getDatosCitaPorFolio = async (folio: string) => {
  return {
    correo: 'paciente@ejemplo.com',
    nombre: 'Juan Pérez',
    folio,
  };
};

export async function POST(
  req: Request,
  { params }: { params: { folio: string } }
) {
  const folio = params.folio;
  const datos = await getDatosCitaPorFolio(folio);

  if (!datos || !datos.correo) {
    return NextResponse.json({ error: 'Cita no encontrada o sin correo' }, { status: 404 });
  }

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/asistencia/${folio}`;
  const qrDataUrl = await QRCode.toDataURL(url);

  const html = `
    <p>Hola <strong>${datos.nombre}</strong>,</p>
    <p>Adjunto encontrarás el código QR para registrar tu asistencia el día de tu cita.</p>
    <p>Escanéalo en recepción al llegar:</p>
    <img src="${qrDataUrl}" alt="QR de asistencia" />
    <p>URL: <a href="${url}">${url}</a></p>
    <p>Gracias por confiar en nosotros.</p>
  `;

  const resultado = await sendCorreo(datos.correo, 'Código QR de tu cita médica', html);

  if (!resultado.success) {
    return NextResponse.json({ error: 'Error al enviar el correo' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Correo enviado con éxito' });
}
