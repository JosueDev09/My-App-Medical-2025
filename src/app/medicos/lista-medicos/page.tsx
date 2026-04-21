"use client";
import { useState, useEffect } from "react";
import { Medico } from "@/types/medicos";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input/input";
import { Button } from "@/components/ui/button/button";
import { Badge } from "@/components/ui/badge/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog/dialog";
import { Pencil, Trash2, User, PhoneCallIcon, Mail, MapPinHouseIcon, Search, Filter, Eye, UserPlus, Stethoscope, Clock, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs/tabs";

type MedicoDetalle = Medico & Partial<{
  strLicencia: string;
  strEspecialidadMedico: string;
  strCertificacion: string;
  strNotas: string;
  strHorario: string;
  strHorarioDetalle: string;
  horarioInicio: string;
  horarioFin: string;
  diasDisponibles: string;
}>;
// import formatearFechaLarga from "@/lib/formatterFecha";

export default function MedicosPage() {
  const router = useRouter();
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [medicosFiltrados, setMedicosFiltrados] = useState<Medico[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<"TODOS" | "ACTIVO" | "INACTIVO">("TODOS");
  const [modalOpen, setModalOpen] = useState(false);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [medicoSeleccionado, setMedicoSeleccionado] = useState<Medico | null>(null);

  useEffect(() => {
    async function fetchMedicos() {
      try {
        const res = await fetch("/api/Doctor");
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setMedicos(data.data || []);
        setMedicosFiltrados(data.data || []);
      } catch (error) {
        console.error(error);
      }
    }
    fetchMedicos();
  }, []);

  useEffect(() => {
    if (!busqueda.trim()) return setMedicosFiltrados(medicos);
    const q = busqueda.toLowerCase();
    setMedicosFiltrados(
      medicos.filter((m) =>
        `${m.strNombre} ${m.strApellidos}`.toLowerCase().includes(q) ||
        (m.strEmail || "").toLowerCase().includes(q) ||
        (m.strTelefono || "").includes(q) ||
        (m.strNombreEspecialidad || "").toLowerCase().includes(q)
      )
    );
  }, [busqueda, medicos]);

  const handleAgregarDoctor = () => router.push("/medicos/alta-medicos");

  const handleVerDetalle = async (idMedico: string | number) => {
    setCargandoDetalle(true);
    setModalOpen(true);
    try {
      const res = await fetch(`/api/Doctor?tipo=detalle&id=${idMedico}`);
      if (!res.ok) throw new Error("Error al obtener detalle del medico");
      const data = await res.json();
      setMedicoSeleccionado(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setCargandoDetalle(false);
    }
  };

  const calcularEdad = (fechaNacimiento: string): number => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
    return edad;
  };

  const obtenerIniciales = (nombre = "") => {
    const palabras = nombre.trim().split(" ");
    if (palabras.length >= 2) return `${palabras[0][0]}${palabras[1][0]}`.toUpperCase();
    return nombre.substring(0, 2).toUpperCase();
  };

  const obtenerColorAvatar = (index: number) => {
    const colores = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-red-500",
      "bg-yellow-500",
      "bg-teal-500",
    ];
    return colores[index % colores.length];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Médicos</h1>
            <p className="text-gray-600 mt-1">Total: {medicos.length} médicos</p>
          </div>
          <Button onClick={handleAgregarDoctor} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <UserPlus className="w-4 h-4" />
            Nuevo Médico
          </Button>
        </div>

        {/* Barra de búsqueda y filtros (igual que Pacientes) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar por nombre, email, teléfono o especialidad..."
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

        {medicos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay médicos registrados</h3>
            <p className="text-gray-600 mb-4">Agrega tu primer médico para comenzar</p>
            <Button onClick={handleAgregarDoctor} className="bg-blue-600 hover:bg-blue-700">
              Agregar Médico
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {medicosFiltrados.map((medico, idx) => (
              <div key={medico.intDoctor} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all group">
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-14 h-14 rounded-full ${obtenerColorAvatar(idx)} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                      {obtenerIniciales(medico.strNombre)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{medico.strNombre} {medico.strApellidos}</h3>
                      <p className="text-sm text-gray-600 truncate">{medico.strNombreEspecialidad || 'Sin especialidad'}</p>
                      <div className="mt-2">
                        <Badge className={medico.strEstadoUsuario && medico.strEstadoUsuario.toUpperCase().includes('ACT') ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}>
                          {medico.strEstadoUsuario || 'N/A'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <PhoneCallIcon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{medico.strTelefono || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{medico.strEmail || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPinHouseIcon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{medico.strDireccion || '-'}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 p-3 bg-gray-50 rounded-b-lg flex items-center justify-between">
                  <Button size="sm" variant="ghost" onClick={() => handleVerDetalle(medico.intDoctor)} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    <Eye className="w-4 h-4" />
                    Ver
                  </Button>

                  <div className="flex gap-2">
                    <button title="Editar" onClick={() => router.push(`/medicos/alta-medicos?id=${medico.intDoctor}`)} className="p-2 hover:bg-blue-100 rounded-lg transition-colors">
                      <Pencil className="w-4 h-4 text-blue-600" />
                    </button>
                    <button title="Eliminar" className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Información del Médico</DialogTitle>
            </DialogHeader>

            {cargandoDetalle ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
              </div>
            ) : medicoSeleccionado ? (
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="personal" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Personal
                  </TabsTrigger>
                  <TabsTrigger value="medica" className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4" />
                    Datos Médicos
                  </TabsTrigger>
                  <TabsTrigger value="historial" className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Horarios
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4 mt-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-lg mb-3 text-blue-900 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Datos Personales
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Nombre completo</p>
                        <p className="font-semibold">{medicoSeleccionado.strNombre} {medicoSeleccionado.strApellidos}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Edad</p>
                        <p className="font-semibold">{calcularEdad(medicoSeleccionado.datFechaNacimiento)} años</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Fecha de nacimiento</p>
                        <p className="font-semibold">{medicoSeleccionado.datFechaNacimiento ? new Date(medicoSeleccionado.datFechaNacimiento).toLocaleDateString() : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Género</p>
                        <p className="font-semibold">{medicoSeleccionado.strSexo ? medicoSeleccionado.strSexo.toUpperCase() : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="medica" className="space-y-4 mt-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-lg mb-3 text-green-900 flex items-center gap-2">
                      <Stethoscope className="w-5 h-5" />
                      Información Profesional
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Especialidad</p>
                        <p className="font-semibold">{medicoSeleccionado.strNombreEspecialidad || 'No especificada'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Cédula Profesional</p>
                        <p className="font-semibold">{(medicoSeleccionado as MedicoDetalle).strLicencia || 'No registrada'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Cédula de Especialidad</p>
                        <p className="font-semibold">{(medicoSeleccionado as MedicoDetalle).strEspecialidadMedico || 'No registrada'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Consultorio</p>
                        <p className="font-semibold">{medicoSeleccionado.strConsultorio || 'No asignado'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h3 className="font-semibold text-lg mb-3 text-purple-900 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Certificaciones y Servicios
                    </h3>
                    <div className="bg-white p-3 rounded border">
                      <p className="text-gray-800">{(medicoSeleccionado as MedicoDetalle).strCertificacion || medicoSeleccionado.strNotas || 'No hay detalles registrados'}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="historial" className="space-y-4 mt-4">
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                    <h3 className="font-semibold text-lg mb-3 text-indigo-900 flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Horarios de Atención
                    </h3>
                    <div className="space-y-3">
                      {(() => {
                        const detalle = medicoSeleccionado as MedicoDetalle;
                        // diasDisponibles viene desde la consulta: cadena separada por comas
                        const diasDisponibles = detalle?.diasDisponibles
                          ? detalle.diasDisponibles.split(',').map((d) => d.trim())
                          : [];

                        const diasSemana = [
                          { nombre: 'Lunes', key: 'Lunes' },
                          { nombre: 'Martes', key: 'Martes' },
                          { nombre: 'Miércoles', key: 'Miércoles' },
                          { nombre: 'Jueves', key: 'Jueves' },
                          { nombre: 'Viernes', key: 'Viernes' },
                          { nombre: 'Sábado', key: 'Sábado' },
                          { nombre: 'Domingo', key: 'Domingo' },
                        ];

                        // Si no hay diasDisponibles, mostrar horario general (horarioInicio/horarioFin) si existe
                        if ((!detalle || !detalle.diasDisponibles) && (detalle?.horarioInicio || detalle?.horarioFin || detalle?.strHorario)) {
                          const horarioText = detalle?.strHorario || `${detalle?.horarioInicio || '8:00 AM'} - ${detalle?.horarioFin || '5:00 PM'}`;
                          return (
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-semibold text-gray-800">Horario</p>
                                  <p className="text-sm text-gray-600">{horarioText}</p>
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-800">Consultorio</p>
                                  <p className="text-sm text-gray-600">{detalle?.strConsultorio || 'No asignado'}</p>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div>
                            {diasSemana.map((dia) => {
                              const estaDisponible = diasDisponibles.some(d => d.toLowerCase() === dia.key.toLowerCase());
                              return (
                                <div key={dia.key} className="bg-white p-4 rounded-lg border border-gray-200 mb-3">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <p className="font-semibold text-gray-800">{dia.nombre}</p>
                                      <p className="text-sm text-gray-600">
                                        {estaDisponible ? (detalle?.strHorarioDetalle || `${detalle?.horarioInicio || '8:00 AM'} - ${detalle?.horarioFin || '5:00 PM'}`) : 'No disponible'}
                                      </p>
                                    </div>
                                    <div>
                                      {estaDisponible ? (
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Disponible</span>
                                      ) : (
                                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">Cerrado</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-8 text-gray-500">No se pudo cargar la información del médico</div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
