"use client";
import { useState,useEffect } from "react";
import { Paciente } from "@/types/pacientes";   
import formatearFechaLarga  from "@/lib/formatterFecha";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs/tabs";
import { Button } from "@/components/ui/button/button";
import { Pencil, Trash2,User,Calendar,Stethoscope ,Eye , Clock,Activity,Mail,PhoneCallIcon,MapPinHouseIcon, CalendarFoldIcon, Heart, Pill, FileText } from "lucide-react";


export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<any>(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  
  /* ---------- Cargar citas al montar ---------- */
  useEffect(() => {
    async function fetchPacientes() {
      try {
        const response = await fetch("/api/pacientes");
        if (!response.ok) throw new Error("Network response was not ok");
        const data: { data: Paciente[] } = await response.json();
       // console.log("Datos recibidos:", data.data);
        setPacientes(data.data);
      } catch (error) {
        console.error("Error al obtener los pacientes:", error);
      }
    }
    fetchPacientes();
  }, []);

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

return (
  <div className="p-6">
    <h1 className="text-2xl font-semibold mb-6">🧑 Pacientes</h1>
    <div className="w-full overflow-x-auto">

   
    <div className="rounded-xl border shadow-sm overflow-hidden  border-gray-200">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 ">
          <TableHead className="text-left font-semibold border-r border-gray-200">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
               Paciente
          </div>
          </TableHead>

          <TableHead className="text-left font-semibold border-r border-gray-200">
          <div className="flex items-center gap-2">
            <PhoneCallIcon className="w-4 h-4 text-muted-foreground" />
               Telefono
          </div>
          </TableHead>
          <TableHead className="text-left font-semibold border-r border-gray-200">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
               Correo
          </div>
          </TableHead>
          <TableHead className="text-left font-semibold border-r border-gray-200">
          <div className="flex items-center gap-2">
            <MapPinHouseIcon  className="w-4 h-4 text-muted-foreground" />
               Direccion
          </div>
          </TableHead>
          <TableHead className="text-left font-semibold border-r border-gray-200">
          <div className="flex items-center gap-2">
            <CalendarFoldIcon  className="w-4 h-4 text-muted-foreground" />
               Fecha Nacimiento
          </div>
          </TableHead>
          <TableHead className="text-left font-semibold border-r border-gray-200">
          <div className="flex items-center gap-2">
            <Eye  className="w-4 h-4 text-muted-foreground" />
               Estado
          </div>
          </TableHead>
            <TableHead className="text-left font-semibold">Acciones</TableHead>
          </TableRow>
        </TableHeader>
         <TableBody>
            {pacientes.length > 0 ? (
              pacientes.map((paciente) => (
                <TableRow
                  key={`paciente-${paciente.intPaciente}`}
                  className="hover:bg-muted/10 transition border-gray-200"
                >
                  <TableCell className="font-medium border-r border-gray-200">
                    {paciente.strNombre} {paciente.strApellidoPaterno} {paciente.strApellidoMaterno}
                  </TableCell>
                  <TableCell className="border-r border-gray-200">
                    {paciente.strTelefono}
                  </TableCell>
                  <TableCell className="border-r border-gray-200">
                    {paciente.strEmail}
                  </TableCell>
                  <TableCell className="border-r border-gray-200">
                    {paciente.strDireccion} - {paciente.strCiudad}
                  </TableCell>
                  <TableCell className="border-r border-gray-200">
                    {formatearFechaLarga(paciente.datFechaNacimiento)}
                  </TableCell>                
                  <TableCell className="border-r border-gray-200">
                    {paciente.strEstado}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Pencil className="w-4 h-4 cursor-pointer text-blue-500 hover:text-blue-700" />
                      <Trash2 className="w-4 h-4 cursor-pointer text-red-500 hover:text-red-700" />
                      <Eye 
                        className="w-4 h-4 cursor-pointer text-green-500 hover:text-green-700" 
                        onClick={() => handleVerDetalle(paciente.intPaciente)}
                      />
                    </div>
                  </TableCell>

                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No hay pacientes.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
      </Table>
    </div>
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
                      {pacienteSeleccionado.strNombre} {pacienteSeleccionado.strApellidoPaterno} {pacienteSeleccionado.strApellidoMaterno}
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
                    <p className="text-sm text-gray-600">Género</p>
                    <p className="font-semibold">{pacienteSeleccionado.strGenero}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">CURP</p>
                    <p className="font-semibold">{pacienteSeleccionado.strCurp || 'N/A'}</p>
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
                              Dr. {cita.strNombreDoctor}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            cita.strEstado === 'CONFIRMADA' ? 'bg-green-100 text-green-700' :
                            cita.strEstado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-700' :
                            cita.strEstado === 'CANCELADA' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {cita.strEstado}
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
  

  
