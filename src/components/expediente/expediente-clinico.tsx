"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs/tabs";
import { 
  User, 
  FileText, 
  Calendar, 
  FlaskConical, 
  Paperclip, 
  Pill,
  Activity,
  ArrowLeft,
  Edit,
  AlertCircle,
  TrendingUp,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button/button";
import { useRouter } from "next/navigation";
import DatosGenerales from "./tabs/datos-generales";
import HistoriaClinica from "@/components/expediente/tabs/historia-clinica";
import ConsultasTab from "@/components/expediente/tabs/consultas-tab";
import EstudiosTab from "@/components/expediente/tabs/estudios-tab";
import ArchivosTab from "@/components/expediente/tabs/archivos-tab";
import RecetasTab from "@/components/expediente/tabs/recetas-tab";
import EvolucionTab from "@/components/expediente/tabs/evolucion-tab";
import TimelineTab from "@/components/expediente/tabs/timeline-tab";
import GraficasTab from "@/components/expediente/tabs/graficas-tab";

interface ExpedienteClinicoProps {
  intPaciente: number;
}

interface Paciente {
  intPaciente: number;
  strNombre: string;
  strGenero: string;
  intEdad: number;
  datFechaNacimiento: string;
  strEmail: string;
  strTelefono: string;
  strTipoSangre: string | null;
  strAlergias: string | null;
  strEnfermedadesCronicas: string | null;
  strMedicamentosActuales: string | null;
  strEstatus: string;
}

export default function ExpedienteClinico({ intPaciente }: ExpedienteClinicoProps) {
  const router = useRouter();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("datos");
  const [refresh, setRefresh] = useState(0);

  // Cargar datos del paciente
  useEffect(() => {
    cargarPaciente();
  }, [intPaciente, refresh]);

  const cargarPaciente = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/pacientes/${intPaciente}`);
      
      if (!response.ok) {
        throw new Error("No se pudo cargar la información del paciente");
      }
      
      const data = await response.json();
      setPaciente(data.paciente);
    } catch (err: any) {
      setError(err.message);
      console.error("Error al cargar paciente:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefresh(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando expediente...</p>
        </div>
      </div>
    );
  }

  if (error || !paciente) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Error al cargar expediente</h3>
          <p className="text-gray-600 mb-4">{error || "Paciente no encontrado"}</p>
          <Button onClick={() => router.push("/pacientes")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Pacientes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header del Expediente */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/pacientes")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            
            <div>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {paciente.strNombre}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <span>{paciente.intEdad} años</span>
                    <span>•</span>
                    <span>{paciente.strGenero}</span>
                    {paciente.strTipoSangre && (
                      <>
                        <span>•</span>
                        <span className="font-semibold text-red-600">
                          {paciente.strTipoSangre}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={() => router.push(`/pacientes/editar/${intPaciente}`)}
            variant="outline"
            size="sm"
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar Datos
          </Button>
        </div>

        {/* Alertas importantes */}
        {paciente.strAlergias && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-800">
                  ALERGIAS
                </p>
                <p className="text-sm text-red-700">{paciente.strAlergias}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs del Expediente */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-2">
          <TabsList className="grid w-full grid-cols-9 gap-2">
            <TabsTrigger value="datos" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Datos</span>
            </TabsTrigger>
            <TabsTrigger value="historia" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Historia</span>
            </TabsTrigger>
            <TabsTrigger value="consultas" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Consultas</span>
            </TabsTrigger>
            <TabsTrigger value="estudios" className="flex items-center gap-2">
              <FlaskConical className="w-4 h-4" />
              <span className="hidden sm:inline">Estudios</span>
            </TabsTrigger>
            <TabsTrigger value="recetas" className="flex items-center gap-2">
              <Pill className="w-4 h-4" />
              <span className="hidden sm:inline">Recetas</span>
            </TabsTrigger>
            <TabsTrigger value="archivos" className="flex items-center gap-2">
              <Paperclip className="w-4 h-4" />
              <span className="hidden sm:inline">Archivos</span>
            </TabsTrigger>
            <TabsTrigger value="evolucion" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Evolución</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Timeline</span>
            </TabsTrigger>
            <TabsTrigger value="graficas" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Gráficas</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Contenido de los Tabs */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <TabsContent value="datos" className="p-6">
            <DatosGenerales paciente={paciente} onRefresh={handleRefresh} />
          </TabsContent>

          <TabsContent value="historia" className="p-6">
            <HistoriaClinica intPaciente={intPaciente} paciente={paciente} onRefresh={handleRefresh} />
          </TabsContent>

          <TabsContent value="consultas" className="p-6">
            <ConsultasTab intPaciente={intPaciente} nombrePaciente={paciente.strNombre} />
          </TabsContent>

          <TabsContent value="estudios" className="p-6">
            <EstudiosTab intPaciente={intPaciente} />
          </TabsContent>

          <TabsContent value="recetas" className="p-6">
            <RecetasTab intPaciente={intPaciente} />
          </TabsContent>

          <TabsContent value="archivos" className="p-6">
            <ArchivosTab intPaciente={intPaciente} />
          </TabsContent>

          <TabsContent value="evolucion" className="p-6">
            <EvolucionTab intPaciente={intPaciente} />
          </TabsContent>

          <TabsContent value="timeline" className="p-6">
            <TimelineTab intPaciente={intPaciente} />
          </TabsContent>

          <TabsContent value="graficas" className="p-6">
            <GraficasTab intPaciente={intPaciente} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
