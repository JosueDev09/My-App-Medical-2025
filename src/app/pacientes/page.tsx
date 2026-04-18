"use client";
import { useState, useEffect } from "react";
import { Paciente } from "@/types/pacientes";   
import formatearFechaLarga  from "@/lib/formatterFecha";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs/tabs";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { Badge } from "@/components/ui/badge/badge";
import { 
  Pencil, 
  Trash2,
  User,
  Calendar,
  Stethoscope,
  Eye,
  Clock,
  Activity,
  Mail,
  PhoneCallIcon,
  MapPinHouseIcon,
  CalendarFoldIcon,
  Heart,
  Pill,
  FileText,
  FolderOpen,
  Search,
  Filter,
  UserPlus,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { useRouter } from "next/navigation";


export default function PacientesPage() {
  const router = useRouter();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pacientesFiltrados, setPacientesFiltrados] = useState<Paciente[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<any>(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<"TODOS" | "ACTIVO" | "INACTIVO">("TODOS");
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPacientes, setTotalPacientes] = useState(0);
  const [cargando, setCargando] = useState(false);
  const itemsPorPagina = 12;
  
  /* ---------- Cargar pacientes con paginación ---------- */
  useEffect(() => {
    async function fetchPacientes() {
      setCargando(true);
      try {
        // Si hay búsqueda o filtro, cargar todos los pacientes
        const usarPaginacion = !busqueda && filtroEstado === "TODOS";
        
        let url = "/api/pacientes";
        if (usarPaginacion) {
          const offset = (paginaActual - 1) * itemsPorPagina;
          url = `/api/pacientes?limit=${itemsPorPagina}&offset=${offset}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");
        const data: { data: Paciente[]; total: number } = await response.json();
        
        setPacientes(data.data);
        setTotalPacientes(data.total);
        
        // Aplicar filtros locales si hay búsqueda o filtro de estado
        if (busqueda || filtroEstado !== "TODOS") {
          let resultado = data.data;
          
          // Filtrar por búsqueda
          if (busqueda.trim()) {
            resultado = resultado.filter(p => 
              p.strNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
              p.strEmail?.toLowerCase().includes(busqueda.toLowerCase()) ||
              p.strTelefono?.includes(busqueda)
            );
          }

          // Filtrar por estado
          if (filtroEstado !== "TODOS") {
            resultado = resultado.filter(p => p.strEstado === filtroEstado);
          }
          
          setPacientesFiltrados(resultado);
        } else {
          setPacientesFiltrados(data.data);
        }
      } catch (error) {
        console.error("Error al obtener los pacientes:", error);
      } finally {
        setCargando(false);
      }
    }
    fetchPacientes();
  }, [paginaActual, busqueda, filtroEstado]);

  // Resetear a página 1 cuando cambian los filtros
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroEstado]);

  /* ---------- Cargar detalle del paciente ---------- */
  const handleVerDetalle = async (idPaciente: string | number) => {
    setCargandoDetalle(true);
    setModalOpen(true);
    
    try {
      const response = await fetch(`/api/pacientes?tipo=detalle&id=${idPaciente}`);
      if (!response.ok) throw new Error("Error al obtener detalle del paciente");
      const data = await response.json();
      setPacienteSeleccionado(data.data);
    } catch (error) {
      console.error("Error al obtener detalle del paciente:", error);
    } finally {
      setCargandoDetalle(false);
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

  const obtenerIniciales = (nombre: string): string => {
    const palabras = nombre.trim().split(' ');
    if (palabras.length >= 2) {
      return `${palabras[0].charAt(0)}${palabras[1].charAt(0)}`.toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
  };

  const obtenerColorAvatar = (index: number): string => {
    const colores = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-red-500",
      "bg-yellow-500",
      "bg-teal-500"
    ];
    return colores[index % colores.length];
  };

return (
  <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pacientes</h1>
          <p className="text-gray-600 mt-1">
            Total: {totalPacientes} pacientes registrados
          </p>
        </div>
        <Button 
          onClick={() => router.push("/pacientes/nuevo")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <UserPlus className="w-5 h-5" />
          Nuevo Paciente
        </Button>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Buscar por nombre, email, teléfono o CURP..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          {/* Filtros de estado */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={filtroEstado === "TODOS" ? "default" : "outline"}
                onClick={() => setFiltroEstado("TODOS")}
              >
                Todos
              </Button>
              <Button
                size="sm"
                variant={filtroEstado === "ACTIVO" ? "default" : "outline"}
                onClick={() => setFiltroEstado("ACTIVO")}
                className={filtroEstado === "ACTIVO" ? "bg-green-600 hover:bg-green-700" : ""}
              >
                Activos
              </Button>
              <Button
                size="sm"
                variant={filtroEstado === "INACTIVO" ? "default" : "outline"}
                onClick={() => setFiltroEstado("INACTIVO")}
                className={filtroEstado === "INACTIVO" ? "bg-gray-600 hover:bg-gray-700" : ""}
              >
                Inactivos
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de pacientes - Vista de tarjetas */}
      {cargando ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando pacientes...</p>
          </div>
        </div>
      ) : pacientesFiltrados.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {busqueda || filtroEstado !== "TODOS" ? "No se encontraron pacientes" : "No hay pacientes registrados"}
          </h3>
          <p className="text-gray-600 mb-4">
            {busqueda || filtroEstado !== "TODOS" 
              ? "Intenta con otros términos de búsqueda o filtros"
              : "Comienza agregando tu primer paciente"
            }
          </p>
          {!busqueda && filtroEstado === "TODOS" && (
            <Button 
              onClick={() => router.push("/pacientes/nuevo")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Agregar Paciente
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Indicador de resultados filtrados */}
          {(busqueda || filtroEstado !== "TODOS") && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">{pacientesFiltrados.length}</span> resultado{pacientesFiltrados.length !== 1 ? 's' : ''} encontrado{pacientesFiltrados.length !== 1 ? 's' : ''}
                {busqueda && ` para "${busqueda}"`}
                {filtroEstado !== "TODOS" && ` con estado ${filtroEstado}`}
              </p>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setBusqueda("");
                  setFiltroEstado("TODOS");
                }}
                className="text-blue-700 hover:text-blue-900 hover:bg-blue-100"
              >
                Limpiar filtros
              </Button>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pacientesFiltrados.map((paciente, index) => (
            <div
              key={`paciente-${paciente.intPaciente}`}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-blue-300 group"
            >
              {/* Card Header */}
              <div className="p-5">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-14 h-14 rounded-full ${obtenerColorAvatar(index)} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                    {obtenerIniciales(paciente.strNombre)}
                  </div>

                  {/* Información principal */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                      {paciente.strNombre}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {calcularEdad(paciente.datFechaNacimiento)} años • {paciente.strSexo}
                    </p>
                    <div className="mt-2">
                      <Badge 
                        className={
                          paciente.strEstado === "ACTIVO" 
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-gray-100 text-gray-800 border-gray-200"
                        }
                      >
                        {paciente.strEstado}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Información de contacto */}
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <PhoneCallIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{paciente.strTelefono}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{paciente.strEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPinHouseIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{paciente.strCiudad}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer - Acciones */}
              <div className="border-t border-gray-100 p-3 bg-gray-50 rounded-b-lg flex items-center justify-between">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => router.push(`/expediente/${paciente.intPaciente}`)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <FolderOpen className="w-4 h-4" />
                  Expediente
                  <ChevronRight className="w-4 h-4" />
                </Button>

                <div className="flex gap-1">
                  <button
                    onClick={() => handleVerDetalle(paciente.intPaciente)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Ver detalles"
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => router.push(`/pacientes/editar/${paciente.intPaciente}`)}
                    className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4 text-blue-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      )}

      {/* Paginación - Solo mostrar cuando no hay filtros activos */}
      {!cargando && 
       !busqueda && 
       filtroEstado === "TODOS" && 
       pacientesFiltrados.length > 0 && 
       totalPacientes > itemsPorPagina && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Mostrando {((paginaActual - 1) * itemsPorPagina) + 1} - {Math.min(paginaActual * itemsPorPagina, totalPacientes)} de {totalPacientes} pacientes
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPaginaActual(prev => Math.max(1, prev - 1))}
                disabled={paginaActual === 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.ceil(totalPacientes / itemsPorPagina) }, (_, i) => i + 1)
                  .filter(page => {
                    // Mostrar solo páginas relevantes (primera, última, actual y adyacentes)
                    const totalPages = Math.ceil(totalPacientes / itemsPorPagina);
                    if (page === 1 || page === totalPages) return true;
                    if (Math.abs(page - paginaActual) <= 1) return true;
                    return false;
                  })
                  .map((page, index, array) => {
                    // Añadir puntos suspensivos si hay saltos
                    const shouldShowEllipsisBefore = index > 0 && page - array[index - 1] > 1;
                    
                    return (
                      <div key={page} className="flex items-center">
                        {shouldShowEllipsisBefore && (
                          <span className="px-2 text-gray-400">...</span>
                        )}
                        <Button
                          size="sm"
                          variant={paginaActual === page ? "default" : "outline"}
                          onClick={() => setPaginaActual(page)}
                          className={`min-w-[2.5rem] ${
                            paginaActual === page 
                              ? "bg-blue-600 hover:bg-blue-700 text-white" 
                              : ""
                          }`}
                        >
                          {page}
                        </Button>
                      </div>
                    );
                  })}
              </div>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPaginaActual(prev => Math.min(Math.ceil(totalPacientes / itemsPorPagina), prev + 1))}
                disabled={paginaActual >= Math.ceil(totalPacientes / itemsPorPagina)}
                className="flex items-center gap-1"
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>

    {/* Modal de detalle del paciente */}
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Información del Paciente
          </DialogTitle>
        </DialogHeader>

        {cargandoDetalle ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        ) : pacienteSeleccionado ? (
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Personal
              </TabsTrigger>
              <TabsTrigger value="medica" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Información Médica
              </TabsTrigger>
              <TabsTrigger value="historial" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Historial de Citas
              </TabsTrigger>
            </TabsList>

            {/* Tab: Información Personal */}
            <TabsContent value="personal" className="space-y-4 mt-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-lg mb-3 text-blue-900 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Datos Personales
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nombre completo</p>
                    <p className="font-semibold">
                      {pacienteSeleccionado.strNombre}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Edad</p>
                    <p className="font-semibold">
                      {calcularEdad(pacienteSeleccionado.datFechaNacimiento)} años
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fecha de nacimiento</p>
                    <p className="font-semibold">
                      {formatearFechaLarga(pacienteSeleccionado.datFechaNacimiento)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Sexo</p>
                    <p className="font-semibold">{pacienteSeleccionado.strSexo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ID Paciente</p>
                    <p className="font-semibold">#{pacienteSeleccionado.intPaciente}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tipo de sangre</p>
                    <p className="font-semibold">{pacienteSeleccionado.strTipoSangre || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-lg mb-3 text-green-900 flex items-center gap-2">
                  <PhoneCallIcon className="w-5 h-5" />
                  Información de Contacto
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Teléfono principal</p>
                    <p className="font-semibold">{pacienteSeleccionado.strTelefono}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Teléfono de emergencia</p>
                    <p className="font-semibold">{pacienteSeleccionado.strTelefonoEmergencia || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Correo electrónico</p>
                    <p className="font-semibold">{pacienteSeleccionado.strEmail}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Dirección</p>
                    <p className="font-semibold">
                      {pacienteSeleccionado.strDireccion}
                      {pacienteSeleccionado.strCiudad && `, ${pacienteSeleccionado.strCiudad}`}
                      {pacienteSeleccionado.strEstado && `, ${pacienteSeleccionado.strEstado}`}
                      {pacienteSeleccionado.strCodigoPostal && ` - CP: ${pacienteSeleccionado.strCodigoPostal}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-lg mb-3 text-purple-900 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Estado de la Cuenta
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Estado</p>
                    <p className={`font-semibold ${
                      pacienteSeleccionado.strEstatus === 'ACTIVO' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {pacienteSeleccionado.strEstatus}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fecha de registro</p>
                    <p className="font-semibold">
                      {formatearFechaLarga(pacienteSeleccionado.datFechaRegistro)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total de citas</p>
                    <p className="font-semibold">{pacienteSeleccionado.totalCitas || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Última cita</p>
                    <p className="font-semibold">
                      {pacienteSeleccionado.ultimaCita 
                        ? formatearFechaLarga(pacienteSeleccionado.ultimaCita)
                        : 'Sin citas registradas'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tab: Información Médica */}
            <TabsContent value="medica" className="space-y-4 mt-4">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h3 className="font-semibold text-lg mb-3 text-red-900 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5" />
                  Historial Médico
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Alergias</p>
                    <div className="bg-white p-3 rounded border">
                      <p className="text-gray-800">
                        {pacienteSeleccionado.strAlergias || 'No se registran alergias'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Enfermedades Crónicas</p>
                    <div className="bg-white p-3 rounded border">
                      <p className="text-gray-800">
                        {pacienteSeleccionado.strEnfermedadesCronicas || 'No se registran enfermedades crónicas'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h3 className="font-semibold text-lg mb-3 text-orange-900 flex items-center gap-2">
                  <Pill className="w-5 h-5" />
                  Medicamentos Actuales
                </h3>
                <div className="bg-white p-3 rounded border">
                  <p className="text-gray-800">
                    {pacienteSeleccionado.strMedicamentosActuales || 'No se registran medicamentos actuales'}
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="font-semibold text-lg mb-3 text-yellow-900 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Información Adicional
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Tipo de sangre</p>
                    <p className="font-semibold text-lg text-red-600">
                      {pacienteSeleccionado.strTipoSangre || 'No especificado'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">CURP</p>
                    <p className="font-semibold">{pacienteSeleccionado.strCurp || 'No registrado'}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tab: Historial de Citas */}
            <TabsContent value="historial" className="space-y-4 mt-4">
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                <h3 className="font-semibold text-lg mb-3 text-indigo-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Historial de Citas
                </h3>
                {pacienteSeleccionado.historialCitas && pacienteSeleccionado.historialCitas.length > 0 ? (
                  <div className="space-y-3">
                    {pacienteSeleccionado.historialCitas.map((cita: any) => (
                      <div 
                        key={cita.intCita} 
                        className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">
                              {cita.strNombreEspecialidad}
                            </p>
                            <p className="text-sm text-gray-600">
                              Dr. {cita.strNombre} {cita.strApellidos}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            cita.strEstatusCita === 'CONFIRMADA' ? 'bg-green-100 text-green-700' :
                            cita.strEstatusCita === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-700' :
                            cita.strEstatusCita === 'CANCELADA' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {cita.strEstatusCita}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatearFechaLarga(cita.datFecha)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {cita.intHora}
                          </div>
                        </div>
                        {cita.strMotivo && (
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Motivo:</span> {cita.strMotivo}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No hay citas registradas para este paciente</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No se pudo cargar la información del paciente
          </div>
        )}
      </DialogContent>
    </Dialog>
  </div>
);
  }
  

  
