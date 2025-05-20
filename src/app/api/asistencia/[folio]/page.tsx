'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export default function AsistenciaConfirmacionPage() {

  const { folio } = useParams() as { folio: string };
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const registrarAsistencia = async () => {
      try {
        const res = await fetch(`/api/asistencia/${folio}`, {
          method: 'POST',
        });

        if (res.ok) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (err) {
        console.error(err);
        setStatus('error');
      }
    };

    if (folio) registrarAsistencia();
  }, [folio]);

    useEffect(() => {
      if (status === 'success' || status === 'error') {
        const timeout = setTimeout(() => {
          router.push('/dashboard');
        }, 4000);
        return () => clearTimeout(timeout);
      }
    }, [status, router]);

  

    if (status === 'loading') return  <p className="text-center mt-10">Registrando asistencia</p>

    return (
      <div className="max-w-md mx-auto mt-20">
        {status === 'success' ? (
          <div className="flex flex-col items-center bg-green-100 text-green-800 border border-green-300 p-4 rounded-md">
            <CheckCircle className="h-8 w-8 mb-2" />
            <h2 className="font-bold text-lg">Asistencia registrada</h2>
            <p className="text-sm text-center">La asistencia del paciente ha sido confirmada correctamente.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center bg-red-100 text-red-800 border border-red-300 p-4 rounded-md">
            <h2 className="font-bold text-lg">Error al registrar asistencia</h2>
            <p className="text-sm text-center">Verifica que el código QR sea válido o que la cita exista.</p>
          </div>
        )}
      </div>
    );




}
