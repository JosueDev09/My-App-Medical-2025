/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { ReciboPagoProps } from '@/types/recibo-pago';
import { useSearchParams } from 'next/navigation';
import formatearFechaLarga from '@/lib/formatterFecha';
import Swal from 'sweetalert2';
import { CheckCircle2, Calendar, Clock, Download, Printer, ArrowLeft, Shield, CreditCard } from 'lucide-react';




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
        
        console.log('Datos de la cita:', data);
      }
    };

    obtenerCita();
  }, [folio]);

  if (!datosCita) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg">Cargando recibo...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Estilos personalizados */}
    
      <div className="min-h-screen  selection:bg-blue-500/30 relative overflow-hidden">
        {/* Abstract background glows */}
        <div className="glow-effect absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full -z-10"></div>
        <div className="glow-effect absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full -z-10"></div>

        {/* Header */}
        <header className="no-print backdrop-blur-md sticky top-0 z-50 shadow-xl shadow-blue-900/10 border-b border-slate-800">
          <div className="flex justify-between items-center w-full px-6 py-4 max-w-screen-2xl mx-auto">
            <div className="flex items-center gap-8">
              <div className="text-2xl font-bold tracking-tighter text-blue-400">Esymbel Medical</div>
            </div>
            <button 
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Regresar
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative py-12 px-4 min-h-[calc(100vh-80px)] flex items-center justify-center">
          <div className="max-w-4xl w-full mx-auto relative">
            <div className="glass-panel border border-slate-700/30 rounded-2xl overflow-hidden shadow-2xl">
              
              {/* Success Header */}
              <div className="dark-header bg-gradient-to-br from-blue-600 to-slate-800 p-8 md:p-12 text-center relative">
                <div className="mb-6 flex justify-center">
                  <div className="w-20 h-20 bg-blue-400/20 rounded-full flex items-center justify-center border border-blue-400/30">
                    <CheckCircle2 className="w-10 h-10 text-blue-400" strokeWidth={2.5} />
                  </div>
                </div>
                <h1 className="font-bold text-4xl md:text-5xl text-white tracking-tight mb-2">
                  Pago Exitoso
                </h1>
                <p className="text-blue-200 font-medium">
                  Gracias por confiar en los servicios de Esymbel Medical
                </p>
              </div>

              {/* Content */}
              <div className="p-8 md:p-12 space-y-12">
                
                {/* Patient and Service Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-b border-slate-700/30 pb-12">
                  
                  {/* Left Column */}
                  <div className="space-y-8">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-black mb-2 block">
                        Información del Paciente
                      </label>
                      <div className="text-xl font-bold text-black-100">
                        {datosCita.strNombrePaciente}
                      </div>
                      <div className="text-sm text-black-400 mt-1">
                        ID: {folio?.substring(0, 12)}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-black mb-2 block">
                        Servicio Clínico
                      </label>
                      <div className="text-xl font-bold text-black-100">
                        {datosCita.strNombreDoctor}
                      </div>
                      <div className="text-sm text-blue-400 font-medium mt-1">
                        {datosCita.strNombreEspecialidad}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-8">
                    <div className="flex justify-between items-start">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-black mb-2 block">
                          Detalles del Recibo
                        </label>
                        <div className="text-sm text-black font-medium">
                          #{folio}
                        </div>
                        <div className="text-sm text-black mt-1">
                          Emitido: {formatearFechaLarga(datosCita.datFecha)}
                        </div>
                      </div>
                      <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/30">
                        {url && <QRCode value={url} size={60} />}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-black mb-2 block">
                        Horario de la Cita
                      </label>
                      <div className="flex items-center gap-2 text-black font-medium">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        <span>{formatearFechaLarga(datosCita.datFecha)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-black font-medium mt-2">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span>{datosCita.intHora}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transaction Summary */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-black mb-6 block">
                    Resumen de la Transacción
                  </label>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-black">Consulta Médica</span>
                      <span className="font-bold text-black">
                        ${Number(datosCita.dblPrecioConsulta || 0).toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="pt-6 mt-4 border-t border-slate-700/30 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                      <div>
                        <label className="text-xs font-bold text-black mb-2 block">
                          Método de Pago
                        </label>
                        <div className="flex items-center gap-3">
                          <div className="bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/30 flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-blue-400" />
                            <span className="text-xs font-medium text-white">
                              {datosCita.strMetodoPago}
                            </span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${
                            datosCita.strEstatusPago === 'pagado'
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                          }`}>
                            {datosCita.strEstatusPago === 'pagado' ? 'PAGADO' : 'PENDIENTE'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-5xl font-bold text-blue-400 tracking-tighter">
                          ${Number(datosCita.dblPrecioConsulta || 0).toFixed(2)}
                        </div>
                        <div className="text-xs text-slate-400 font-medium mt-1">
                          MXN - Incluye todos los impuestos
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="no-print flex flex-col md:flex-row gap-4 pt-8">
                  <button 
                    onClick={() => window.print()}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all hover:brightness-110 shadow-lg shadow-blue-500/20"
                  >
                    <Download className="w-5 h-5" />
                    Descargar Recibo PDF
                  </button>
                  <button 
                    onClick={() => window.print()}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all border border-slate-700"
                  >
                    <Printer className="w-5 h-5" />
                    Imprimir Recibo
                  </button>
                </div>
              </div>

            </div>

            {/* Return Link */}
            <div className="no-print mt-8 text-center">
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Regresar al Dashboard
              </button>
            </div>
          </div>
        </main>

        
      </div>
    </>
  );
}