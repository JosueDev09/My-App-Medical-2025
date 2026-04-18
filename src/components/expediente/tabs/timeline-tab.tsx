"use client";

import { useState, useEffect } from "react";
import { 
  Calendar, 
  Stethoscope, 
  Pill, 
  FlaskConical, 
  FileText, 
  Activity,
  Clock,
  ChevronDown,
  ChevronUp,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button/button";
import { Badge } from "@/components/ui/badge/badge";

interface EventoTimeline {
  intEvento: number;
  strTipo: 'CONSULTA' | 'RECETA' | 'ESTUDIO' | 'ARCHIVO' | 'VACUNA';
  datFecha: string;
  strTitulo: string;
  strDescripcion: string;
  strDoctor: string;
  strEstatus?: string;
  intRegistro: number; // ID del registro original (intConsulta, intEstudio, etc)
}

interface TimelineTabProps {
  intPaciente: number;
}

export default function TimelineTab({ intPaciente }: TimelineTabProps) {
  const [eventos, setEventos] = useState<EventoTimeline[]>([]);
  const [eventosFiltrados, setEventosFiltrados] = useState<EventoTimeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState<string>('TODOS');
  const [eventosExpandidos, setEventosExpandidos] = useState<Set<number>>(new Set());

  useEffect(() => {
    cargarTimeline();
  }, [intPaciente]);

  useEffect(() => {
    if (filtroTipo === 'TODOS') {
      setEventosFiltrados(eventos);
    } else {
      setEventosFiltrados(eventos.filter(e => e.strTipo === filtroTipo));
    }
  }, [filtroTipo, eventos]);

  const cargarTimeline = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/expediente/timeline?intPaciente=${intPaciente}`);
      if (response.ok) {
        const data = await response.json();
        setEventos(data.eventos || []);
        setEventosFiltrados(data.eventos || []);
      }
    } catch (error) {
      console.error("Error al cargar timeline:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleEvento = (intEvento: number) => {
    const nuevo = new Set(eventosExpandidos);
    if (nuevo.has(intEvento)) {
      nuevo.delete(intEvento);
    } else {
      nuevo.add(intEvento);
    }
    setEventosExpandidos(nuevo);
  };

  const getIcono = (tipo: string) => {
    switch (tipo) {
      case 'CONSULTA': return <Stethoscope className="w-5 h-5 text-blue-600" />;
      case 'RECETA': return <Pill className="w-5 h-5 text-green-600" />;
      case 'ESTUDIO': return <FlaskConical className="w-5 h-5 text-purple-600" />;
      case 'ARCHIVO': return <FileText className="w-5 h-5 text-orange-600" />;
      case 'VACUNA': return <Activity className="w-5 h-5 text-red-600" />;
      default: return <Calendar className="w-5 h-5 text-gray-600" />;
    }
  };

  const getColorTipo = (tipo: string) => {
    switch (tipo) {
      case 'CONSULTA': return 'bg-blue-50 border-blue-200';
      case 'RECETA': return 'bg-green-50 border-green-200';
      case 'ESTUDIO': return 'bg-purple-50 border-purple-200';
      case 'ARCHIVO': return 'bg-orange-50 border-orange-200';
      case 'VACUNA': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando historial...</p>
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
            <Calendar className="w-6 h-6 text-blue-600" />
            Timeline Clínica
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Historial cronológico completo del paciente
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {eventosFiltrados.length} evento{eventosFiltrados.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Filtrar por:</span>
          
          <Button
            size="sm"
            variant={filtroTipo === 'TODOS' ? 'default' : 'outline'}
            onClick={() => setFiltroTipo('TODOS')}
          >
            Todos ({eventos.length})
          </Button>
          
          <Button
            size="sm"
            variant={filtroTipo === 'CONSULTA' ? 'default' : 'outline'}
            onClick={() => setFiltroTipo('CONSULTA')}
            className="gap-2"
          >
            <Stethoscope className="w-4 h-4" />
            Consultas ({eventos.filter(e => e.strTipo === 'CONSULTA').length})
          </Button>
          
          <Button
            size="sm"
            variant={filtroTipo === 'RECETA' ? 'default' : 'outline'}
            onClick={() => setFiltroTipo('RECETA')}
            className="gap-2"
          >
            <Pill className="w-4 h-4" />
            Recetas ({eventos.filter(e => e.strTipo === 'RECETA').length})
          </Button>
          
          <Button
            size="sm"
            variant={filtroTipo === 'ESTUDIO' ? 'default' : 'outline'}
            onClick={() => setFiltroTipo('ESTUDIO')}
            className="gap-2"
          >
            <FlaskConical className="w-4 h-4" />
            Estudios ({eventos.filter(e => e.strTipo === 'ESTUDIO').length})
          </Button>
          
          <Button
            size="sm"
            variant={filtroTipo === 'ARCHIVO' ? 'default' : 'outline'}
            onClick={() => setFiltroTipo('ARCHIVO')}
            className="gap-2"
          >
            <FileText className="w-4 h-4" />
            Archivos ({eventos.filter(e => e.strTipo === 'ARCHIVO').length})
          </Button>
        </div>
      </div>

      {/* Timeline */}
      {eventosFiltrados.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">No hay eventos registrados</p>
          <p className="text-gray-500 text-sm mt-2">El historial aparecerá aquí conforme se registren eventos</p>
        </div>
      ) : (
        <div className="relative">
          {/* Línea vertical */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>

          {/* Eventos */}
          <div className="space-y-4">
            {eventosFiltrados.map((evento, index) => (
              <div key={evento.intEvento} className="relative pl-20">
                {/* Círculo en la línea */}
                <div className="absolute left-5 top-4 w-6 h-6 rounded-full bg-white border-4 border-blue-600 shadow-md"></div>

                {/* Tarjeta del evento */}
                <div className={`border-2 rounded-lg transition-all ${getColorTipo(evento.strTipo)}`}>
                  {/* Header */}
                  <div 
                    className="p-4 cursor-pointer hover:bg-white/50 transition-colors"
                    onClick={() => toggleEvento(evento.intEvento)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getIcono(evento.strTipo)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-800">{evento.strTitulo}</h4>
                            <Badge variant="outline" className="text-xs">
                              {evento.strTipo}
                            </Badge>
                            {evento.strEstatus && (
                              <Badge 
                                className={
                                  evento.strEstatus === 'FINALIZADA' || evento.strEstatus === 'COMPLETADO'
                                    ? 'bg-green-100 text-green-800'
                                    : evento.strEstatus === 'PENDIENTE'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-gray-100 text-gray-800'
                                }
                              >
                                {evento.strEstatus}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatearFecha(evento.datFecha)}
                            </span>
                            {evento.strDoctor && (
                              <span className="flex items-center gap-1">
                                👨‍⚕️ {evento.strDoctor}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="ml-2"
                      >
                        {eventosExpandidos.has(evento.intEvento) ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Contenido expandido */}
                  {eventosExpandidos.has(evento.intEvento) && (
                    <div className="border-t border-gray-200 p-4 bg-white">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {evento.strDescripcion || 'Sin descripción adicional'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
