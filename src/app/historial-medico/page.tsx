"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  FileText,
  User,
  Calendar,
  Clock,
  Stethoscope,
  Activity,
  Pill,
  ClipboardList,
  Search,
  Filter,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog/dialog";
import { Label } from "@/components/ui/label/label";
import { Input } from "@/components/ui/input/input";

interface HistorialConsulta {
  intCita: number;
  strFolio: string;
  datFecha: string;
  intHora: string;
  strMotivo: string;
  strEstatuscita: string;
  strNotasConsulta: string;
  strDiagnostico: string;
  strTratamiento: string;
  strSignosVitales: string;
  strNombrePaciente: string;
  intEdad: number;
  strGenero: string;
  strTelefonoPaciente: string;
  strCorreoPaciente: string;
  strNombreDoctor: string;
  strNombreEspecialidad: string;
  intPaciente: number;
  intDoctor: number;
  dblPeso: number;
  dblTalla: number;
  dblTemperatura: number;
}

interface Paciente {
  intPaciente: number;
  strNombreCompleto: string;
}

interface Doctor {
  intDoctor: number;
  strNombreCompleto: string;
}

export default function HistorialMedicoPage() {
  const { data: session } = useSession();
  const [historiales, setHistoriales] = useState<HistorialConsulta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [modalDetalle, setModalDetalle] = useState(false);
  const [consultaSeleccionada, setConsultaSeleccionada] = useState<HistorialConsulta | null>(null);

  // Filtros
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [doctores, setDoctores] = useState<Doctor[]>([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<string>("todos");
  const [doctorSeleccionado, setDoctorSeleccionado] = useState<string>("todos");
  const [busqueda, setBusqueda] = useState("");

  // Obtener rol del usuario
  useEffect(() => {
    if (session?.user?.rol) {
      setUserRole(session.user.rol);
    } else {
      const roleMatch = document.cookie.match(/(^| )role=([^;]+)/);
      const role = roleMatch?.[2];
      if (role) {
        setUserRole(role);
      }
    }
  }, [session]);

  // Cargar pacientes y doctores para filtros
  useEffect(() => {
    const fetchFiltros = async () => {
      try {
        // Cargar pacientes
        const resPacientes = await fetch("/api/historial-medico", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tipo: "pacientes" }),
        });
        
        if (resPacientes.ok) {
          const dataPacientes = await resPacientes.json();
          setPacientes(dataPacientes || []);
        }

        // Cargar doctores (solo para admin/recepción)
        if (userRole === "SuperAdmin" || userRole === "Recepcion") {
          const resDoctores = await fetch("/api/historial-medico", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tipo: "doctores" }),
          });
          
          if (resDoctores.ok) {
            const dataDoctores = await resDoctores.json();
            setDoctores(dataDoctores || []);
          }
        }
      } catch (error) {
        console.error("Error al cargar filtros:", error);
      }
    };

    if (userRole) {
      fetchFiltros();
    }
  }, [userRole]);

  // Cargar historiales
  const fetchHistoriales = async () => {
    setCargando(true);
    try {
      let url = "/api/historial-medico?";
      
      if (pacienteSeleccionado !== "todos") {
        url += `intPaciente=${pacienteSeleccionado}&`;
      }
      
      if (doctorSeleccionado !== "todos") {
        url += `intDoctor=${doctorSeleccionado}&`;
      }

    

      const response = await fetch(url);
      //console.log("Respuesta del servidor:", response);
      if (!response.ok) {
        throw new Error("Error al cargar historiales");
      }
      
      const data = await response.json();
      setHistoriales(data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (userRole) {
      fetchHistoriales();
    }
  }, [userRole, pacienteSeleccionado, doctorSeleccionado]);

  // Filtrar por búsqueda
  const historialesFiltrados = historiales.filter((h) => {
    if (!busqueda) return true;
    const searchLower = busqueda.toLowerCase();
    return (
      h.strNombrePaciente.toLowerCase().includes(searchLower) ||
      h.strNombreDoctor.toLowerCase().includes(searchLower) ||
      h.strDiagnostico?.toLowerCase().includes(searchLower) ||
      h.strMotivo.toLowerCase().includes(searchLower)
    );
  });

  //console.log("Historiales obtenidos:", historiales);

  // Toggle expand/collapse
  const toggleExpanded = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Ver detalle completo
  const verDetalle = (consulta: HistorialConsulta) => {
    setConsultaSeleccionada(consulta);
    setModalDetalle(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-6">
          <FileText className="w-8 h-8 text-blue-600" />
          Historial Médico
        </h1>

        {/* Filtros */}
        <div className="bg-white p-4 rounded-xl border-2 border-gray-200 shadow-sm mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-700">Filtros</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Búsqueda */}
            <div>
              <Label className="text-sm font-semibold text-gray-700">Búsqueda</Label>
              <div className="relative mt-1.5">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar paciente, doctor, diagnóstico..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filtro por Paciente */}
            <div>
              <Label className="text-sm font-semibold text-gray-700">Paciente</Label>
              <select
                value={pacienteSeleccionado}
                onChange={(e) => setPacienteSeleccionado(e.target.value)}
                className="mt-1.5 w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-pointer text-gray-700 font-medium"
              >
                <option value="todos" className="font-semibold py-3">
                  Todos los pacientes
                </option>
                {pacientes.map((p) => (
                  <option key={p.intPaciente} value={p.intPaciente.toString()} className="py-3">
                    {p.strNombreCompleto}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por Doctor (solo para admin/recepción) */}
            {(userRole === "SuperAdmin" || userRole === "Recepcion") && (
              <div>
                <Label className="text-sm font-semibold text-gray-700">Doctor</Label>
                <select
                  value={doctorSeleccionado}
                  onChange={(e) => setDoctorSeleccionado(e.target.value)}
                  className="mt-1.5 w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-pointer text-gray-700 font-medium"
                >
                  <option value="todos" className="font-semibold py-3">
                    Todos los doctores
                  </option>
                  {doctores.map((d) => (
                    <option key={d.intDoctor} value={d.intDoctor.toString()} className="py-3">
                      {d.strNombreCompleto}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Contador */}
        <div className="flex items-center gap-2 text-gray-600">
          <Activity className="w-5 h-5" />
          <span className="font-medium">
            {historialesFiltrados.length} consulta{historialesFiltrados.length !== 1 ? "s" : ""} encontrada{historialesFiltrados.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Lista de Historiales */}
      <div className="space-y-4">
        {cargando ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        ) : historialesFiltrados.length > 0 ? (
          historialesFiltrados.map((consulta) => {
            const isExpanded = expandedIds.includes(consulta.intCita);
            
            return (
              <div
                key={consulta.intCita}
                className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Header de la consulta */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <User className="w-5 h-5 text-blue-600" />
                      <h3 className="text-xl font-bold text-gray-800">
                        {consulta.strNombrePaciente}
                      </h3>
                      <span className="text-sm text-gray-500">
                        ({consulta.intEdad} años, {consulta.strGenero})
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(consulta.datFecha).toLocaleDateString("es-MX")}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {consulta.intHora}
                      </div>
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4" />
                        Dr. {consulta.strNombreDoctor}
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        {consulta.strNombreEspecialidad}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => verDetalle(consulta)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Detalle
                  </Button>
                </div>

                {/* Motivo de consulta */}
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mb-3">
                  <p className="text-xs font-semibold text-blue-700 mb-1">Motivo de consulta:</p>
                  <p className="text-sm text-gray-800">{consulta.strMotivo}</p>
                </div>

                {/* Vista previa del diagnóstico */}
                {consulta.strDiagnostico && (
                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 mb-3">
                    <p className="text-xs font-semibold text-purple-700 mb-1">Diagnóstico:</p>
                    <p className="text-sm text-gray-800 line-clamp-2">{consulta.strDiagnostico}</p>
                  </div>
                )}

                {/* Botón expandir/colapsar */}
                <button
                  onClick={() => toggleExpanded(consulta.intCita)}
                  className="w-full flex items-center justify-center gap-2 py-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Ver menos
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Ver más información
                    </>
                  )}
                </button>

                {/* Contenido expandido */}
                {isExpanded && (
                  <div className="mt-4 space-y-3 pt-4 border-t">
                    {/* Signos Vitales */}
                    {consulta.strSignosVitales && (
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <p className="text-xs font-semibold text-green-700 mb-1 flex items-center gap-2">
                          <Activity className="w-4 h-4" />
                          Signos Vitales:
                        </p>
                        <p className="text-sm text-gray-800">{consulta.strSignosVitales}</p>
                      </div>
                    )}

                    {/* Notas de Consulta */}
                    {consulta.strNotasConsulta && (
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <p className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-2">
                          <ClipboardList className="w-4 h-4" />
                          Notas de Consulta:
                        </p>
                        <p className="text-sm text-gray-800 whitespace-pre-wrap">{consulta.strNotasConsulta}</p>
                      </div>
                    )}

                    {/* Receta */}
                    {consulta.strTratamiento && (
                      <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                        <p className="text-xs font-semibold text-orange-700 mb-1 flex items-center gap-2">
                          <Pill className="w-4 h-4" />
                          Tratamiento / Receta:
                        </p>
                        <p className="text-sm text-gray-800 whitespace-pre-wrap">{consulta.strTratamiento}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-xl font-semibold text-gray-600">No se encontraron consultas</p>
            <p className="text-gray-500 mt-2">Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
      </div>

      {/* Modal de Detalle Completo */}
      <Dialog open={modalDetalle} onOpenChange={setModalDetalle}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              Detalle de Consulta
            </DialogTitle>
          </DialogHeader>

          {consultaSeleccionada && (
            <div className="space-y-4">
              {/* Información del Paciente */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Información del Paciente
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium">Nombre:</span> {consultaSeleccionada.strNombrePaciente}
                  </div>
                  <div>
                    <span className="font-medium">Edad:</span> {consultaSeleccionada.intEdad} años
                  </div>
                  <div>
                    <span className="font-medium">Género:</span> {consultaSeleccionada.strGenero}
                  </div>
                  <div>
                    <span className="font-medium">Teléfono:</span> {consultaSeleccionada.strTelefonoPaciente}
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Correo:</span> {consultaSeleccionada.strCorreoPaciente}
                  </div>
                </div>
              </div>

              {/* Información de la Consulta */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-bold text-lg mb-3">Información de la Consulta</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium">Fecha:</span> {new Date(consultaSeleccionada.datFecha).toLocaleDateString("es-MX")}
                  </div>
                  <div>
                    <span className="font-medium">Hora:</span> {consultaSeleccionada.intHora}
                  </div>
                  <div>
                    <span className="font-medium">Doctor:</span> Dr. {consultaSeleccionada.strNombreDoctor}
                  </div>
                  <div>
                    <span className="font-medium">Especialidad:</span> {consultaSeleccionada.strNombreEspecialidad}
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Folio:</span> {consultaSeleccionada.strFolio}
                  </div>
                </div>
              </div>

              {/* Motivo */}
              <div>
                <Label className="font-bold">Motivo de Consulta</Label>
                <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-gray-800">{consultaSeleccionada.strMotivo}</p>
                </div>
              </div>

              {/* Signos Vitales */}
              {consultaSeleccionada && (
                <div>
                  <Label className="font-bold flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Signos Vitales
                  </Label>
                  <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-black-800 font-bold">Peso: <span className="text-black-800">{consultaSeleccionada.dblPeso}</span> kg</p>
                    <p className="text-black-800 font-bold">Talla: <span className="text-black-800">{consultaSeleccionada.dblTalla}</span> cm</p>
                    <p className="text-black-800 font-bold">Temperatura: <span className="text-black-800">{consultaSeleccionada.dblTemperatura}</span> °C</p>
                  
                  </div>
                </div>
              )}

              {/* Notas de Consulta */}
              {consultaSeleccionada.strNotasConsulta && (
                <div>
                  <Label className="font-bold flex items-center gap-2">
                    <ClipboardList className="w-4 h-4" />
                    Notas de Consulta
                  </Label>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-800 whitespace-pre-wrap">{consultaSeleccionada.strNotasConsulta}</p>
                  </div>
                </div>
              )}

              {/* Diagnóstico */}
              {consultaSeleccionada.strDiagnostico && (
                <div>
                  <Label className="font-bold">Diagnóstico</Label>
                  <div className="mt-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-gray-800 whitespace-pre-wrap">{consultaSeleccionada.strDiagnostico}</p>
                  </div>
                </div>
              )}

              {/* Receta */}
              {consultaSeleccionada.strTratamiento && (
                <div>
                  <Label className="font-bold flex items-center gap-2">
                    <Pill className="w-4 h-4" />
                    Tratamiento / Receta
                  </Label>
                  <div className="mt-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-gray-800 whitespace-pre-wrap">{consultaSeleccionada.strTratamiento}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button onClick={() => setModalDetalle(false)}>
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
