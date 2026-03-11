"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs/tabs";


interface Cita {
  intCita: number;
  intPaciente?: number;
  intDoctor?: number;
  strNombrePaciente: string;
  strTelefonoPaciente: string;
  strCorreoPaciente: string;
  strNombreDoctor: string;
  strNombreEspecialidad: string;
  datFecha: string;
  intHora: string;
  strMotivo: string;
   strEstatuscita: string;
  intEdad: number;
  strGenero: string;
}

interface ConsultaData {
  intCita: number;
  strMotivoConsulta: string;
  strPadecimientoActual: string;
  strExploracionFisica: string;
  strNotasConsulta: string;
  strDiagnostico: string;
  strTratamiento: string;
  strIndicaciones: string;
  strPronostico: string;
}

interface SignosVitalesData {
  dblPeso: string;
  dblTalla: string;
  dblIMC: string;
  strPresionArterial: string;
  intFrecuenciaCardiaca: string;
  intFrecuenciaRespiratoria: string;
  dblTemperatura: string;
  dblGlucosa: string;
  dblSaturacionOxigeno: string;
}

interface Especialidad {
  intEspecialidad: number;
  strNombreEspecialidad: string;
}

interface Doctor {
  intDoctor: number;
  strNombre: string;
  strApellidos: string;
}

export default function AgendaPage() {
  const { data: session } = useSession();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [cargando, setCargando] = useState(true);
  const [modalConsulta, setModalConsulta] = useState(false);
  const [citaActual, setCitaActual] = useState<Cita | null>(null);
  const [consultaData, setConsultaData] = useState<ConsultaData>({
    intCita: 0,
    strMotivoConsulta: "",
    strPadecimientoActual: "",
    strExploracionFisica: "",
    strNotasConsulta: "",
    strDiagnostico: "",
    strTratamiento: "",
    strIndicaciones: "",
    strPronostico: ""
  });
  const [signosVitalesData, setSignosVitalesData] = useState<SignosVitalesData>({
    dblPeso: "",
    dblTalla: "",
    dblIMC: "",
    strPresionArterial: "",
    intFrecuenciaCardiaca: "",
    intFrecuenciaRespiratoria: "",
    dblTemperatura: "",
    dblGlucosa: "",
    dblSaturacionOxigeno: ""
  });
  const [tabActual, setTabActual] = useState("consulta");

  // Estados para filtros de admin/recepción
  const [rol, setRol] = useState<string>("");
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [doctores, setDoctores] = useState<Doctor[]>([]);
  const [especialidadSeleccionada, setEspecialidadSeleccionada] = useState<string>("todos");
  const [doctorSeleccionado, setDoctorSeleccionado] = useState<string>("todos");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);


  // Obtener rol del usuario
 useEffect(() => {
    if (session?.user?.rol) {
      setUserRole(session.user.rol);
      //console.log("Rol del usuario:", session.user.rol);
    } else {
      const roleMatch = document.cookie.match(/(^| )role=([^;]+)/);
      const role = roleMatch?.[2];
      if (role) {
        setUserRole(role);
      } else {
        console.warn("No se encontró cookie 'role'");
      }
    }

    // Obtener el nombre del usuario
    if (session?.user?.username) {
      setUserName(session.user.username);
    } else {
      const usernameMatch = document.cookie.match(/(^| )username=([^;]+)/);
      const cookieUsername = usernameMatch?.[2];
      if (cookieUsername) {
        setUserName(decodeURIComponent(cookieUsername));
      }
    }
    
  }, [session]);


  // Cargar especialidades
  useEffect(() => {
  const fetchEspecialidades = async () => {
    try {
      const response = await fetch("/api/citas?tipo=especialidades");
      if (!response.ok) throw new Error("Error al cargar especialidades");
      const data = await response.json();
      setEspecialidades(data[0] || []);
    } catch (error) {
      console.error("Error:", error);
    }
  };
    fetchEspecialidades();
    }, []);

  // Cargar doctores por especialidad
  const fetchDoctores = async (idEspecialidad: string) => {
    try {
      const response = await fetch(`/api/citas?tipo=doctores&intEspecialidad=${idEspecialidad}`);
      if (!response.ok) throw new Error("Error al cargar doctores");
      const data = await response.json();
      setDoctores(data || []);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Cargar citas
  const fetchCitas = async () => {
    setCargando(true);
    try {
      let url = "/api/agenda";
      //console.log("Sesión en cliente:", session);
      console.log("Doctor seleccionado:", doctorSeleccionado);
      
      // Si hay un doctor seleccionado y no es "todos", agregarlo al filtro
      if (doctorSeleccionado && doctorSeleccionado !== "todos") {
        url += `?idDoctor=${doctorSeleccionado}`;
      }

      const response = await fetch(url);
      
      //console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error del servidor:", errorData);
        throw new Error("Error al cargar citas");
      }
      
      const data = await response.json();
      setCitas(data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setCargando(false);
    }
  };

   // Cargar citas
  const fetchCitasDoctor = async () => {
    setCargando(true);
    try {
      let url = "/api/agenda";
      

      const response = await fetch(url);
      
      //console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error del servidor:", errorData);
        throw new Error("Error al cargar citas");
      }
      
      const data = await response.json();
      setCitas(data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    console.log("Rol del usuario en useEffect para cargar citas:", userRole);
    if (userRole === "SuperAdmin" || userRole === "Recepcion") {
      fetchCitas();
    } else if (userRole === "Doctor") {
      fetchCitasDoctor();
    }
    //console.log("Rol del usuario en useEffect:", userRole);
  }, [userRole, doctorSeleccionado]);

  // Filtrar citas por fecha seleccionada
  const citasDia = citas.filter((cita) => {
    const fechaCita = new Date(cita.datFecha);
    const esMismaFecha = 
      fechaCita.getDate() === fechaSeleccionada.getDate() &&
      fechaCita.getMonth() === fechaSeleccionada.getMonth() &&
      fechaCita.getFullYear() === fechaSeleccionada.getFullYear();
    
    if (filtroEstado === "todos") return esMismaFecha;
    return esMismaFecha && cita. strEstatuscita === filtroEstado;
  }).sort((a, b) => a.intHora.localeCompare(b.intHora));

  // Cambiar fecha
  const cambiarDia = (dias: number) => {
    const nuevaFecha = new Date(fechaSeleccionada);
    nuevaFecha.setDate(nuevaFecha.getDate() + dias);
    setFechaSeleccionada(nuevaFecha);
  };

  //console.log("Citas del día:", citasDia);

  const irHoy = () => {
    setFechaSeleccionada(new Date());
  };

  // Cambiar estado de cita
  const cambiarEstado = async (intCita: number, nuevoEstado: string) => {
    try {
      const response = await fetch("/api/agenda", {
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
      strMotivoConsulta: cita.strMotivo || "",
      strPadecimientoActual: "",
      strExploracionFisica: "",
      strNotasConsulta: "",
      strDiagnostico: "",
      strTratamiento: "",
      strIndicaciones: "",
      strPronostico: ""
    });
    setSignosVitalesData({
      dblPeso: "",
      dblTalla: "",
      dblIMC: "",
      strPresionArterial: "",
      intFrecuenciaCardiaca: "",
      intFrecuenciaRespiratoria: "",
      dblTemperatura: "",
      dblGlucosa: "",
      dblSaturacionOxigeno: ""
    });
    setTabActual("consulta");
    cambiarEstado(cita.intCita, "EN CONSULTA");
    setModalConsulta(true);
  };

  // Calcular IMC automáticamente
  const calcularIMC = (peso: string, talla: string) => {
    const pesoNum = parseFloat(peso);
    const tallaNum = parseFloat(talla);
    if (pesoNum > 0 && tallaNum > 0) {
      const imc = pesoNum / (tallaNum * tallaNum);
      return imc.toFixed(2);
    }
    return "";
  };

  // Finalizar consulta
  const finalizarConsulta = async () => {
    try {
      if (!citaActual) return;

      // Guardar la consulta y signos vitales
      const response = await fetch("/api/consultas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intPaciente: citaActual.intPaciente,
          intDoctor: citaActual.intDoctor,
          intCita: citaActual.intCita,
          consulta: consultaData,
          signosVitales: signosVitalesData
        })
      });

      if (!response.ok) {
        throw new Error("Error al guardar la consulta");
      }

      const data = await response.json();
      
      if (data.success) {
        // Cambiar estado de la cita
        await cambiarEstado(consultaData.intCita, "FINALIZADA");
        setModalConsulta(false);
        setCitaActual(null);
        alert("Consulta finalizada y guardada exitosamente");
      } else {
        alert(data.message || "Error al guardar la consulta");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al finalizar la consulta");
    }
  };

  // Estadísticas del día
  const estadisticas = {
    total: citasDia.length,
    pendientes: citasDia.filter(c => c.strEstatuscita === "PENDIENTE").length,
    enEspera: citasDia.filter(c => c.strEstatuscita === "EN ESPERA").length,
    enConsulta: citasDia.filter(c => c.strEstatuscita === "EN CONSULTA").length,
    finalizadas: citasDia.filter(c => c.strEstatuscita === "FINALIZADA").length,
    canceladas: citasDia.filter(c => c.strEstatuscita === "CANCELADA").length,
  };

  // Obtener próxima cita
  const horaActual = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false });
  const proximaCita = citasDia.find(cita => 
    cita.intHora > horaActual && 
    (cita.strEstatuscita === "CONFIRMADA" || cita.strEstatuscita === "PENDIENTE" || cita.strEstatuscita === "EN ESPERA")
  );

  //console.log("Próxima cita:", proximaCita);

  // Función para obtener el color según el estado
  const getEstadoColor = (estado: string) => {
    //console.log("Obteniendo color para estado:", estado);
    switch (estado) {
      case "PENDIENTE":
        return { bg: "bg-yellow-50", border: "border-yellow-300", text: "text-yellow-700", icon: Circle };
      case "CONFIRMADA":
        return { bg: "bg-blue-50", border: "border-blue-300", text: "text-blue-700", icon: PlayCircle };
      case "EN ESPERA":
        return { bg: "bg-orange-50", border: "border-orange-300", text: "text-orange-700", icon: UserCheck };
      case "EN CONSULTA":
        return { bg: "bg-purple-50", border: "border-purple-300", text: "text-purple-700", icon: Stethoscope };
      case "FINALIZADA":
        return { bg: "bg-green-50", border: "border-green-300", text: "text-green-700", icon: CheckCircle2 };
      case "CANCELADA":
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

        {/* Filtros para Admin/Recepción */}
        {(userRole === "SuperAdmin" || userRole === "Recepcion") && (
          <div className="mb-4 grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border">
            <div>
              <Label className="text-sm font-semibold text-gray-700">Especialidad</Label>
              <select
                value={especialidadSeleccionada}
                onChange={(e) => {
                  const value = e.target.value; 
                  setEspecialidadSeleccionada(value);
                  setDoctorSeleccionado("todos");
                
                  setDoctores([]);
                  if (value && value !== "todos") {
                    fetchDoctores(value);
                  }
                }}
                className="mt-1.5 w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-pointer text-gray-700 font-medium"
              >
                <option value="todos" className="font-semibold py-3">
                  Todas las especialidades
                </option>
                {especialidades.map((esp) => (
                    <option 
                      key={esp.intEspecialidad} 
                      value={esp.intEspecialidad.toString()}
                      className="py-3"
                    >
                        {esp.strNombreEspecialidad}
                    </option>
                ))}
                
             
              </select>
            </div>

            <div>
              <Label className="text-sm font-semibold text-gray-700">Doctor</Label>
              <select
                value={doctorSeleccionado}
                onChange={(e) => setDoctorSeleccionado(e.target.value) }
                disabled={!especialidadSeleccionada || especialidadSeleccionada === "todos"}
                className="mt-1.5 w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-pointer text-gray-700 font-medium disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-200 disabled:hover:border-gray-200 disabled:hover:shadow-sm"
              >
                <option value="todos" className="font-semibold py-3">
                  Todos los doctores
                </option>
                {doctores.map((doc) => (
                    <option 
                      key={doc.intDoctor} 
                      value={doc.intDoctor.toString()}
                      className="py-3"
                    >
                        {doc.strNombre} {doc.strApellidos}
                    </option>   
                ))}
              </select>
            </div>
          </div>
        )}

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
        <div 
          onClick={() => setFiltroEstado("todos")}
          className={`bg-white p-3 rounded-xl border-2 shadow-sm cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200 ${
            filtroEstado === "todos" ? "border-gray-500 ring-2 ring-gray-400" : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 font-semibold">Total</p>
              <p className="text-2xl font-bold">{estadisticas.total}</p>
            </div>
            <Activity className="w-6 h-6 text-gray-500" />
          </div>
        </div>
        
        <div 
          onClick={() => setFiltroEstado("PENDIENTE")}
          className={`bg-yellow-50 p-3 rounded-xl border-2 shadow-sm cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200 ${
            filtroEstado === "PENDIENTE" ? "border-yellow-500 ring-2 ring-yellow-400" : "border-yellow-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-yellow-700 font-semibold">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-700">{estadisticas.pendientes}</p>
            </div>
            <Circle className="w-6 h-6 text-yellow-600" />
          </div>
        </div>

        <div 
          onClick={() => setFiltroEstado("EN ESPERA")}
          className={`bg-orange-50 p-3 rounded-xl border-2 shadow-sm cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200 ${
            filtroEstado === "EN ESPERA" ? "border-orange-500 ring-2 ring-orange-400" : "border-orange-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-orange-700 font-semibold">En Espera</p>
              <p className="text-2xl font-bold text-orange-700">{estadisticas.enEspera}</p>
            </div>
            <UserCheck className="w-6 h-6 text-orange-600" />
          </div>
        </div>

        <div 
          onClick={() => setFiltroEstado("EN CONSULTA")}
          className={`bg-purple-50 p-3 rounded-xl border-2 shadow-sm cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200 ${
            filtroEstado === "EN CONSULTA" ? "border-purple-500 ring-2 ring-purple-400" : "border-purple-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-purple-700 font-semibold">En Consulta</p>
              <p className="text-2xl font-bold text-purple-700">{estadisticas.enConsulta}</p>
            </div>
            <Stethoscope className="w-6 h-6 text-purple-600" />
          </div>
        </div>

        <div 
          onClick={() => setFiltroEstado("FINALIZADA")}
          className={`bg-green-50 p-3 rounded-xl border-2 shadow-sm cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200 ${
            filtroEstado === "FINALIZADA" ? "border-green-500 ring-2 ring-green-400" : "border-green-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-700 font-semibold">Finalizadas</p>
              <p className="text-2xl font-bold text-green-700">{estadisticas.finalizadas}</p>
            </div>
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
        </div>

        <div 
          onClick={() => setFiltroEstado("CANCELADA")}
          className={`bg-red-50 p-3 rounded-xl border-2 shadow-sm cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200 ${
            filtroEstado === "CANCELADA" ? "border-red-500 ring-2 ring-red-400" : "border-red-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-red-700 font-semibold">Canceladas</p>
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

      {/* Timeline de citas */}
      <div className="space-y-4">
        {cargando ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        ) : citasDia.length > 0 ? (
          citasDia.map((cita) => {
            const estadoColor = getEstadoColor(cita.strEstatuscita);
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
                        {cita.strEstatuscita}
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
                      {(cita. strEstatuscita  === "PENDIENTE" || cita. strEstatuscita  === "CONFIRMADA") && (
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

                      {cita. strEstatuscita  === "EN ESPERA" && (
                        <Button
                          size="sm"
                          onClick={() => iniciarConsulta(cita)}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          <Stethoscope className="w-4 h-4 mr-2" />
                          INICIAR CONSULTA
                        </Button>
                      )}

                      {cita. strEstatuscita  === "EN CONSULTA" && (
                        <Button
                          size="sm"
                        onClick={() => iniciarConsulta(cita)}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          <Stethoscope className="w-4 h-4 mr-2" />
                          Continuar Consulta
                        </Button>
                      )}

                      {(cita. strEstatuscita  === "PENDIENTE" || 
                        cita. strEstatuscita  === "CONFIRMADA" || 
                        cita. strEstatuscita  === "EN ESPERA") && (
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
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
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

              {/* Tabs para Datos de Consulta y Signos Vitales */}
              <Tabs value={tabActual} onValueChange={setTabActual} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="consulta">
                    <FileText className="w-4 h-4 mr-2" />
                    Datos de Consulta
                  </TabsTrigger>
                  <TabsTrigger value="signos">
                    <Activity className="w-4 h-4 mr-2" />
                    Signos Vitales
                  </TabsTrigger>
                </TabsList>

                {/* Tab Datos de Consulta */}
                <TabsContent value="consulta" className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="motivo">Motivo de Consulta</Label>
                    <Input
                      id="motivo"
                      placeholder="Motivo de la consulta..."
                      value={consultaData.strMotivoConsulta}
                      onChange={(e) => setConsultaData({...consultaData, strMotivoConsulta: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="padecimiento">Padecimiento Actual</Label>
                    <Textarea
                      id="padecimiento"
                      rows={3}
                      placeholder="Describe el padecimiento actual del paciente..."
                      value={consultaData.strPadecimientoActual}
                      onChange={(e) => setConsultaData({...consultaData, strPadecimientoActual: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="exploracion">Exploración Física</Label>
                    <Textarea
                      id="exploracion"
                      rows={3}
                      placeholder="Resultados de la exploración física..."
                      value={consultaData.strExploracionFisica}
                      onChange={(e) => setConsultaData({...consultaData, strExploracionFisica: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="notas">Notas de la Consulta</Label>
                    <Textarea
                      id="notas"
                      rows={3}
                      placeholder="Notas adicionales, observaciones..."
                      value={consultaData.strNotasConsulta}
                      onChange={(e) => setConsultaData({...consultaData, strNotasConsulta: e.target.value})}
                    />
                  </div>

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

                  <div>
                    <Label htmlFor="tratamiento">Tratamiento / Receta</Label>
                    <Textarea
                      id="tratamiento"
                      rows={3}
                      placeholder="Medicamentos, dosis, frecuencia, duración..."
                      value={consultaData.strTratamiento}
                      onChange={(e) => setConsultaData({...consultaData, strTratamiento: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="indicaciones">Indicaciones</Label>
                    <Textarea
                      id="indicaciones"
                      rows={2}
                      placeholder="Indicaciones para el paciente..."
                      value={consultaData.strIndicaciones}
                      onChange={(e) => setConsultaData({...consultaData, strIndicaciones: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="pronostico">Pronóstico</Label>
                    <Textarea
                      id="pronostico"
                      rows={2}
                      placeholder="Pronóstico del paciente..."
                      value={consultaData.strPronostico}
                      onChange={(e) => setConsultaData({...consultaData, strPronostico: e.target.value})}
                    />
                  </div>
                </TabsContent>

                {/* Tab Signos Vitales */}
                <TabsContent value="signos" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="peso">Peso (kg)</Label>
                      <Input
                        id="peso"
                        type="number"
                        step="0.01"
                        placeholder="70.5"
                        value={signosVitalesData.dblPeso}
                        onChange={(e) => {
                          const peso = e.target.value;
                          setSignosVitalesData({
                            ...signosVitalesData, 
                            dblPeso: peso,
                            dblIMC: calcularIMC(peso, signosVitalesData.dblTalla)
                          });
                        }}
                      />
                    </div>

                    <div>
                      <Label htmlFor="talla">Talla (m)</Label>
                      <Input
                        id="talla"
                        type="number"
                        step="0.01"
                        placeholder="1.75"
                        value={signosVitalesData.dblTalla}
                        onChange={(e) => {
                          const talla = e.target.value;
                          setSignosVitalesData({
                            ...signosVitalesData, 
                            dblTalla: talla,
                            dblIMC: calcularIMC(signosVitalesData.dblPeso, talla)
                          });
                        }}
                      />
                    </div>

                    {/* <div>
                      <Label htmlFor="imc">IMC (kg/m²)</Label>
                      <Input
                        id="imc"
                        type="number"
                        step="0.01"
                        placeholder="Calculado automáticamente"
                        value={signosVitalesData.dblIMC}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div> */}

                    {/* <div>
                      <Label htmlFor="presion">Presión Arterial</Label>
                      <Input
                        id="presion"
                        placeholder="120/80"
                        value={signosVitalesData.strPresionArterial}
                        onChange={(e) => setSignosVitalesData({...signosVitalesData, strPresionArterial: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="fc">Frecuencia Cardíaca (lpm)</Label>
                      <Input
                        id="fc"
                        type="number"
                        placeholder="72"
                        value={signosVitalesData.intFrecuenciaCardiaca}
                        onChange={(e) => setSignosVitalesData({...signosVitalesData, intFrecuenciaCardiaca: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="fr">Frecuencia Respiratoria (rpm)</Label>
                      <Input
                        id="fr"
                        type="number"
                        placeholder="18"
                        value={signosVitalesData.intFrecuenciaRespiratoria}
                        onChange={(e) => setSignosVitalesData({...signosVitalesData, intFrecuenciaRespiratoria: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="temperatura">Temperatura (°C)</Label>
                      <Input
                        id="temperatura"
                        type="number"
                        step="0.1"
                        placeholder="36.5"
                        value={signosVitalesData.dblTemperatura}
                        onChange={(e) => setSignosVitalesData({...signosVitalesData, dblTemperatura: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="glucosa">Glucosa (mg/dL)</Label>
                      <Input
                        id="glucosa"
                        type="number"
                        step="0.1"
                        placeholder="100"
                        value={signosVitalesData.dblGlucosa}
                        onChange={(e) => setSignosVitalesData({...signosVitalesData, dblGlucosa: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="saturacion">Saturación de O₂ (%)</Label>
                      <Input
                        id="saturacion"
                        type="number"
                        step="0.1"
                        placeholder="98"
                        value={signosVitalesData.dblSaturacionOxigeno}
                        onChange={(e) => setSignosVitalesData({...signosVitalesData, dblSaturacionOxigeno: e.target.value})}
                      />
                    </div> */}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Botones */}
              <div className="flex gap-3 justify-end pt-4 border-t">
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
