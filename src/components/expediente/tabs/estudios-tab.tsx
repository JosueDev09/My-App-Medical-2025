"use client";

import { useState, useEffect } from "react";
import { FlaskConical, Plus, Upload, Calendar, CheckCircle, Clock, Download } from "lucide-react";
import { Button } from "@/components/ui/button/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog/dialog";
import { Label } from "@/components/ui/label/label";
import { Input } from "@/components/ui/input/input";
import { Textarea } from "@/components/ui/textarea/textarea";

interface Estudio {
  intEstudio: number;
  strTipoEstudio: string;
  strNombreEstudio: string;
  datFechaSolicitud: string;
  datFechaResultado: string | null;
  strEstatus: string;
  strNombreDoctor: string;
  strRutaArchivo: string | null;
  txtResultados: string | null;
}

interface EstudiosTabProps {
  intPaciente: number;
}

export default function EstudiosTab({ intPaciente }: EstudiosTabProps) {
  const [estudios, setEstudios] = useState<Estudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalNuevo, setModalNuevo] = useState(false);

  useEffect(() => {
    cargarEstudios();
  }, [intPaciente]);

  const cargarEstudios = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/expediente/estudios?intPaciente=${intPaciente}`);
      if (response.ok) {
        const data = await response.json();
        setEstudios(data.estudios || []);
      }
    } catch (error) {
      console.error("Error al cargar estudios:", error);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoBadge = (estatus: string) => {
    const badges: any = {
      PENDIENTE: "bg-yellow-100 text-yellow-800",
      EN_PROCESO: "bg-blue-100 text-blue-800",
      COMPLETADO: "bg-green-100 text-green-800",
      CANCELADO: "bg-red-100 text-red-800",
    };
    return badges[estatus] || "bg-gray-100 text-gray-800";
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
          <h2 className="text-2xl font-bold text-gray-800">Estudios de Laboratorio y Gabinete</h2>
          <p className="text-gray-600">Estudios médicos solicitados y resultados</p>
        </div>
        <Button onClick={() => setModalNuevo(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Solicitar Estudio
        </Button>
      </div>

      {estudios.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <FlaskConical className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No hay estudios registrados</p>
          <Button
            className="mt-4"
            onClick={() => setModalNuevo(true)}
            variant="outline"
          >
            Solicitar primer estudio
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {estudios.map((estudio) => (
            <div
              key={estudio.intEstudio}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800">{estudio.strNombreEstudio}</h3>
                  <p className="text-sm text-gray-600">{estudio.strTipoEstudio.replace(/_/g, " ")}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getEstadoBadge(estudio.strEstatus)}`}>
                  {estudio.strEstatus.replace(/_/g, " ")}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Solicitado: {new Date(estudio.datFechaSolicitud).toLocaleDateString("es-MX")}</span>
                </div>

                {estudio.datFechaResultado && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Resultado: {new Date(estudio.datFechaResultado).toLocaleDateString("es-MX")}</span>
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  Solicitado por: Dr. {estudio.strNombreDoctor}
                </div>

                {estudio.strRutaArchivo && (
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    <Download className="w-4 h-4 mr-2" />
                    Descargar Resultado
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para nuevo estudio */}
      <Dialog open={modalNuevo} onOpenChange={setModalNuevo}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Solicitar Nuevo Estudio</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Esta funcionalidad estará disponible próximamente. Por ahora, los estudios se registran desde la consulta.
            </p>
            <Button onClick={() => setModalNuevo(false)} variant="outline" className="w-full">
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
