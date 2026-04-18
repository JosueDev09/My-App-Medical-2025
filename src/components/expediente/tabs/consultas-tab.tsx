"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, User, Stethoscope, Eye, Plus } from "lucide-react";
import { Button } from "@/components/ui/button/button";
import { useRouter } from "next/navigation";
import NuevaConsultaModal from "../modal-nueva-consulta";

interface Consulta {
  intConsulta: number;
  datFechaConsulta: string;
  strMotivoConsulta: string;
  strDiagnostico: string;
  strNombreDoctor: string;
  strNombreEspecialidad: string;
  strEstatusConsulta: string;
}

interface ConsultasTabProps {
  intPaciente: number;
  nombrePaciente?: string;
}

export default function ConsultasTab({ intPaciente, nombrePaciente }: ConsultasTabProps) {
  const router = useRouter();
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalNuevaConsulta, setModalNuevaConsulta] = useState(false);

  useEffect(() => {
    cargarConsultas();
  }, [intPaciente]);

  const cargarConsultas = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/expediente/consultas?intPaciente=${intPaciente}`);
      if (response.ok) {
        const data = await response.json();
        setConsultas(data.consultas || []);
      }
    } catch (error) {
      console.error("Error al cargar consultas:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Consultas Médicas</h2>
          <p className="text-gray-600">Historial completo de consultas del paciente</p>
        </div>
        <Button onClick={() => setModalNuevaConsulta(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Consulta
        </Button>
      </div>

      {consultas.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No hay consultas registradas</p>
          <Button
            className="mt-4"
            onClick={() => setModalNuevaConsulta(true)}
            variant="outline"
          >
            Crear primera consulta
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {consultas.map((consulta) => (
            <div
              key={consulta.intConsulta}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-800">
                      {formatDate(consulta.datFechaConsulta)}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {consulta.strEstatusConsulta}
                    </span>
                  </div>
                  
                  <div className="ml-8 space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Stethoscope className="w-4 h-4" />
                      <span>Dr. {consulta.strNombreDoctor}</span>
                      <span>•</span>
                      <span>{consulta.strNombreEspecialidad}</span>
                    </div>
                    
                    <div className="text-sm">
                      <span className="font-medium">Motivo:</span>{" "}
                      <span className="text-gray-700">{consulta.strMotivoConsulta}</span>
                    </div>
                    
                    {consulta.strDiagnostico && (
                      <div className="text-sm">
                        <span className="font-medium">Diagnóstico:</span>{" "}
                        <span className="text-gray-700">{consulta.strDiagnostico}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/historial-medico?consulta=${consulta.intConsulta}`)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Detalle
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Nueva Consulta */}
      <NuevaConsultaModal
        isOpen={modalNuevaConsulta}
        onClose={() => setModalNuevaConsulta(false)}
        intPaciente={intPaciente}
        nombrePaciente={nombrePaciente || "Paciente"}
        onConsultaCreada={cargarConsultas}
      />
    </div>
  );
}
