"use client";

import { useState, useEffect } from "react";
import { Search, Plus, X, FileText, AlertCircle, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { Input } from "@/components/ui/input/input";
import { Button } from "@/components/ui/button/button";
import { Label } from "@/components/ui/label/label";
import { Textarea } from "@/components/ui/textarea/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select/select";

interface CIE10 {
  intCIE10: number;
  strCodigo: string;
  strDescripcion: string;
  strCategoria: string;
}

interface Diagnostico {
  intConsultaDiagnostico: number;
  strTipoDiagnostico: string;
  txtNotasDiagnostico?: string;
  datFechaDiagnostico: string;
  intCIE10: number;
  strCodigo: string;
  strDescripcion: string;
  strCategoria: string;
}

interface DiagnosticosConsultaProps {
  intConsulta: number;
}

export default function DiagnosticosConsulta({ intConsulta }: DiagnosticosConsultaProps) {
  const [diagnosticos, setDiagnosticos] = useState<Diagnostico[]>([]);
  const [modalAgregar, setModalAgregar] = useState(false);
  const [cargando, setCargando] = useState(false);

  // Estados del formulario
  const [busqueda, setBusqueda] = useState("");
  const [resultadosCIE10, setResultadosCIE10] = useState<CIE10[]>([]);
  const [cie10Seleccionado, setCie10Seleccionado] = useState<CIE10 | null>(null);
  const [tipoDiagnostico, setTipoDiagnostico] = useState<string>("PRINCIPAL");
  const [notas, setNotas] = useState("");

  useEffect(() => {
    cargarDiagnosticos();
  }, [intConsulta]);

  const cargarDiagnosticos = async () => {
    try {
      const response = await fetch(`/api/consultas/${intConsulta}/diagnosticos`);
      const data = await response.json();
      if (data.success) {
        setDiagnosticos(data.data);
      }
    } catch (error) {
      console.error("Error al cargar diagnósticos:", error);
    }
  };

  const buscarCIE10 = async () => {
    if (!busqueda || busqueda.length < 2) return;

    setCargando(true);
    try {
      const response = await fetch(`/api/cie10/buscar?q=${encodeURIComponent(busqueda)}`);
      const data = await response.json();
      if (data.success) {
        setResultadosCIE10(data.data);
      }
    } catch (error) {
      console.error("Error al buscar CIE-10:", error);
    } finally {
      setCargando(false);
    }
  };

  const agregarDiagnostico = async () => {
    if (!cie10Seleccionado) {
      Swal.fire({
        icon: "warning",
        title: "Atención",
        text: "Por favor selecciona un código CIE-10",
      });
      return;
    }

    setCargando(true);
    try {
      const response = await fetch(`/api/consultas/${intConsulta}/diagnosticos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intCIE10: cie10Seleccionado.intCIE10,
          strTipoDiagnostico: tipoDiagnostico,
          txtNotasDiagnostico: notas || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Diagnóstico agregado exitosamente",
          timer: 2000,
          showConfirmButton: false,
        });
        setModalAgregar(false);
        limpiarFormulario();
        cargarDiagnosticos();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al agregar diagnóstico",
        });
      }
    } catch (error) {
      console.error("Error al agregar diagnóstico:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al agregar diagnóstico",
      });
    } finally {
      setCargando(false);
    }
  };

  const eliminarDiagnostico = async (intConsultaDiagnostico: number) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar diagnóstico?",
      text: "¿Estás seguro de eliminar este diagnóstico?",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(
        `/api/consultas/${intConsulta}/diagnosticos?id=${intConsultaDiagnostico}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "¡Eliminado!",
          text: "Diagnóstico eliminado exitosamente",
          timer: 2000,
          showConfirmButton: false,
        });
        cargarDiagnosticos();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al eliminar diagnóstico",
        });
      }
    } catch (error) {
      console.error("Error al eliminar diagnóstico:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al eliminar diagnóstico",
      });
    }
  };

  const limpiarFormulario = () => {
    setBusqueda("");
    setResultadosCIE10([]);
    setCie10Seleccionado(null);
    setTipoDiagnostico("PRINCIPAL");
    setNotas("");
  };

  const getTipoDiagnosticoColor = (tipo: string) => {
    const colors: Record<string, string> = {
      PRINCIPAL: "bg-red-100 text-red-700 border-red-200",
      SECUNDARIO: "bg-orange-100 text-orange-700 border-orange-200",
      PRESUNTIVO: "bg-yellow-100 text-yellow-700 border-yellow-200",
      CONFIRMADO: "bg-green-100 text-green-700 border-green-200",
      COMORBILIDAD: "bg-purple-100 text-purple-700 border-purple-200",
    };
    return colors[tipo] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Diagnósticos de la Consulta
        </h3>
        <Button onClick={() => setModalAgregar(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Diagnóstico
        </Button>
      </div>

      {/* Lista de diagnósticos */}
      {diagnosticos.length === 0 ? (
        <div className="text-center py-8 border rounded-lg bg-gray-50">
          <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600">No hay diagnósticos registrados para esta consulta</p>
          <Button
            onClick={() => setModalAgregar(true)}
            variant="outline"
            size="sm"
            className="mt-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Primer Diagnóstico
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {diagnosticos.map((dx) => (
            <div
              key={dx.intConsultaDiagnostico}
              className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-mono font-semibold">
                      {dx.strCodigo}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getTipoDiagnosticoColor(
                        dx.strTipoDiagnostico
                      )}`}
                    >
                      {dx.strTipoDiagnostico}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-1">{dx.strDescripcion}</h4>
                  {dx.strCategoria && (
                    <p className="text-sm text-gray-500 mb-2">{dx.strCategoria}</p>
                  )}
                  {dx.txtNotasDiagnostico && (
                    <div className="mt-2 p-2 bg-gray-50 rounded border-l-4 border-blue-400">
                      <p className="text-sm text-gray-700">
                        <strong>Notas:</strong> {dx.txtNotasDiagnostico}
                      </p>
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => eliminarDiagnostico(dx.intConsultaDiagnostico)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Agregar Diagnóstico */}
      <Dialog open={modalAgregar} onOpenChange={setModalAgregar}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              Agregar Diagnóstico CIE-10
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Búsqueda CIE-10 */}
            <div>
              <Label>Buscar Código CIE-10</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  placeholder="Buscar por código o descripción..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && buscarCIE10()}
                />
                <Button onClick={buscarCIE10} disabled={cargando}>
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* CIE-10 Seleccionado */}
            {cie10Seleccionado && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-1 bg-blue-600 text-white rounded text-sm font-mono">
                        {cie10Seleccionado.strCodigo}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-800">
                      {cie10Seleccionado.strDescripcion}
                    </p>
                    <p className="text-sm text-gray-600">{cie10Seleccionado.strCategoria}</p>
                  </div>
                  <Button
                    onClick={() => setCie10Seleccionado(null)}
                    variant="ghost"
                    size="sm"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Resultados de búsqueda */}
            {resultadosCIE10.length > 0 && !cie10Seleccionado && (
              <div className="border rounded-lg max-h-60 overflow-y-auto">
                {resultadosCIE10.map((cie10) => (
                  <div
                    key={cie10.intCIE10}
                    onClick={() => {
                      setCie10Seleccionado(cie10);
                      setResultadosCIE10([]);
                    }}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-mono">
                        {cie10.strCodigo}
                      </span>
                    </div>
                    <p className="font-medium text-sm">{cie10.strDescripcion}</p>
                    <p className="text-xs text-gray-500">{cie10.strCategoria}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Tipo de diagnóstico */}
            <div>
              <Label>Tipo de Diagnóstico</Label>
              <Select value={tipoDiagnostico} onValueChange={setTipoDiagnostico}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRINCIPAL">Principal</SelectItem>
                  <SelectItem value="SECUNDARIO">Secundario</SelectItem>
                  <SelectItem value="PRESUNTIVO">Presuntivo</SelectItem>
                  <SelectItem value="CONFIRMADO">Confirmado</SelectItem>
                  <SelectItem value="COMORBILIDAD">Comorbilidad</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notas */}
            <div>
              <Label>Notas Adicionales (Opcional)</Label>
              <Textarea
                placeholder="Observaciones o detalles del diagnóstico..."
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                rows={3}
                className="mt-1"
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                onClick={() => {
                  setModalAgregar(false);
                  limpiarFormulario();
                }}
                variant="outline"
              >
                Cancelar
              </Button>
              <Button onClick={agregarDiagnostico} disabled={!cie10Seleccionado || cargando}>
                {cargando ? "Guardando..." : "Agregar Diagnóstico"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
