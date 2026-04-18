"use client";

import { useState } from "react";
import { Search, FileText, Stethoscope } from "lucide-react";
import Swal from "sweetalert2";
import { Input } from "@/components/ui/input/input";
import { Button } from "@/components/ui/button/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/card";

interface CIE10 {
  intCIE10: number;
  strCodigo: string;
  strDescripcion: string;
  strCategoria: string;
  strCapitulo: string;
}

export default function DiagnosticosManager() {
  const [termino, setTermino] = useState("");
  const [resultados, setResultados] = useState<CIE10[]>([]);
  const [cargando, setCargando] = useState(false);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  const buscarCIE10 = async () => {
    if (!termino || termino.length < 2) {
      Swal.fire({
        icon: "warning",
        title: "Atención",
        text: "Por favor ingresa al menos 2 caracteres para buscar",
      });
      return;
    }

    setCargando(true);
    setBusquedaRealizada(false);

    try {
      const response = await fetch(`/api/cie10/buscar?q=${encodeURIComponent(termino)}`);
      const data = await response.json();

      if (data.success) {
        setResultados(data.data);
        setBusquedaRealizada(true);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al buscar códigos CIE-10",
        });
      }
    } catch (error) {
      console.error("Error al buscar CIE-10:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al buscar códigos CIE-10",
      });
    } finally {
      setCargando(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      buscarCIE10();
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra de búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-600" />
            Buscar Código CIE-10
          </CardTitle>
          <CardDescription>
            Busca por código, descripción o categoría (ej: "diabetes", "E11", "hipertensión")
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Escribe el término de búsqueda..."
              value={termino}
              onChange={(e) => setTermino(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={buscarCIE10} disabled={cargando}>
              {cargando ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                  Buscando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Buscar
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      {busquedaRealizada && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              Resultados de Búsqueda
            </CardTitle>
            <CardDescription>
              Se encontraron {resultados.length} código(s) CIE-10
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resultados.length === 0 ? (
              <div className="text-center py-12">
                <Stethoscope className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">
                  No se encontraron resultados para "{termino}"
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Intenta con otro término de búsqueda
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {resultados.map((cie10) => (
                  <div
                    key={cie10.intCIE10}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-mono font-semibold">
                            {cie10.strCodigo}
                          </span>
                          {cie10.strCategoria && (
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                              {cie10.strCategoria}
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-1">
                          {cie10.strDescripcion}
                        </h3>
                        {cie10.strCapitulo && (
                          <p className="text-sm text-gray-500">
                            {cie10.strCapitulo}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Información */}
      {!busquedaRealizada && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  ¿Qué es CIE-10?
                </h3>
                <p className="text-blue-800 text-sm">
                  La Clasificación Internacional de Enfermedades (CIE-10) es el estándar
                  internacional para clasificar enfermedades y problemas relacionados con
                  la salud. Utiliza este buscador para encontrar códigos diagnósticos
                  precisos que puedes asignar a las consultas de tus pacientes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
