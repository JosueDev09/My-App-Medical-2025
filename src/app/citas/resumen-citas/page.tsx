'use client';

import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useState } from 'react';
import { Button } from '@/components/ui/button/button';
import  BreadcrumbSteps   from '@/components/ui/breadcrum-step/BreadcrumbSteps';
import { usePagoCita } from './resumen-citas';
import { DollarSignIcon } from "lucide-react";

interface ResumenCitaProps {
  datos: {
    nombre: string;
    edad: string;
    sexo: string;
    telefono: string;
    correo: string;
    especialidad: string;
    medico: string;
    fecha: string;
    hora: string;
    motivo: string;
    antecedentes: any;
  };
  onPagoCompletado: () => void;
}

export default function ResumenCita({ datos, onPagoCompletado }: ResumenCitaProps) {

  const { pagoRealizado, handlePago } = usePagoCita(datos, onPagoCompletado);

  return (
    
    <div className="flex flex-col items-center justify-center">
       <div className="w-full max-w-3xl">
            <BreadcrumbSteps pasoActual={1} />
            </div>
    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 space-y-6">
    
      <h2 className="text-2xl font-bold text-center text-gray-800">Resumen de la Cita</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
        <p><span className="font-medium">Nombre:</span> Cargando nombre...</p>
        <p><span className="font-medium">Edad:</span> Cargando Edad...</p>
        <p><span className="font-medium">Sexo:</span> Cargando Sexo...</p>
        <p><span className="font-medium">Teléfono:</span> Cargando Teléfono...</p>
        <p><span className="font-medium">Correo:</span> Cargando Correo...</p>
        <p><span className="font-medium">Especialidad:</span> Cargando Especialidad...</p>
        <p><span className="font-medium">Médico:</span> Cargando Médico...</p>
        <p><span className="font-medium">Fecha:</span> Cargando Fecha...</p>
        <p><span className="font-medium">Hora:</span> Cargando Hora...</p>
        <p className="col-span-2"><span className="font-medium">Motivo:</span> Cargando Motivo...</p>
      </div>

      {!pagoRealizado ? (
        <div className="pt-4">
          <h3 className="text-md font-semibold mb-2 text-gray-800">Pagar consulta ($500 MXN)</h3>
          <div className="border rounded-lg p-4 shadow-sm">
         
            <Button className="w-full mb-4 bg-green-500 text-white cursor-pointer  text-[20px] hover:bg-green-300 hover:text-white" variant="outline" onClick={handlePago}>
            <DollarSignIcon className="w-6 h-" /> Efectivo
            </Button>
            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: { value: '500.00', currency_code: 'MXN' },
                    },
                  ],
                  intent: 'CAPTURE'
                });
              }}
              onApprove={async (data, actions) => {
               // const details = await actions.order.capture();
                await handlePago();
              }}
              onError={(err) => {
                console.error(err);
                alert('Error en el pago. Intenta nuevamente.');
              }}
            />
          </div>
        </div>
      ) : (
        <div className="text-green-600 font-semibold text-center text-lg">
          ✅ ¡Cita agendada y pagada exitosamente!
        </div>
      )}
    </div>
  </div>

  );
}
