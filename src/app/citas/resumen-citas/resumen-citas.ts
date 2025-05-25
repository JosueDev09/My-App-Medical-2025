/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { NextResponse } from 'next/server';

export function usePagoCita(onPagoCompletado?: () => void) {
  const [pagoRealizado, setPagoRealizado] = useState(false);
  const [pasoActual, setPasoActual] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const folio = searchParams?.get('folio');
 
  

  const handlePago = async () => {
    try {
      console.log('Datos de la cita:', folio);
      const res = await fetch('/api/citas/pago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          folio: folio,
          metodo: 'PayPal' // Puedes ajustarlo según el tipo de pago
        }),
      });  

     // console.log('Respuesta de la API:', res);

     if (!folio) {
      console.error('❌ Folio no recibido en la petición');
      return NextResponse.json({ error: 'Folio requerido' }, { status: 400 });
    }

      setPagoRealizado(true);
      if (typeof onPagoCompletado === 'function') {
        onPagoCompletado(); // solo si existe
      }

      // Redirige al recibo con el folio
      router.push(`/recibo-pago?folio=${folio}`);
    } catch (error) {
      alert('Error al actualizar el estado de pago.');
      console.error('Error en handlePago:', error);
    }
  };

  return {
    pagoRealizado,
    pasoActual,
    setPasoActual,
     handlePago,
  };
}