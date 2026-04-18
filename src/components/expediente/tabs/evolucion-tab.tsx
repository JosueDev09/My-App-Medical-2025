"use client";

import { useState, useEffect } from "react";
import { Activity, TrendingUp, Weight, Heart, Droplet, Thermometer } from "lucide-react";

interface SignosVitales {
  fecha: string;
  peso: number | null;
  presion: string | null;
  glucosa: number | null;
  temperatura: number | null;
  imc: number | null;
}

interface EvolucionTabProps {
  intPaciente: number;
}

export default function EvolucionTab({ intPaciente }: EvolucionTabProps) {
  const [loading, setLoading] = useState(true);
  const [datos, setDatos] = useState<SignosVitales[]>([]);

  useEffect(() => {
    cargarEvolucion();
  }, [intPaciente]);

  const cargarEvolucion = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/expediente/evolucion?intPaciente=${intPaciente}`);
      if (response.ok) {
        const data = await response.json();
        setDatos(data.evolucion || []);
      }
    } catch (error) {
      console.error("Error al cargar evolución:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Calcular promedios
  const calcularPromedio = (campo: keyof SignosVitales) => {
    const valores = datos
      .map(d => d[campo])
      .filter(v => v !== null && typeof v === 'number') as number[];
    
    if (valores.length === 0) return null;
    return (valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(2);
  };

  const ultimoRegistro = datos[0];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Evolución del Paciente</h2>
        <p className="text-gray-600">Tendencias y gráficas de signos vitales en el tiempo</p>
      </div>

      {datos.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No hay datos suficientes para mostrar evolución</p>
          <p className="text-sm text-gray-500 mt-1">
            Los datos se generarán automáticamente conforme se registren consultas
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Tarjetas de resumen */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Peso */}
            <div className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Weight className="w-5 h-5" />
                    <span className="text-sm font-medium">Peso</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {ultimoRegistro?.peso ? `${ultimoRegistro.peso} kg` : "N/A"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Promedio: {calcularPromedio("peso")} kg
                  </p>
                </div>
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
            </div>

            {/* IMC */}
            <div className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Activity className="w-5 h-5" />
                    <span className="text-sm font-medium">IMC</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {ultimoRegistro?.imc ? Number(ultimoRegistro.imc).toFixed(2) : "N/A"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Promedio: {calcularPromedio("imc")}
                  </p>
                </div>
                <Activity className="w-4 h-4 text-blue-600" />
              </div>
            </div>

            {/* Glucosa */}
            <div className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Droplet className="w-5 h-5" />
                    <span className="text-sm font-medium">Glucosa</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {ultimoRegistro?.glucosa ? `${ultimoRegistro.glucosa} mg/dL` : "N/A"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Promedio: {calcularPromedio("glucosa")} mg/dL
                  </p>
                </div>
                <Droplet className="w-4 h-4 text-red-600" />
              </div>
            </div>

            {/* Temperatura */}
            <div className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Thermometer className="w-5 h-5" />
                    <span className="text-sm font-medium">Temperatura</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {ultimoRegistro?.temperatura ? `${ultimoRegistro.temperatura}°C` : "N/A"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Promedio: {calcularPromedio("temperatura")}°C
                  </p>
                </div>
                <Thermometer className="w-4 h-4 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Tabla de evolución */}
          <div className="border rounded-lg overflow-hidden bg-white">
            <div className="p-4 bg-gray-50 border-b">
              <h3 className="font-semibold text-gray-800">Historial de Signos Vitales</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Fecha</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Peso (kg)</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">IMC</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Presión</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Glucosa</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Temp (°C)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {datos.map((registro, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {new Date(registro.fecha).toLocaleDateString("es-MX")}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {registro.peso || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {registro.imc ? Number(registro.imc).toFixed(2) : "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {registro.presion || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {registro.glucosa || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {registro.temperatura || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              💡 <span className="font-semibold">Próximamente:</span> Gráficas interactivas para visualizar la evolución de signos vitales en el tiempo.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
