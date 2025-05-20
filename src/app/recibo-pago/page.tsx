'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card/card';
import { Separator } from '@/components/ui/separator/separator';
import { Button } from '@/components/ui/button/button';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';

interface ReciboPagoProps {
  paciente: string;
  fecha: string;
  hora: string;
  especialidad: string;
  medico: string;
  metodoPago: 'efectivo' | 'transferencia';
  estatusPago: 'pendiente' | 'pagado';
  total: number;
  folio: string;
}

export default function ReciboPago({
  paciente,
  fecha,
  hora,
  especialidad,
  medico,
  metodoPago,
  estatusPago,
  total,
  folio,
}: ReciboPagoProps) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(`${window.location.origin}/recibo/${folio}`);
  }, [folio]);

  const enviarQRporCorreo = async () => {
    try {
      const res = await fetch(`/api/citas/${folio}/enviar-qr`, {
        method: 'POST',
      });
      if (res.ok) {
        alert('QR enviado al correo del paciente');
      } else {
        alert('Error al enviar el QR');
      }
    } catch (error) {
      console.error(error);
      alert('Ocurrió un error al intentar enviar el QR');
    }
  };

  return (
    <div className="p-4 print:p-0 print:m-0 print:w-full print:max-w-none print:bg-white print:shadow-none">
      <Card className="shadow-lg print:shadow-none print:border-none print:rounded-none">
        <CardHeader className="text-center">
          <CardTitle className="text-lg font-bold">RECIBO DE PAGO</CardTitle>
          <p className="text-xs text-muted-foreground">Folio: {folio}</p>
        </CardHeader>

        <CardContent className="text-sm space-y-3">
          <div>
            <p><span className="font-semibold">Paciente:</span> {paciente}</p>
            <p><span className="font-semibold">Fecha:</span> {fecha}</p>
            <p><span className="font-semibold">Hora:</span> {hora}</p>
          </div>

          <Separator />

          <div>
            <p><span className="font-semibold">Especialidad:</span> {especialidad}</p>
            <p><span className="font-semibold">Médico:</span> {medico}</p>
          </div>

          <Separator />

          <div>
            <p><span className="font-semibold">Método de pago:</span> {metodoPago === 'efectivo' ? 'Efectivo' : 'Transferencia'}</p>
            <p>
              <span className="font-semibold">Estatus de pago:</span>{' '}
              <span className={estatusPago === 'pagado' ? 'text-green-600 font-semibold' : 'text-orange-500 font-semibold'}>
                {estatusPago === 'pagado' ? 'Pagado' : 'Pendiente'}
              </span>
            </p>
            <p><span className="font-semibold">Total pagado:</span> ${Number(total || 0).toFixed(2)} MXN</p>
          </div>

          <Separator />

          <div className="flex justify-center pt-2">
            {url && <QRCode value={url} size={100} />}
          </div>

          <p className="text-xs text-muted-foreground text-center pt-4">
            Este documento es un comprobante no fiscal.
          </p>
        </CardContent>
      </Card>

      <div className="mt-4 flex flex-col items-center gap-2 print:hidden ">
        <Button onClick={() => window.print()} variant="outline" className='cursor-pointer'>
          Imprimir recibo
        </Button>
        <Button onClick={enviarQRporCorreo} variant="default" className='cursor-pointer'>
          Generar QR de cita y enviarlo por correo
        </Button>
      </div>
    </div>
  );
}
