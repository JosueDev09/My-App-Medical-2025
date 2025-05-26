/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card/card';
import { Separator } from '@/components/ui/separator/separator';
import { Button } from '@/components/ui/button/button';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { ReciboPagoProps } from '@/types/recibo-pago';
import {  useSearchParams } from 'next/navigation';
import formatearFechaLarga from '@/lib/formatterFecha';
import Swal from 'sweetalert2';
import BreadcrumbSteps from '@/components/ui/breadcrum-step/BreadcrumbSteps';




export default function ReciboPago({}: ReciboPagoProps) {
  const [url, setUrl] = useState('');
  const searchParams = useSearchParams();
  const folio = searchParams?.get('folio');
  const [datosCita, setDatosCita] = useState<ReciboPagoProps | null>(null);


  useEffect(() => {
    setUrl(`${window.location.origin}/recibo-pago/${folio}`);
  }, [folio]);

  const enviarQRporCorreo = async (folio: string) => {
    try {
      console.log('folio', folio);
  
      const res = await fetch(`/api/citas/correoQR/${folio}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (res.ok) {
        Swal.fire({
          title: 'QR enviado',
          text: 'El QR ha sido enviado al correo del paciente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });
      } else {
        alert('Error al enviar el QR');
      }
    } catch (error) {
      console.error(error);
      alert('Ocurrió un error al intentar enviar el QR');
    }
  };
  
  
  useEffect(() => {
    const obtenerCita = async () => {
      if (!folio) return;
      console.log('Folio:', folio);
      const res = await fetch(`/api/citas/${folio}`,{
        method: 'GET',
      });

      if (res.ok) {
        const data = await res.json();
        setDatosCita(data[0]);
        
       // console.log('Datos de la cita:', data);
      }
    };

    obtenerCita();
  }, [folio]);

  if (!datosCita) return <p className="text-center mt-10">Cargando recibo...</p>;

  return (
    <div className="p-4 print:p-0 print:m-0 print:w-full print:max-w-none print:bg-white print:shadow-none">
          <div className="w-full m-auto max-w-3xl">
                  <BreadcrumbSteps pasoActual={3} />
                  </div>
      <Card className="w-[50%] m-auto shadow-lg print:shadow-none print:border-none print:rounded-none">
        <CardHeader className="text-center">
          <CardTitle className="text-lg font-bold">RECIBO DE PAGO</CardTitle>
          <p className="text-xs text-muted-foreground">Folio: {folio}</p>
        </CardHeader>

        <CardContent className="text-sm space-y-3">
          <div>
            <p><span className="font-semibold">Paciente:</span> {datosCita.strNombrePaciente}</p>
            <p><span className="font-semibold">Fecha:</span> {formatearFechaLarga(datosCita.datFecha)}</p>
            <p><span className="font-semibold">Hora:</span> {datosCita.intHora}</p>
          </div>

          <Separator />

          <div>
            <p><span className="font-semibold">Especialidad:</span> {datosCita.strNombreEspecialidad}</p>
            <p><span className="font-semibold">Médico:</span> {datosCita.strNombreDoctor}</p>
          </div>

          <Separator />

          <div>
            <p><span className="font-semibold">Método de pago:</span> {datosCita.strMetodoPago }</p>
            <p>
              <span className="font-semibold">Estatus de pago:</span>{' '}
              <span className={datosCita.strEstatusPago === 'pagado' ? 'text-green-600 font-semibold' : 'text-orange-500 font-semibold'}>
                {datosCita.strEstatusPago === 'pagado' ? 'Pagado' : 'Pendiente'}
              </span>
            </p>
            <p><span className="font-semibold">Total pagado:</span> ${Number(datosCita.dblTotal || 0).toFixed(2)} MXN</p>
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
        <Button onClick={() => enviarQRporCorreo(datosCita.strFolio)} variant="default" className='cursor-pointer'>
          Generar QR de cita y enviarlo por correo
        </Button>
      </div>
    </div>
  );
}