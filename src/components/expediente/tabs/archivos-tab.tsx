"use client";

import { useState, useEffect } from "react";
import { Paperclip, Plus, Upload, Download, Eye, File } from "lucide-react";
import { Button } from "@/components/ui/button/button";

interface Archivo {
  intArchivo: number;
  strNombreArchivo: string;
  strCategoria: string;
  dblTamanoArchivo: number;
  datFechaSubida: string;
  txtDescripcion: string | null;
  strNombreDoctor: string | null;
}

interface ArchivosTabProps {
  intPaciente: number;
}

export default function ArchivosTab({ intPaciente }: ArchivosTabProps) {
  const [archivos, setArchivos] = useState<Archivo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarArchivos();
  }, [intPaciente]);

  const cargarArchivos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/expediente/archivos?intPaciente=${intPaciente}`);
      if (response.ok) {
        const data = await response.json();
        setArchivos(data.archivos || []);
      }
    } catch (error) {
      console.error("Error al cargar archivos:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoriaColor = (categoria: string) => {
    const colores: any = {
      ESTUDIO: "text-blue-600 bg-blue-50",
      CONSENTIMIENTO: "text-green-600 bg-green-50",
      IMAGEN: "text-purple-600 bg-purple-50",
      DOCUMENTO_LEGAL: "text-red-600 bg-red-50",
      RECETA: "text-orange-600 bg-orange-50",
      OTRO: "text-gray-600 bg-gray-50",
    };
    return colores[categoria] || colores.OTRO;
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
          <h2 className="text-2xl font-bold text-gray-800">Archivos Adjuntos</h2>
          <p className="text-gray-600">Documentos, imágenes y archivos del paciente</p>
        </div>
        <Button>
          <Upload className="w-4 h-4 mr-2" />
          Subir Archivo
        </Button>
      </div>

      {archivos.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <Paperclip className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No hay archivos adjuntos</p>
          <p className="text-sm text-gray-500 mt-1">
            Los archivos subidos aparecerán aquí
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {archivos.map((archivo) => (
            <div
              key={archivo.intArchivo}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded ${getCategoriaColor(archivo.strCategoria)}`}>
                  <File className="w-5 h-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-800 truncate">
                    {archivo.strNombreArchivo}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {archivo.strCategoria.replace(/_/g, " ")} • {archivo.dblTamanoArchivo.toFixed(2)} MB
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(archivo.datFechaSubida).toLocaleDateString("es-MX")}
                  </p>
                  
                  {archivo.txtDescripcion && (
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                      {archivo.txtDescripcion}
                    </p>
                  )}

                  {archivo.strNombreDoctor && (
                    <p className="text-xs text-gray-500 mt-2">
                      Por: Dr. {archivo.strNombreDoctor}
                    </p>
                  )}

                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-3 h-3 mr-1" />
                      Ver
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="w-3 h-3 mr-1" />
                      Descargar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
