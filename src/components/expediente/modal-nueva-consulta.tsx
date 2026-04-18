"use client";

import { useState, useEffect } from "react";
import { X, Save, Activity, Stethoscope, FileText, Plus, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog/dialog";
import { Button } from "@/components/ui/button/button";
import { Label } from "@/components/ui/label/label";
import { Input } from "@/components/ui/input/input";
import { Textarea } from "@/components/ui/textarea/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select/select";

interface Doctor {
  intDoctor: number;
  strNombre: string;
  strApellidos: string;
  strNombreEspecialidad: string;
  intUsuario?: number;
}

interface CIE10 {
  intCIE10: number;
  strCodigo: string;
  strDescripcion: string;
  strCategoria: string;
}

interface DiagnosticoSeleccionado extends CIE10 {
  strTipoDiagnostico: string;
  txtNotas: string;
}

interface NuevaConsultaModalProps {
  isOpen: boolean;
  onClose: () => void;
  intPaciente: number;
  nombrePaciente: string;
  onConsultaCreada: () => void;
}

export default function NuevaConsultaModal({
  isOpen,
  onClose,
  intPaciente,
  nombrePaciente,
  onConsultaCreada,
}: NuevaConsultaModalProps) {
  // Configuración de z-index para SweetAlert2 sobre el modal
  const swalConfig = {
    customClass: {
      container: 'z-[9999]',
      popup: 'z-[9999]',
    },
    backdrop: true,
    allowOutsideClick: true,
  };

  const { data: session } = useSession();
  const [saving, setSaving] = useState(false);
  const [doctores, setDoctores] = useState<Doctor[]>([]);
  const [loadingDoctores, setLoadingDoctores] = useState(true);
  const [isDoctorLogeado, setIsDoctorLogeado] = useState(false);
  
  // Estados de errores de validación
  const [errorDoctor, setErrorDoctor] = useState("");
  const [errorMotivoConsulta, setErrorMotivoConsulta] = useState("");
  const [errorBusquedaCIE10, setErrorBusquedaCIE10] = useState("");
  const [infoDiagnostico, setInfoDiagnostico] = useState("");
  
  // Estados del formulario
  const [intDoctor, setIntDoctor] = useState<string>("");
  const [strMotivoConsulta, setStrMotivoConsulta] = useState("");
  const [strPadecimientoActual, setStrPadecimientoActual] = useState("");
  const [strExploracionFisica, setStrExploracionFisica] = useState("");
  const [strNotasConsulta, setStrNotasConsulta] = useState("");
  const [strTratamiento, setStrTratamiento] = useState("");
  const [strIndicaciones, setStrIndicaciones] = useState("");
  
  // Signos vitales
  const [dblPeso, setDblPeso] = useState("");
  const [dblTalla, setDblTalla] = useState("");
  const [dblIMC, setDblIMC] = useState("");
  const [strPresionArterial, setStrPresionArterial] = useState("");
  const [intFrecuenciaCardiaca, setIntFrecuenciaCardiaca] = useState("");
  const [intFrecuenciaRespiratoria, setIntFrecuenciaRespiratoria] = useState("");
  const [dblTemperatura, setDblTemperatura] = useState("");
  const [dblGlucosa, setDblGlucosa] = useState("");
  const [dblSaturacionOxigeno, setDblSaturacionOxigeno] = useState("");

  // Diagnósticos
  const [diagnosticos, setDiagnosticos] = useState<DiagnosticoSeleccionado[]>([]);
  const [busquedaCIE10, setBusquedaCIE10] = useState("");
  const [resultadosCIE10, setResultadosCIE10] = useState<CIE10[]>([]);
  const [mostrarBuscadorCIE10, setMostrarBuscadorCIE10] = useState(false);

  // Pre-seleccionar doctor logueado INMEDIATAMENTE (no esperar a cargar lista)
  useEffect(() => {
    if (isOpen && session?.user) {
      const doctorId = session.user.intDoctor;
      const userRole = session.user.rol;
      
      if (userRole === "Doctor" && doctorId) {
        setIntDoctor(doctorId.toString());
        setIsDoctorLogeado(true);
      //  console.log("✅ Doctor pre-seleccionado instantáneamente:", doctorId);
      }
    }
  }, [isOpen, session]);

  // Cargar lista de doctores (independiente de la pre-selección)
  useEffect(() => {
    if (isOpen) {
      cargarDoctores();
    }
  }, [isOpen]);

  // Calcular IMC automáticamente
  useEffect(() => {
    if (dblPeso && dblTalla) {
      const peso = parseFloat(dblPeso);
      const talla = parseFloat(dblTalla) / 100; // convertir cm a m
      if (peso > 0 && talla > 0) {
        const imc = (peso / (talla * talla)).toFixed(2);
        setDblIMC(imc);
      }
    }
  }, [dblPeso, dblTalla]);

  const cargarDoctores = async () => {
    try {
      setLoadingDoctores(true);
      const response = await fetch("/api/Doctor");
      if (response.ok) {
        const data = await response.json();
        setDoctores(data.data || []);
      }
    } catch (error) {
      console.error("Error al cargar doctores:", error);
    } finally {
      setLoadingDoctores(false);
    }
  };

  const buscarCIE10 = async () => {
    setErrorBusquedaCIE10("");
    setInfoDiagnostico("");
    
    if (!busquedaCIE10 || busquedaCIE10.length < 2) {
      setErrorBusquedaCIE10("Ingresa al menos 2 caracteres para buscar");
      return;
    }

    try {
      const response = await fetch(`/api/cie10/buscar?q=${encodeURIComponent(busquedaCIE10)}`);
      const data = await response.json();
      if (data.success) {
        setResultadosCIE10(data.data);
        if (data.data.length === 0) {
          setErrorBusquedaCIE10("No se encontraron resultados");
        }
      }
    } catch (error) {
      console.error("Error al buscar CIE-10:", error);
      setErrorBusquedaCIE10("Error al buscar diagnósticos");
    }
  };

  const agregarDiagnostico = (cie10: CIE10) => {
    setInfoDiagnostico("");
    
    const yaExiste = diagnosticos.some((d) => d.intCIE10 === cie10.intCIE10);
    if (yaExiste) {
      setInfoDiagnostico("Este diagnóstico ya está en la lista");
      return;
    }

    setDiagnosticos([
      ...diagnosticos,
      {
        ...cie10,
        strTipoDiagnostico: diagnosticos.length === 0 ? "PRINCIPAL" : "SECUNDARIO",
        txtNotas: "",
      },
    ]);
    setBusquedaCIE10("");
    setResultadosCIE10([]);
    setMostrarBuscadorCIE10(false);
    setErrorBusquedaCIE10("");
  };

  const eliminarDiagnostico = (intCIE10: number) => {
    setDiagnosticos(diagnosticos.filter((d) => d.intCIE10 !== intCIE10));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Limpiar errores previos
    setErrorDoctor("");
    setErrorMotivoConsulta("");

    // Validaciones
    let hasErrors = false;

    if (!intDoctor) {
      setErrorDoctor("Por favor selecciona un doctor");
      hasErrors = true;
    }

    if (!strMotivoConsulta.trim()) {
      setErrorMotivoConsulta("Por favor ingresa el motivo de consulta");
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    setSaving(true);

    try {
      // 1. Crear la consulta
      const responseConsulta = await fetch("/api/consultas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intPaciente,
          intDoctor: parseInt(intDoctor),
          consulta: {
            strMotivoConsulta,
            strPadecimientoActual,
            strExploracionFisica,
            strNotasConsulta,
            strDiagnostico: diagnosticos.map((d) => `${d.strCodigo} - ${d.strDescripcion}`).join("; "),
            strTratamiento,
            strIndicaciones,
          },
          signosVitales: {
            dblPeso: dblPeso || null,
            dblTalla: dblTalla || null,
            dblIMC: dblIMC || null,
            strPresionArterial: strPresionArterial || null,
            intFrecuenciaCardiaca: intFrecuenciaCardiaca || null,
            intFrecuenciaRespiratoria: intFrecuenciaRespiratoria || null,
            dblTemperatura: dblTemperatura || null,
            dblGlucosa: dblGlucosa || null,
            dblSaturacionOxigeno: dblSaturacionOxigeno || null,
          },
        }),
      });

      if (!responseConsulta.ok) {
        throw new Error("Error al crear consulta");
      }

      const dataConsulta = await responseConsulta.json();
      const intConsulta = dataConsulta.intConsulta;

      // 2. Guardar diagnósticos CIE-10
      if (diagnosticos.length > 0) {
        for (const diagnostico of diagnosticos) {
          await fetch(`/api/consultas/${intConsulta}/diagnosticos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              intCIE10: diagnostico.intCIE10,
              strTipoDiagnostico: diagnostico.strTipoDiagnostico,
              txtNotasDiagnostico: diagnostico.txtNotas || null,
            }),
          });
        }
      }

      Swal.fire({
        ...swalConfig,
        icon: "success",
        title: "¡Consulta creada!",
        text: "La consulta ha sido registrada exitosamente",
        timer: 2000,
        showConfirmButton: false,
      });

      limpiarFormulario();
      onConsultaCreada();
      onClose();
    } catch (error) {
      console.error("Error al guardar consulta:", error);
      Swal.fire({
        ...swalConfig,
        icon: "error",
        title: "Error",
        text: "Error al guardar la consulta",
      });
    } finally {
      setSaving(false);
    }
  };

  const limpiarFormulario = () => {
    setIntDoctor("");
    setStrMotivoConsulta("");
    setStrPadecimientoActual("");
    setStrExploracionFisica("");
    setStrNotasConsulta("");
    setStrTratamiento("");
    setStrIndicaciones("");
    setDblPeso("");
    setDblTalla("");
    setDblIMC("");
    setStrPresionArterial("");
    setIntFrecuenciaCardiaca("");
    setIntFrecuenciaRespiratoria("");
    setDblTemperatura("");
    setDblGlucosa("");
    setDblSaturacionOxigeno("");
    setDiagnosticos([]);
    setBusquedaCIE10("");
    setResultadosCIE10([]);
    setMostrarBuscadorCIE10(false);
    setErrorDoctor("");
    setErrorMotivoConsulta("");
    setErrorBusquedaCIE10("");
    setInfoDiagnostico("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Nueva Consulta - {nombrePaciente}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-blue-600" />
              Información de la Consulta
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Doctor *</Label>
                <Select 
                  value={intDoctor} 
                  onValueChange={(value) => {
                    setIntDoctor(value);
                    setErrorDoctor("");
                  }}
                >
                  <SelectTrigger 
                    disabled={loadingDoctores || isDoctorLogeado}
                    className={errorDoctor ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Selecciona un doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctores.map((doctor) => (
                      <SelectItem key={doctor.intDoctor} value={doctor.intDoctor.toString()}>
                        Dr. {doctor.strNombre} {doctor.strApellidos} - {doctor.strNombreEspecialidad}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errorDoctor && (
                  <p className="text-xs text-red-600 mt-1">
                    {errorDoctor}
                  </p>
                )}
                {isDoctorLogeado && !errorDoctor && (
                  <p className="text-xs text-blue-600 mt-1">
                    ℹ️ Consulta registrada con tu perfil de doctor
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <Label>Motivo de Consulta *</Label>
              <Textarea
                value={strMotivoConsulta ?? ""}
                onChange={(e) => {
                  setStrMotivoConsulta(e.target.value);
                  setErrorMotivoConsulta("");
                }}
                placeholder="Describe el motivo de la consulta..."
                rows={2}
                className={`mt-1 ${errorMotivoConsulta ? "border-red-500" : ""}`}
              />
              {errorMotivoConsulta && (
                <p className="text-xs text-red-600 mt-1">
                  {errorMotivoConsulta}
                </p>
              )}
            </div>

            <div className="mt-4">
              <Label>Padecimiento Actual</Label>
              <Textarea
                value={strPadecimientoActual ?? ""}
                onChange={(e) => setStrPadecimientoActual(e.target.value)}
                placeholder="Descripción del padecimiento actual..."
                rows={2}
                className="mt-1"
              />
            </div>
          </div>

          {/* Signos Vitales */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" />
              Signos Vitales
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <Label>Peso (kg)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={dblPeso}
                  onChange={(e) => setDblPeso(e.target.value)}
                  placeholder="0.0"
                />
              </div>
              <div>
                <Label>Talla (cm)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={dblTalla}
                  onChange={(e) => setDblTalla(e.target.value)}
                  placeholder="0.0"
                />
              </div>
              <div>
                <Label>IMC</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={dblIMC}
                  readOnly
                  placeholder="Auto"
                  className="bg-gray-100"
                />
              </div>
              <div>
                <Label>Presión Arterial</Label>
                <Input
                  value={strPresionArterial}
                  onChange={(e) => setStrPresionArterial(e.target.value)}
                  placeholder="120/80"
                />
              </div>
              <div>
                <Label>FC (lpm)</Label>
                <Input
                  type="number"
                  value={intFrecuenciaCardiaca}
                  onChange={(e) => setIntFrecuenciaCardiaca(e.target.value)}
                  placeholder="70"
                />
              </div>
              <div>
                <Label>FR (rpm)</Label>
                <Input
                  type="number"
                  value={intFrecuenciaRespiratoria}
                  onChange={(e) => setIntFrecuenciaRespiratoria(e.target.value)}
                  placeholder="16"
                />
              </div>
              <div>
                <Label>Temperatura (°C)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={dblTemperatura}
                  onChange={(e) => setDblTemperatura(e.target.value)}
                  placeholder="36.5"
                />
              </div>
              <div>
                <Label>Glucosa (mg/dL)</Label>
                <Input
                  type="number"
                  value={dblGlucosa}
                  onChange={(e) => setDblGlucosa(e.target.value)}
                  placeholder="100"
                />
              </div>
              <div>
                <Label>SpO2 (%)</Label>
                <Input
                  type="number"
                  value={dblSaturacionOxigeno}
                  onChange={(e) => setDblSaturacionOxigeno(e.target.value)}
                  placeholder="98"
                />
              </div>
            </div>
          </div>

          {/* Exploración Física y Notas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Exploración Física</Label>
              <Textarea
                value={strExploracionFisica ?? ""}
                onChange={(e) => setStrExploracionFisica(e.target.value)}
                placeholder="Hallazgos de la exploración física..."
                rows={4}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Notas de Consulta</Label>
              <Textarea
                value={strNotasConsulta ?? ""}
                onChange={(e) => setStrNotasConsulta(e.target.value)}
                placeholder="Notas adicionales..."
                rows={4}
                className="mt-1"
              />
            </div>
          </div>

          {/* Diagnósticos CIE-10 */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Diagnósticos CIE-10
              </h3>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setMostrarBuscadorCIE10(!mostrarBuscadorCIE10)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Diagnóstico
              </Button>
            </div>

            {mostrarBuscadorCIE10 && (
              <div className="mb-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Buscar diagnóstico CIE-10..."
                      value={busquedaCIE10}
                      onChange={(e) => {
                        setBusquedaCIE10(e.target.value);
                        setErrorBusquedaCIE10("");
                        setInfoDiagnostico("");
                      }}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), buscarCIE10())}
                      className={errorBusquedaCIE10 ? "border-red-500" : ""}
                    />
                    {errorBusquedaCIE10 && (
                      <p className="text-xs text-red-600 mt-1">
                        {errorBusquedaCIE10}
                      </p>
                    )}
                    {infoDiagnostico && (
                      <p className="text-xs text-amber-600 mt-1">
                        ⚠️ {infoDiagnostico}
                      </p>
                    )}
                  </div>
                  <Button type="button" onClick={buscarCIE10}>
                    Buscar
                  </Button>
                </div>

                {resultadosCIE10.length > 0 && (
                  <div className="mt-2 max-h-40 overflow-y-auto border rounded-lg bg-white">
                    {resultadosCIE10.map((cie10) => (
                      <div
                        key={cie10.intCIE10}
                        onClick={() => agregarDiagnostico(cie10)}
                        className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                      >
                        <div className="font-semibold text-sm">
                          {cie10.strCodigo} - {cie10.strDescripcion}
                        </div>
                        <div className="text-xs text-gray-600">{cie10.strCategoria}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {diagnosticos.length > 0 ? (
              <div className="space-y-2">
                {diagnosticos.map((dx, index) => (
                  <div key={dx.intCIE10} className="bg-white p-3 rounded-lg border flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                          {dx.strCodigo}
                        </span>
                        <Select
                          value={dx.strTipoDiagnostico}
                          onValueChange={(value) => {
                            const newDx = [...diagnosticos];
                            newDx[index].strTipoDiagnostico = value;
                            setDiagnosticos(newDx);
                          }}
                        >
                          <SelectTrigger className="w-40 h-7 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PRINCIPAL">Principal</SelectItem>
                            <SelectItem value="SECUNDARIO">Secundario</SelectItem>
                            <SelectItem value="PRESUNTIVO">Presuntivo</SelectItem>
                            <SelectItem value="CONFIRMADO">Confirmado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <p className="text-sm font-medium">{dx.strDescripcion}</p>
                      <p className="text-xs text-gray-600">{dx.strCategoria}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => eliminarDiagnostico(dx.intCIE10)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600 text-center py-4">
                No hay diagnósticos agregados
              </p>
            )}
          </div>

          {/* Tratamiento e Indicaciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Tratamiento / Receta</Label>
              <Textarea
                value={strTratamiento ?? ""}
                onChange={(e) => setStrTratamiento(e.target.value)}
                placeholder="Medicamentos y dosis..."
                rows={4}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Indicaciones</Label>
              <Textarea
                value={strIndicaciones ?? ""}
                onChange={(e) => setStrIndicaciones(e.target.value)}
                placeholder="Indicaciones generales al paciente..."
                rows={4}
                className="mt-1"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Consulta
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
