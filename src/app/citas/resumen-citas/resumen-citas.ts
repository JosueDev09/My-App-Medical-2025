import { useState } from 'react';

export function usePagoCita(datos: any, onPagoCompletado: () => void) {
  const [pagoRealizado, setPagoRealizado] = useState(false);
  const [pasoActual, setPasoActual] = useState(0);

  const handlePago = async () => {
    const res = await fetch('/api/citas/crear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });

    if (res.ok) {
      setPagoRealizado(true);
      onPagoCompletado();
    } else {
      alert('Error al guardar la cita.');
    }
  };

  return {
    pagoRealizado,
    pasoActual,
    setPasoActual,
    handlePago,
  };
}