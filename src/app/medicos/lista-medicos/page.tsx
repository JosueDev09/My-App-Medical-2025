"use client";
import { useState,useEffect } from "react";
import { Medico } from "@/types/medicos";   
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table/table";
//import { Button } from "@/components/ui/button";
import { Pencil, Trash2,User,Calendar,Stethoscope ,Eye , Clock,Activity,PhoneCallIcon,Mail,MapPinHouseIcon, FileText, Pill, Heart

 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs/tabs";
import formatearFechaLarga from "@/lib/formatterFecha";
import { Button } from "@/components/ui/button/button";

export default function MedicosPage() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [medicoSeleccionado, setMedicoSeleccionado] = useState<any>(null);
  const router = useRouter();

  /* ---------- Cargar citas al montar ---------- */
  useEffect(() => {
    async function fetchMedicos() {
      try {
        const response = await fetch("/api/Doctor");
        if (!response.ok) throw new Error("Network response was not ok");
        const data: { success: boolean; data: Medico[]; message: string } = await response.json();
       // console.log("Datos recibidos:", data);
        setMedicos(data.data);
      } catch (error) {
        console.error("Error al obtener los medicos:", error);
      }
    }
    fetchMedicos();
  }, []);

    const handleAgregarDoctor = async () => {
    router.push("/medicos/alta-medicos");
  };

  
  /* ---------- Cargar detalle del medico ---------- */
  const handleVerDetalle = async (idMedico: string | number) => {
    setCargandoDetalle(true);
    setModalOpen(true);
    
    try {
      const response = await fetch(`/api/Doctor?tipo=detalle&id=${idMedico}`);
      if (!response.ok) throw new Error("Error al obtener detalle del medico");
      const data = await response.json();
      setMedicoSeleccionado(data.data);
    } catch (error) {
      console.error("Error al obtener detalle del medico:", error);
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
    <h1 className="text-2xl font-semibold mb-6">👨‍⚕️ Medicos</h1>
    <div className="w-full overflow-x-auto">

    <Button variant="outline" onClick={handleAgregarDoctor} className="mb-4 cursor-pointer bg-blue-500 text-white hover:bg-blue-400 hover:text-white">Agregar Doctor </Button> 
    <div className="rounded-xl border shadow-sm overflow-hidden  border-gray-200">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 ">
          <TableHead className="text-left font-semibold border-r border-gray-200">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
               Doctor
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
            <Activity  className="w-4 h-4 text-muted-foreground" />
               Especialidad
          </div>
          </TableHead>
          <TableHead className="text-left font-semibold border-r border-gray-200">
          <div className="flex items-center gap-2">
            <Eye  className="w-4 h-4 text-muted-foreground" />
               Estatus
          </div>
          </TableHead>
            <TableHead className="text-left font-semibold">Acciones</TableHead>
          </TableRow>
        </TableHeader>
         <TableBody>
            {medicos.length > 0 ? (
              medicos.map((medico) => (
                <TableRow
                  key={medico.intDoctor}
                  className="hover:bg-muted/10 transition border-gray-200"
                >
                  <TableCell className="font-medium border-r border-gray-200">
                    {medico.strNombre}
                  </TableCell>
                  <TableCell className="border-r border-gray-200">
                    {medico.strTelefono}
                  </TableCell>
                  <TableCell className="border-r border-gray-200">
                    {medico.strEmail}
                  </TableCell>
                  <TableCell className="border-r border-gray-200">
                    {medico.strDireccion}
                  </TableCell>
                  <TableCell className="border-r border-gray-200">
                    {medico.strNombreEspecialidad}
                  </TableCell>
                  <TableCell className="border-r border-gray-200 text-center">
                    {medico.strEstadoUsuario == 'Activo' || medico.strEstadoUsuario == 'ACTIVO' ? (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                        ACTIVO
                        </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                            INACTIVO
                            </span>
                          )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Pencil className="w-4 h-4 cursor-pointer text-blue-500 hover:text-blue-700" />
                      <Trash2 className="w-4 h-4 cursor-pointer text-red-500 hover:text-red-700" />
                      <Eye className="w-4 h-4 cursor-pointer text-green-500 hover:text-green-700"
                     onClick={() => handleVerDetalle(medico.intDoctor)} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No hay medicos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
      </Table>
    </div>
    </div>

    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Información del Médico
          </DialogTitle>
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
                <Heart className="w-4 h-4" />
                Datos Médicos
              </TabsTrigger>
              <TabsTrigger value="historial" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Horarios
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
                      {medicoSeleccionado.strNombre} {medicoSeleccionado.strApellidoPaterno} {medicoSeleccionado.strApellidoMaterno}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Edad</p>
                    <p className="font-semibold">
                      {calcularEdad(medicoSeleccionado.datFechaNacimiento)} años
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fecha de nacimiento</p>
                    <p className="font-semibold">
                      {formatearFechaLarga(medicoSeleccionado.datFechaNacimiento)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Género</p>
                    <p className="font-semibold">{medicoSeleccionado.strSexo.toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">CURP</p>
                    <p className="font-semibold">{medicoSeleccionado.strCurp || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tipo de sangre</p>
                    <p className="font-semibold">{medicoSeleccionado.strTipoSangre || 'N/A'}</p>
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
                    <p className="font-semibold">{medicoSeleccionado.strTelefono}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Teléfono de emergencia</p>
                    <p className="font-semibold">{medicoSeleccionado.strTelefonoEmergencia || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Correo electrónico</p>
                    <p className="font-semibold">{medicoSeleccionado.strEmail}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Dirección</p>
                    <p className="font-semibold">
                      {medicoSeleccionado.strDireccion}
                      {medicoSeleccionado.strCiudad && `, ${medicoSeleccionado.strCiudad}`}
                      {medicoSeleccionado.strEstado && `, ${medicoSeleccionado.strEstado}`}
                      {medicoSeleccionado.strCodigoPostal && ` - CP: ${medicoSeleccionado.strCodigoPostal}`}
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
                      medicoSeleccionado.strEstatus === 'ACTIVO' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {medicoSeleccionado.strEstatus}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fecha de registro</p>
                    <p className="font-semibold">
                      {formatearFechaLarga(medicoSeleccionado.datFechaRegistro)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total de citas</p>
                    <p className="font-semibold">{medicoSeleccionado.totalCitas || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Última cita</p>
                    <p className="font-semibold">
                      {medicoSeleccionado.ultimaCita 
                        ? formatearFechaLarga(medicoSeleccionado.ultimaCita)
                        : 'Sin citas registradas'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tab: Información Médica */}
            <TabsContent value="medica" className="space-y-4 mt-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-lg mb-3 text-blue-900 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5" />
                  Información Profesional
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Especialidad</p>
                    <p className="font-semibold text-lg">
                      {medicoSeleccionado.strNombreEspecialidad || 'No especificada'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cédula Profesional</p>
                    <p className="font-semibold">
                      {medicoSeleccionado.strCedulaProfesional || 'No registrada'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cédula de Especialidad</p>
                    <p className="font-semibold">
                      {medicoSeleccionado.strCedulaEspecialidad || 'No registrada'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Universidad</p>
                    <p className="font-semibold">
                      {medicoSeleccionado.strUniversidad || 'No especificada'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Años de Experiencia</p>
                    <p className="font-semibold">
                      {medicoSeleccionado.intExperiencia ? `${medicoSeleccionado.intExperiencia} años` : 'No especificado'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Consultorio</p>
                    <p className="font-semibold">
                      {medicoSeleccionado.strConsultorio || 'No asignado'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-lg mb-3 text-green-900 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Certificaciones y Reconocimientos
                </h3>
                <div className="bg-white p-3 rounded border">
                  <p className="text-gray-800">
                    {medicoSeleccionado.strCertificaciones || 'No se registran certificaciones adicionales'}
                  </p>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-lg mb-3 text-purple-900 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Servicios y Procedimientos
                </h3>
                <div className="bg-white p-3 rounded border">
                  <p className="text-gray-800">
                    {medicoSeleccionado.strServicios || 'No se especifican servicios adicionales'}
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="font-semibold text-lg mb-3 text-yellow-900 flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Idiomas y Membresías
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Idiomas</p>
                    <div className="bg-white p-3 rounded border">
                      <p className="text-gray-800">
                        {medicoSeleccionado.strIdiomas || 'Español'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-1">Membresías</p>
                    <div className="bg-white p-3 rounded border">
                      <p className="text-gray-800">
                        {medicoSeleccionado.strMembresias || 'No especificadas'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tab: Horarios */}
            <TabsContent value="historial" className="space-y-4 mt-4">
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                <h3 className="font-semibold text-lg mb-3 text-indigo-900 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Horarios de Atención
                </h3>
                
                {(() => {
                  // Parsear los días disponibles desde el string
                  const diasDisponibles = medicoSeleccionado.diasDisponibles 
                    ? medicoSeleccionado.diasDisponibles.split(',').map((d: string) => d.trim())
                    : [];
                  
                  const diasSemana = [
                    { nombre: 'Lunes', letra: 'L', color: 'blue' },
                    { nombre: 'Martes', letra: 'M', color: 'purple' },
                    { nombre: 'Miércoles', letra: 'Mi', color: 'green' },
                    { nombre: 'Jueves', letra: 'J', color: 'yellow' },
                    { nombre: 'Viernes', letra: 'V', color: 'orange' },
                    { nombre: 'Sábado', letra: 'S', color: 'red' },
                    { nombre: 'Domingo', letra: 'D', color: 'pink' }
                  ];

                  return (
                    <div className="space-y-3">
                      {diasSemana.map((dia) => {
                        const estaDisponible = diasDisponibles.includes(dia.nombre);
                        
                        return (
                          <div key={dia.nombre} className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 bg-${dia.color}-100 rounded-full flex items-center justify-center`}>
                                  <span className={`font-bold text-${dia.color}-700`}>{dia.letra}</span>
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-800">{dia.nombre}</p>
                                  <p className="text-sm text-gray-600">
                                    {estaDisponible 
                                      ? medicoSeleccionado.strHorarioDetalle || '8:00 AM - 5:00 PM'
                                      : 'No disponible'
                                    }
                                  </p>
                                </div>
                              </div>
                              {estaDisponible ? (
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                  Disponible
                                </span>
                              ) : (
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                  Cerrado
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

                {/* Información adicional de horarios */}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Información Adicional
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700">
                      <span className="font-medium">Horario:</span> {medicoSeleccionado.horarioInicio && medicoSeleccionado.horarioFin ? `${medicoSeleccionado.horarioInicio} - ${medicoSeleccionado.horarioFin}` : '8:00 AM - 5:00 PM'}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">Días disponibles:</span> {medicoSeleccionado.diasDisponibles || 'No especificado'}
                    </p>
                    {medicoSeleccionado.strNotasHorario && (
                      <p className="text-gray-700 mt-2 pt-2 border-t border-blue-200">
                        <span className="font-medium">Notas:</span> {medicoSeleccionado.strNotasHorario}
                      </p>
                    )}
                  </div>
                </div>
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
