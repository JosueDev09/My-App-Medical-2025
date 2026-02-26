'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input/input';
import { Label } from '@/components/ui/label/label';

interface Paciente {
  intPaciente: number;
  strNombre: string;
  strApellidoPaterno: string | null;
  strApellidoMaterno: string | null;
  strEmail: string;
  strTelefono: string;
  strGenero: string;
  datFechaNacimiento: string;
}

interface AutocompletePacientesProps {
  value: string;
  onChange: (value: string) => void;
  onSelectPaciente?: (paciente: Paciente | null) => void;
  error?: string;
  className?: string;
}

export default function AutocompletePacientes({
  value,
  onChange,
  onSelectPaciente,
  error,
  className = ''
}: AutocompletePacientesProps) {
  const [sugerencias, setSugerencias] = useState<Paciente[]>([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<Paciente | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Cerrar sugerencias al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setMostrarSugerencias(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Buscar pacientes cuando el usuario escribe
  useEffect(() => {
    const buscarPacientes = async () => {
      if (value.length < 2) {
        setSugerencias([]);
        return;
      }

      setCargando(true);
      try {
        const res = await fetch(`/api/pacientes?tipo=buscar&nombre=${encodeURIComponent(value)}`);
        const data = await res.json();
        
        if (data.success) {
          setSugerencias(data.data);
          setMostrarSugerencias(true);
        }
      } catch (error) {
        console.error('Error al buscar pacientes:', error);
        setSugerencias([]);
      } finally {
        setCargando(false);
      }
    };

    // Debounce para evitar demasiadas peticiones
    const timeoutId = setTimeout(buscarPacientes, 300);
    return () => clearTimeout(timeoutId);
  }, [value]);

  const handleSelectPaciente = (paciente: Paciente) => {
    const nombreCompleto = `${paciente.strNombre} ${paciente.strApellidoPaterno || ''} ${paciente.strApellidoMaterno || ''}`.trim();
    onChange(nombreCompleto);
    setPacienteSeleccionado(paciente);
    setMostrarSugerencias(false);
    
    if (onSelectPaciente) {
      onSelectPaciente(paciente);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevoValor = e.target.value;
    onChange(nuevoValor);
    
    // Si el usuario borra o cambia el texto, deseleccionar paciente
    if (pacienteSeleccionado) {
      setPacienteSeleccionado(null);
      if (onSelectPaciente) {
        onSelectPaciente(null);
      }
    }
  };

  const calcularEdad = (fechaNacimiento: string): number => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    
    return edad;
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <Input
          value={value}
          onChange={handleInputChange}
          className={`${error ? 'border-red-500' : ''} ${className}`}
          placeholder="Escribe el nombre del paciente..."
          autoComplete="off"
        />
        {cargando && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        )}
      </div>

      {/* Sugerencias */}
      {mostrarSugerencias && sugerencias.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {sugerencias.map((paciente) => {
            const nombreCompleto = `${paciente.strNombre} ${paciente.strApellidoPaterno || ''} ${paciente.strApellidoMaterno || ''}`.trim();
            const edad = calcularEdad(paciente.datFechaNacimiento);
            
            return (
              <div
                key={`paciente-${paciente.intPaciente}`}
                onClick={() => handleSelectPaciente(paciente)}
                className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{nombreCompleto}</p>
                    <div className="flex gap-4 text-sm text-gray-600 mt-1">
                      <span>📧 {paciente.strEmail}</span>
                      <span>📱 {paciente.strTelefono}</span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm font-medium text-gray-600">{edad} años</p>
                    <p className="text-xs text-gray-500">{paciente.strGenero}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sin resultados */}
      {mostrarSugerencias && !cargando && sugerencias.length === 0 && value.length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-4">
          <p className="text-gray-600 text-center">
            No se encontró ningún paciente con ese nombre.
          </p>
          <p className="text-gray-500 text-sm text-center mt-2">
            Completa el formulario para registrar un nuevo paciente.
          </p>
        </div>
      )}

      {/* Paciente seleccionado */}
      {pacienteSeleccionado && (
        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800 font-medium">
            ✓ Paciente existente seleccionado
          </p>
          <p className="text-xs text-green-600 mt-1">
            Los datos del paciente se cargarán automáticamente
          </p>
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
