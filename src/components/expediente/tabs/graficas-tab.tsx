"use client";

import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Activity, 
  Heart, 
  Weight,
  Ruler,
  Thermometer,
  BarChart3,
  LineChart,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button/button";
import { Badge } from "@/components/ui/badge/badge";

interface DatoVital {
  datFecha: string;
  dblPeso: number | null;
  dblTalla: number | null;
  dblIMC: number | null;
  dblTemperatura: number | null;
  strPresionArterial: string | null;
  intFrecuenciaCardiaca: number | null;
  intFrecuenciaRespiratoria: number | null;
}

interface GraficasTabProps {
  intPaciente: number;
}

export default function GraficasTab({ intPaciente }: GraficasTabProps) {
  const [datos, setDatos] = useState<DatoVital[]>([]);
  const [loading, setLoading] = useState(true);
  const [grafica, setGrafica] = useState<'PESO' | 'IMC' | 'TEMPERATURA' | 'PRESION'>('PESO');

  useEffect(() => {
    cargarDatos();
  }, [intPaciente]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/expediente/graficas?intPaciente=${intPaciente}`);
      if (response.ok) {
        const data = await response.json();
        setDatos(data.datos || []);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const calcularEstadisticas = (valores: number[]) => {
    if (valores.length === 0) return { min: 0, max: 0, promedio: 0, tendencia: 0 };
    
    const valoresFiltrados = valores.filter(v => v !== null && v > 0);
    if (valoresFiltrados.length === 0) return { min: 0, max: 0, promedio: 0, tendencia: 0 };

    const min = Math.min(...valoresFiltrados);
    const max = Math.max(...valoresFiltrados);
    const promedio = valoresFiltrados.reduce((a, b) => a + b, 0) / valoresFiltrados.length;
    
    // Calcular tendencia (diferencia entre último y primero)
    const tendencia = valoresFiltrados[valoresFiltrados.length - 1] - valoresFiltrados[0];
    
    return { min, max, promedio, tendencia };
  };

  const renderGraficaLinea = (valores: number[], etiquetas: string[], unidad: string, color: string) => {
    const valoresFiltrados = valores.filter(v => v !== null && v > 0);
    if (valoresFiltrados.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay datos suficientes para mostrar</p>
        </div>
      );
    }

    const stats = calcularEstadisticas(valores);
    const maxValor = Math.max(...valoresFiltrados);
    const minValor = Math.min(...valoresFiltrados);
    const rango = maxValor - minValor || 1;
    const altura = 250;
    const anchoTotal = 800;
    const margenIzq = 60;
    const margenDer = 20;
    const margenTop = 20;
    const margenBottom = 60;
    const anchoGrafica = anchoTotal - margenIzq - margenDer;
    const alturaGrafica = altura - margenTop - margenBottom;
    
    const puntos = valores.map((valor, index) => {
      if (valor === null || valor <= 0) return null;
      const x = margenIzq + (index / (valores.length - 1)) * anchoGrafica;
      const y = margenTop + alturaGrafica - ((valor - minValor) / rango) * alturaGrafica;
      return { x, y, valor, etiqueta: etiquetas[index] };
    }).filter(p => p !== null);

    return (
      <div className="space-y-4">
        {/* Estadísticas */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <p className="text-xs text-gray-600 mb-1">Mínimo</p>
            <p className="text-2xl font-bold text-blue-600">{stats.min.toFixed(1)}</p>
            <p className="text-xs text-gray-500">{unidad}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <p className="text-xs text-gray-600 mb-1">Promedio</p>
            <p className="text-2xl font-bold text-green-600">{stats.promedio.toFixed(1)}</p>
            <p className="text-xs text-gray-500">{unidad}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
            <p className="text-xs text-gray-600 mb-1">Máximo</p>
            <p className="text-2xl font-bold text-purple-600">{stats.max.toFixed(1)}</p>
            <p className="text-xs text-gray-500">{unidad}</p>
          </div>
          <div className={`${stats.tendencia >= 0 ? 'bg-orange-50 border-orange-200' : 'bg-red-50 border-red-200'} rounded-lg p-3 border`}>
            <p className="text-xs text-gray-600 mb-1">Tendencia</p>
            <p className={`text-2xl font-bold ${stats.tendencia >= 0 ? 'text-orange-600' : 'text-red-600'}`}>
              {stats.tendencia > 0 ? '+' : ''}{stats.tendencia.toFixed(1)}
            </p>
            <p className="text-xs text-gray-500">{unidad}</p>
          </div>
        </div>

        {/* Gráfica SVG */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 overflow-x-auto">
          <svg width={anchoTotal} height={altura} className="mx-auto">
            {/* Líneas de grid */}
            {[0, 25, 50, 75, 100].map((porcentaje) => {
              const y = margenTop + (porcentaje / 100) * alturaGrafica;
              const valor = maxValor - (porcentaje / 100) * rango;
              return (
                <g key={porcentaje}>
                  <line
                    x1={margenIzq}
                    y1={y}
                    x2={anchoTotal - margenDer}
                    y2={y}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                  <text
                    x={margenIzq - 10}
                    y={y + 5}
                    textAnchor="end"
                    fontSize="12"
                    fill="#6b7280"
                  >
                    {valor.toFixed(1)}
                  </text>
                </g>
              );
            })}

            {/* Línea de la gráfica */}
            {puntos.length > 1 && (
              <polyline
                points={puntos.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Área bajo la línea */}
            {puntos.length > 1 && (
              <polygon
                points={`
                  ${margenIzq},${margenTop + alturaGrafica}
                  ${puntos.map(p => `${p.x},${p.y}`).join(' ')}
                  ${anchoTotal - margenDer},${margenTop + alturaGrafica}
                `}
                fill={color}
                fillOpacity="0.1"
              />
            )}

            {/* Puntos */}
            {puntos.map((punto, index) => (
              <g key={index}>
                <circle
                  cx={punto.x}
                  cy={punto.y}
                  r="6"
                  fill="white"
                  stroke={color}
                  strokeWidth="3"
                />
                {/* Etiquetas en el eje X */}
                <text
                  x={punto.x}
                  y={altura - margenBottom + 20}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#6b7280"
                  transform={`rotate(-45, ${punto.x}, ${altura - margenBottom + 20})`}
                >
                  {new Date(punto.etiqueta).toLocaleDateString('es-MX', { 
                    day: '2-digit', 
                    month: 'short' 
                  })}
                </text>
                {/* Tooltip */}
                <title>{`${punto.valor.toFixed(1)} ${unidad} - ${new Date(punto.etiqueta).toLocaleDateString('es-MX')}`}</title>
              </g>
            ))}

            {/* Eje Y */}
            <line
              x1={margenIzq}
              y1={margenTop}
              x2={margenIzq}
              y2={altura - margenBottom}
              stroke="#374151"
              strokeWidth="2"
            />

            {/* Eje X */}
            <line
              x1={margenIzq}
              y1={altura - margenBottom}
              x2={anchoTotal - margenDer}
              y2={altura - margenBottom}
              stroke="#374151"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    );
  };

  const renderContenido = () => {
    switch (grafica) {
      case 'PESO':
        return renderGraficaLinea(
          datos.map(d => d.dblPeso || 0),
          datos.map(d => d.datFecha),
          'kg',
          '#3b82f6'
        );
      case 'IMC':
        return renderGraficaLinea(
          datos.map(d => d.dblIMC || 0),
          datos.map(d => d.datFecha),
          'IMC',
          '#10b981'
        );
      case 'TEMPERATURA':
        return renderGraficaLinea(
          datos.map(d => d.dblTemperatura || 0),
          datos.map(d => d.datFecha),
          '°C',
          '#ef4444'
        );
      case 'PRESION':
        // Para presión arterial, mostrar tabla en lugar de gráfica
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Fecha</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Presión Arterial</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">FC</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">FR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {datos.filter(d => d.strPresionArterial).map((dato, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {new Date(dato.datFecha).toLocaleDateString('es-MX')}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        {dato.strPresionArterial || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {dato.intFrecuenciaCardiaca ? `${dato.intFrecuenciaCardiaca} lpm` : 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {dato.intFrecuenciaRespiratoria ? `${dato.intFrecuenciaRespiratoria} rpm` : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Gráficas de Evolución
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Seguimiento de signos vitales y métricas del paciente
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {datos.length} registro{datos.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Selector de gráfica */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 flex-wrap">
          <BarChart3 className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Ver gráfica de:</span>
          
          <Button
            size="sm"
            variant={grafica === 'PESO' ? 'default' : 'outline'}
            onClick={() => setGrafica('PESO')}
            className="gap-2"
          >
            <Weight className="w-4 h-4" />
            Peso
          </Button>
          
          <Button
            size="sm"
            variant={grafica === 'IMC' ? 'default' : 'outline'}
            onClick={() => setGrafica('IMC')}
            className="gap-2"
          >
            <Ruler className="w-4 h-4" />
            IMC
          </Button>
          
          <Button
            size="sm"
            variant={grafica === 'TEMPERATURA' ? 'default' : 'outline'}
            onClick={() => setGrafica('TEMPERATURA')}
            className="gap-2"
          >
            <Thermometer className="w-4 h-4" />
            Temperatura
          </Button>
          
          <Button
            size="sm"
            variant={grafica === 'PRESION' ? 'default' : 'outline'}
            onClick={() => setGrafica('PRESION')}
            className="gap-2"
          >
            <Heart className="w-4 h-4" />
            Presión Arterial
          </Button>
        </div>
      </div>

      {/* Contenido de la gráfica */}
      {datos.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <LineChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">No hay datos para mostrar</p>
          <p className="text-gray-500 text-sm mt-2">Los datos aparecerán conforme se registren consultas</p>
        </div>
      ) : (
        renderContenido()
      )}
    </div>
  );
}
