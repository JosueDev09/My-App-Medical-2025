'use client';


import { Button } from '@/components/ui/button/button';
import  BreadcrumbSteps   from '@/components/ui/breadcrum-step/BreadcrumbSteps';
import { usePagoCita } from './resumen-citas';
import { DollarSignIcon } from "lucide-react";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import BotonPaypal from '@/components/buttonPaypal/button-Paypal';

interface ResumenCitaProps {
  datos: {
    strNombrePaciente:string,
    intEdad: 0 ,
    strGenero:'' ,
    strCorreoPaciente:'' ,
    strTelefonoPaciente:'' ,
    idEspecialidad: '0' ,
    intDoctor: '0' ,
    strNombreEspecialidad: '' ,
    strNombreDoctor: '' ,
    datFecha:'' ,
    intHora:'' ,
   // dblTotal:'',
   // strFolio:'' ,
    strMotivo:'' ,
    strEstatusPago:string
  };
  onPagoCompletado: () => void;
}

export default function ResumenCita({ onPagoCompletado }: ResumenCitaProps) {
  const [cita, setCita] = useState<null | {
    strNombrePaciente: string;
    intEdad: number;
    strGenero: string;
    strTelefonoPaciente: string;
    strCorreoPaciente: string;
    strNombreEspecialidad: string;
    strNombreDoctor: string;
    datFecha: string;
    intHora: string;
    strMotivo: string;
    strEstatusPago: string;
    strFolio:string;
  }>(null);
  const searchParams = useSearchParams();
  const folio = searchParams?.get('folio');

  const { pagoRealizado, handlePago } = usePagoCita( onPagoCompletado);

  useEffect(() => {
    const fetchCita = async () => {
      if (!folio) return;

      const res = await fetch(`/api/citas/${folio}`);
      if (res.ok) {
        const data = await res.json();
        setCita(data[0]);
      }
    };

    fetchCita();
  }, [folio]);

  if (!cita) return <p>Cargando...</p>;

  return (
    
    <div className="flex flex-col items-center justify-center">
       <div className="w-full max-w-3xl">
            <BreadcrumbSteps pasoActual={1} />
            </div>
    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 space-y-6">
    
      <h2 className="text-2xl font-bold text-center text-gray-800">Resumen de la Cita</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
        <p><span className="font-medium">Nombre:</span>{cita.strNombrePaciente || 'Cargando nombre...'} </p>
        <p><span className="font-medium">Edad:</span> {cita.intEdad || 'Cargando Edad...'}</p>
        <p><span className="font-medium">Genero:</span> {cita.strGenero|| 'Cargando Genero...'}</p>
        <p><span className="font-medium">Teléfono:</span> {cita.strTelefonoPaciente || 'Cargando Teléfono...'}</p>
        <p><span className="font-medium">Correo:</span> {cita.strCorreoPaciente || 'Cargando Correo...'}</p>
        <p><span className="font-medium">Especialidad:</span> {cita.strNombreEspecialidad || 'Cargando Especialidad...'}</p>
        <p><span className="font-medium">Médico:</span> {cita.strNombreDoctor || 'Cargando Médico...'}</p>
        <p><span className="font-medium">Fecha:</span> {cita.datFecha || 'Cargando Fecha...'}</p>
        <p><span className="font-medium">Hora:</span> {cita.intHora || 'Cargando Hora...'}</p>
        <p className="col-span-2"><span className="font-medium">Motivo:</span> {cita.strMotivo || 'Cargando Motivo...'}</p>
      </div>

      {!pagoRealizado ? (
        <div className="pt-4">
          <h3 className="text-md font-semibold mb-2 text-gray-800">Pagar consulta ($500 MXN)</h3>
          <div className="border rounded-lg p-4 shadow-sm">
         
            <Button className="w-full mb-4 bg-green-500 text-white cursor-pointer  text-[20px] hover:bg-green-300 hover:text-white" variant="outline" onClick={handlePago}>
            <DollarSignIcon className="w-6 h-" /> Efectivo
            </Button>
            {/* Componente de pago PayPal */}
            {cita?.strFolio && (
              <BotonPaypal folio={cita.strFolio} onPagoVerificado={handlePago} />
            )}
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
