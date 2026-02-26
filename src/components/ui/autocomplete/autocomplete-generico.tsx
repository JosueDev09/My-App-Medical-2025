'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Input } from '@/components/ui/input/input';

interface AutocompleteGenericoProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  endpoint: string;
  error?: string;
  className?: string;
  minLength?: number;
  parametrosAdicionales?: Record<string, string>; // Parámetros adicionales para el endpoint
  deshabilitado?: boolean;
}

interface Opcion {
  id: number | string;
  nombre: string;
}

export default function AutocompleteGenerico({
  value,
  onChange,
  placeholder = "Escribe para buscar...",
  endpoint,
  error,
  className = '',
  minLength = 2,
  parametrosAdicionales = {},
  deshabilitado = false,
}: AutocompleteGenericoProps) {
  const [sugerencias, setSugerencias] = useState<Opcion[]>([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [cargando, setCargando] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Serializar parametrosAdicionales para evitar re-renders innecesarios
  const parametrosSerializados = useMemo(() => {
    return JSON.stringify(parametrosAdicionales);
  }, [parametrosAdicionales]);

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

  // Buscar opciones cuando el usuario escribe
  useEffect(() => {
    const buscarOpciones = async () => {
      if (value.length < minLength) {
        setSugerencias([]);
        return;
      }

      const params = JSON.parse(parametrosSerializados);

      // Si hay parámetros adicionales requeridos y no están presentes, no buscar
      if (params && Object.keys(params).length > 0) {
        const valoresVacios = Object.values(params).some((val: any) => !val || val.trim() === '');
        if (valoresVacios) {
          setSugerencias([]);
          return;
        }
      }

      setCargando(true);
      try {
        // Construir URL con parámetros adicionales
        const urlParams = new URLSearchParams({ busqueda: value });
        
        // Agregar parámetros adicionales
        Object.entries(params).forEach(([key, val]: [string, any]) => {
          if (val) urlParams.append(key, val);
        });

        const res = await fetch(`${endpoint}?${urlParams.toString()}`);
        const data = await res.json();
        
        if (data.success) {
          setSugerencias(data.data);
          setMostrarSugerencias(true);
        }
      } catch (error) {
        console.error('Error al buscar opciones:', error);
        setSugerencias([]);
      } finally {
        setCargando(false);
      }
    };

    // Debounce para evitar demasiadas peticiones
    const timeoutId = setTimeout(buscarOpciones, 300);
    return () => clearTimeout(timeoutId);
  }, [value, endpoint, minLength, parametrosSerializados]);

  const handleSelectOpcion = (nombre: string) => {
    onChange(nombre);
    setMostrarSugerencias(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevoValor = e.target.value;
    onChange(nuevoValor);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <Input
          value={value}
          onChange={handleInputChange}
          onFocus={() => value.length >= minLength && sugerencias.length > 0 && setMostrarSugerencias(true)}
          className={`${error ? 'border-red-500' : ''} ${className}`}
          placeholder={placeholder}
          autoComplete="off"
          disabled={deshabilitado}
        />
        {cargando && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        )}
      </div>

      {/* Sugerencias */}
      {mostrarSugerencias && sugerencias.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-auto">
          {sugerencias.map((opcion) => (
            <div
              key={`opcion-${opcion.id}`}
              onClick={() => handleSelectOpcion(opcion.nombre)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 transition-colors"
            >
              <p className="text-sm text-gray-800">{opcion.nombre}</p>
            </div>
          ))}
        </div>
      )}

      {/* Sin resultados */}
      {mostrarSugerencias && !cargando && sugerencias.length === 0 && value.length >= minLength && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3">
          <p className="text-gray-600 text-sm text-center">
            No se encontraron resultados
          </p>
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
