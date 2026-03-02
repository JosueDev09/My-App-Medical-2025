"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  Circle,
  PlayCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Activity,
  UserCheck,
  Stethoscope,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog/dialog";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";
import { Textarea } from "@/components/ui/textarea/textarea";

interface Cita {
  intCita: number;
  strNombrePaciente: string;
  strTelefonoPaciente: string;
  strCorreoPaciente: string;
  strNombreDoctor: string;
  strNombreEspecialidad: string;
  datFecha: string;
  intHora: string;
  strMotivo: string;
  strEstado: string;
  intEdad: number;
  strGenero: string;
}

interface ConsultaData {
  intCita: number;
  strNotasConsulta: string;
  strDiagnostico: string;
  strReceta: string;
  strSignosVitales: string;
}

export default function AgendaPage() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [cargando, setCargando] = useState(true);
  const [modalConsulta, setModalConsulta] = useState(false);
  const [citaActual, setCitaActual] = useState<Cita | null>(null);
  const [consultaData, setConsultaData] = useState<ConsultaData>({
    intCita: 0,
    strNotasConsulta: "",
    strDiagnostico: "",
    strReceta: "",
    strSignosVitales: ""
  });

  // Cargar citas
  const fetchCitas = async () => {
    setCargando(true);
    try {
      const response = await fetch("/api/citas?tipo=lista-citas-admin");
      if (!response.ok) throw new Error("Error al cargar citas");
      
      const data = await response.json();
      setCitas(data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchCitas();
  }, []);

  // Filtrar citas por fecha seleccionada
  const citasDia = citas.filter((cita) => {
    const fechaCita = new Date(cita.datFecha);
    const esMismaFecha = 
      fechaCita.getDate() === fechaSeleccionada.getDate() &&
      fechaCita.getMonth() === fechaSeleccionada.getMonth() &&
      fechaCita.getFullYear() === fechaSeleccionada.getFullYear();
    
    if (filtroEstado === "todos") return esMismaFecha;
    return esMismaFecha && cita.strEstado.toLowerCase() === filtroEstado.toLowerCase();
  }).sort((a, b) => a.intHora.localeCompare(b.intHora));

  // Cambiar fecha
  const cambiarDia = (dias: number) => {
    const nuevaFecha = new Date(fechaSeleccionada);
    nuevaFecha.setDate(nuevaFecha.getDate() + dias);
    setFechaSeleccionada(nuevaFecha);
  };

  const irHoy = () => {
    setFechaSeleccionada(new Date());
  };

  // Cambiar estado de cita
  const cambiarEstado = async (intCita: number, nuevoEstado: string) => {
    try {
      const response = await fetch("/api/citas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intCita, strEstado: nuevoEstado })
      });

      if (!response.ok) throw new Error("Error al cambiar estado");
      
      await fetchCitas();
    } catch (error) {
      console.error("Error:", error);
      alert("Error al cambiar el estado de la cita");
    }
  };

  // Iniciar consulta
  const iniciarConsulta = (cita: Cita) => {
    setCitaActual(cita);
    setConsultaData({
      intCita: cita.intCita,
      strNotasConsulta: "",
      strDiagnostico: "",
      strReceta: "",
      strSignosVitales: ""
    });
    cambiarEstado(cita.intCita, "EN CONSULTA");
    setModalConsulta(true);
  };

  // Finalizar consulta
  const finalizarConsulta = async () => {
    try {
      // Aquí puedes guardar los datos de la consulta en una tabla de expedientes médicos
      // Por ahora solo cambiamos el estado
      await cambiarEstado(consultaData.intCita, "FINALIZADA");
      setModalConsulta(false);
      setCitaActual(null);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al finalizar la consulta");
    }
  };

  // Estadísticas del día
  const estadisticas = {
    total: citasDia.length,
    pendientes: citasDia.filter(c => c.strEstado.toLowerCase() === "pendiente").length,
    enEspera: citasDia.filter(c => c.strEstado.toLowerCase() === "en espera").length,
    enConsulta: citasDia.filter(c => c.strEstado.toLowerCase() === "en consulta").length,
    finalizadas: citasDia.filter(c => c.strEstado.toLowerCase() === "finalizada").length,
    canceladas: citasDia.filter(c => c.strEstado.toLowerCase() === "cancelada").length,
  };

  // Obtener próxima cita
  const horaActual = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false });
  const proximaCita = citasDia.find(cita => 
    cita.intHora > horaActual && 
    (cita.strEstado.toLowerCase() === "confirmada" || cita.strEstado.toLowerCase() === "pendiente" || cita.strEstado.toLowerCase() === "en espera")
  );

  // Función para obtener el color según el estado
  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "pendiente":
        return { bg: "bg-yellow-50", border: "border-yellow-300", text: "text-yellow-700", icon: Circle };
      case "confirmada":
        return { bg: "bg-blue-50", border: "border-blue-300", text: "text-blue-700", icon: PlayCircle };
      case "en espera":
        return { bg: "bg-orange-50", border: "border-orange-300", text: "text-orange-700", icon: UserCheck };
      case "en consulta":
        return { bg: "bg-purple-50", border: "border-purple-300", text: "text-purple-700", icon: Stethoscope };
      case "completada":
      case "finalizada":
        return { bg: "bg-green-50", border: "border-green-300", text: "text-green-700", icon: CheckCircle2 };
      case "cancelada":
        return { bg: "bg-red-50", border: "border-red-300", text: "text-red-700", icon: XCircle };
      default:
        return { bg: "bg-gray-50", border: "border-gray-300", text: "text-gray-700", icon: Circle };
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header con navegación de fecha */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="w-8 h-8 text-blue-600" />
            Agenda del Doctor
          </h1>
          
          <Button onClick={irHoy} variant="outline">
            Hoy
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => cambiarDia(-1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className="text-center min-w-[300px]">
            <p className="text-2xl font-bold">
              {fechaSeleccionada.toLocaleDateString('es-MX', { 
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => cambiarDia(1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Estadísticas del día */}
      <div className="grid grid-cols-6 gap-3 mb-6">
        <div className="bg-white p-3 rounded-lg border-2 border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Total</p>
              <p className="text-2xl font-bold">{estadisticas.total}</p>
            </div>
            <Activity className="w-6 h-6 text-gray-500" />
          </div>
        </div>
        
        <div className="bg-yellow-50 p-3 rounded-lg border-2 border-yellow-300 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-yellow-700">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-700">{estadisticas.pendientes}</p>
            </div>
            <Circle className="w-6 h-6 text-yellow-600" />
          </div>
        </div>

        <div className="bg-orange-50 p-3 rounded-lg border-2 border-orange-300 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-orange-700">En Espera</p>
              <p className="text-2xl font-bold text-orange-700">{estadisticas.enEspera}</p>
            </div>
            <UserCheck className="w-6 h-6 text-orange-600" />
          </div>
        </div>

        <div className="bg-purple-50 p-3 rounded-lg border-2 border-purple-300 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-purple-700">En Consulta</p>
              <p className="text-2xl font-bold text-purple-700">{estadisticas.enConsulta}</p>
            </div>
            <Stethoscope className="w-6 h-6 text-purple-600" />
          </div>
        </div>

        <div className="bg-green-50 p-3 rounded-lg border-2 border-green-300 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-700">Finalizadas</p>
              <p className="text-2xl font-bold text-green-700">{estadisticas.finalizadas}</p>
            </div>
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
        </div>

        <div className="bg-red-50 p-3 rounded-lg border-2 border-red-300 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-red-700">Canceladas</p>
              <p className="text-2xl font-bold text-red-700">{estadisticas.canceladas}</p>
            </div>
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      {/* Próxima cita destacada */}
      {proximaCita && (
        <div className="mb-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-6 h-6" />
            <h2 className="text-xl font-bold">PRÓXIMA CITA</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-blue-100 text-sm">Hora</p>
              <p className="text-2xl font-bold">{proximaCita.intHora}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Paciente</p>
              <p className="text-lg font-semibold">{proximaCita.strNombrePaciente}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Motivo</p>
              <p className="text-lg">{proximaCita.strMotivo}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="mb-4 flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-600">Filtrar:</span>
        {["todos", "pendiente", "en espera", "en consulta", "finalizada", "cancelada"].map((estado) => (
          <Button
            key={estado}
            variant={filtroEstado === estado ? "default" : "outline"}
            size="sm"
            onClick={() => setFiltroEstado(estado)}
          >
            {estado.charAt(0).toUpperCase() + estado.slice(1)}
          </Button>
        ))}
      </div>

      {/* Timeline de citas */}
      <div className="space-y-4">
        {cargando ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        ) : citasDia.length > 0 ? (
          citasDia.map((cita) => {
            const estadoColor = getEstadoColor(cita.strEstado);
            const IconoEstado = estadoColor.icon;
            const esPasada = cita.intHora < horaActual;

            return (
              <div
                key={cita.intCita}
                className={`${estadoColor.bg} border-2 ${estadoColor.border} rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow ${
                  esPasada ? "opacity-70" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Hora */}
                  <div className="flex-shrink-0 text-center">
                    <div className={`${estadoColor.text} font-bold text-2xl`}>
                      {cita.intHora}
                    </div>
                    <IconoEstado className={`w-6 h-6 ${estadoColor.text} mx-auto mt-2`} />
                  </div>

                  {/* Información del paciente */}
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        {cita.strNombrePaciente}
                      </h3>
                      <span className={`px-4 py-1 rounded-full text-sm font-semibold ${estadoColor.bg} ${estadoColor.text} border ${estadoColor.border}`}>
                        {cita.strEstado}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Phone className="w-4 h-4" />
                        <span>{cita.strTelefonoPaciente}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Mail className="w-4 h-4" />
                        <span>{cita.strCorreoPaciente}</span>
                      </div>
                      <div className="text-gray-700">
                        <span className="font-medium">Edad:</span> {cita.intEdad} años
                      </div>
                      <div className="text-gray-700">
                        <span className="font-medium">Género:</span> {cita.strGenero}
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-gray-600 mt-1" />
                        <div>
                          <p className="text-sm font-semibold text-gray-600">Motivo de consulta:</p>
                          <p className="text-gray-800">{cita.strMotivo}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                      <Activity className="w-4 h-4" />
                      <span className="font-medium">{cita.strNombreEspecialidad}</span>
                      <span>•</span>
                      <span>Dr. {cita.strNombreDoctor}</span>
                    </div>

                    {/* Botones de acción según el estado */}
                    <div className="mt-4 flex gap-2">
                      {(cita.strEstado.toLowerCase() === "pendiente" || cita.strEstado.toLowerCase() === "confirmada") && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => cambiarEstado(cita.intCita, "EN ESPERA")}
                          className="bg-orange-50 text-orange-700 border-orange-300 hover:bg-orange-100"
                        >
                          <UserCheck className="w-4 h-4 mr-2" />
                          Marcar EN ESPERA
                        </Button>
                      )}

                      {cita.strEstado.toLowerCase() === "en espera" && (
                        <Button
                          size="sm"
                          onClick={() => iniciarConsulta(cita)}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          <Stethoscope className="w-4 h-4 mr-2" />
                          INICIAR CONSULTA
                        </Button>
                      )}

                      {cita.strEstado.toLowerCase() === "en consulta" && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setCitaActual(cita);
                            setConsultaData({
                              intCita: cita.intCita,
                              strNotasConsulta: "",
                              strDiagnostico: "",
                              strReceta: "",
                              strSignosVitales: ""
                            });
                            setModalConsulta(true);
                          }}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          <Stethoscope className="w-4 h-4 mr-2" />
                          Continuar Consulta
                        </Button>
                      )}

                      {(cita.strEstado.toLowerCase() === "pendiente" || 
                        cita.strEstado.toLowerCase() === "confirmada" || 
                        cita.strEstado.toLowerCase() === "en espera") && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => cambiarEstado(cita.intCita, "CANCELADA")}
                          className="bg-red-50 text-red-700 border-red-300 hover:bg-red-100"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-xl font-semibold text-gray-600">No hay citas para este día</p>
            <p className="text-gray-500 mt-2">Selecciona otra fecha o agenda nuevas citas</p>
          </div>
        )}
      </div>

      {/* Modal de Consulta */}
      <Dialog open={modalConsulta} onOpenChange={setModalConsulta}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-purple-600" />
              Consulta Médica
            </DialogTitle>
          </DialogHeader>

          {citaActual && (
            <div className="space-y-6">
              {/* Información del paciente */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Información del Paciente
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Nombre:</span> {citaActual.strNombrePaciente}
                  </div>
                  <div>
                    <span className="font-medium">Edad:</span> {citaActual.intEdad} años
                  </div>
                  <div>
                    <span className="font-medium">Género:</span> {citaActual.strGenero}
                  </div>
                  <div>
                    <span className="font-medium">Teléfono:</span> {citaActual.strTelefonoPaciente}
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Motivo:</span> {citaActual.strMotivo}
                  </div>
                </div>
              </div>

              {/* Signos Vitales */}
              <div>
                <Label htmlFor="signos">Signos Vitales</Label>
                <Input
                  id="signos"
                  placeholder="Ej: Presión: 120/80, Temp: 36.5°C, FC: 72, FR: 18"
                  value={consultaData.strSignosVitales}
                  onChange={(e) => setConsultaData({...consultaData, strSignosVitales: e.target.value})}
                />
              </div>

              {/* Notas de Consulta */}
              <div>
                <Label htmlFor="notas">Notas de la Consulta</Label>
                <Textarea
                  id="notas"
                  rows={4}
                  placeholder="Describe los síntomas, examen físico, antecedentes relevantes..."
                  value={consultaData.strNotasConsulta}
                  onChange={(e) => setConsultaData({...consultaData, strNotasConsulta: e.target.value})}
                />
              </div>

              {/* Diagnóstico */}
              <div>
                <Label htmlFor="diagnostico">Diagnóstico</Label>
                <Textarea
                  id="diagnostico"
                  rows={3}
                  placeholder="Diagnóstico médico..."
                  value={consultaData.strDiagnostico}
                  onChange={(e) => setConsultaData({...consultaData, strDiagnostico: e.target.value})}
                />
              </div>

              {/* Receta */}
              <div>
                <Label htmlFor="receta">Tratamiento / Receta</Label>
                <Textarea
                  id="receta"
                  rows={4}
                  placeholder="Medicamentos, dosis, frecuencia, duración..."
                  value={consultaData.strReceta}
                  onChange={(e) => setConsultaData({...consultaData, strReceta: e.target.value})}
                />
              </div>

              {/* Botones */}
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setModalConsulta(false)}
                >
                  Cerrar
                </Button>
                <Button
                  onClick={finalizarConsulta}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  FINALIZAR CONSULTA
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
