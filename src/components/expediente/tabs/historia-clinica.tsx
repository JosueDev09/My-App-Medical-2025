"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button/button";
import { Label } from "@/components/ui/label/label";
import { Input } from "@/components/ui/input/input";
import { Textarea } from "@/components/ui/textarea/textarea";
import { 
  Save, 
  Edit, 
  CheckCircle, 
  AlertCircle,
  Users,
  Heart,
  Activity,
  Cigarette,
  Wine,
  Baby
} from "lucide-react";

interface HistoriaClinicaData {
  intHistoriaClinica?: number;
  intPaciente: number;
  
  // Heredofamiliares
  strDiabetes: string;
  strHipertension: string;
  strCancer: string;
  strCardiopatias: string;
  strEnfermedadesRenales: string;
  txtDetallesHeredo: string;
  
  // Personales Patológicos
  txtCirugiasPrevias: string;
  txtHospitalizaciones: string;
  txtTransfusiones: string;
  txtFracturas: string;
  txtAlergiasMedicamentos: string;
  txtEnfermedadesCronicas: string;
  
  // Personales No Patológicos
  strTabaquismo: string;
  intCigarrillosDia: number;
  intAniosFumando: number;
  strAlcoholismo: string;
  strFrecuenciaAlcohol: string;
  strDrogas: string;
  txtTipoDrogas: string;
  strActividadFisica: string;
  txtAlimentacion: string;
  
  // Gineco-Obstétricos
  intMenarca: number | null;
  datFechaUltimaMenstruacion: string;
  intGestas: number;
  intPartos: number;
  intCesareas: number;
  intAbortos: number;
  txtMetodoAnticonceptivo: string;
  txtComplicacionesObstetricas: string;
  
  isCompleto: boolean;
}

interface HistoriaClinicaProps {
  intPaciente: number;
  paciente: any;
  onRefresh: () => void;
}

export default function HistoriaClinica({ intPaciente, paciente, onRefresh }: HistoriaClinicaProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [historia, setHistoria] = useState<HistoriaClinicaData | null>(null);
  const [formData, setFormData] = useState<HistoriaClinicaData>({
    intPaciente,
    strDiabetes: "NO_SABE",
    strHipertension: "NO_SABE",
    strCancer: "NO_SABE",
    strCardiopatias: "NO_SABE",
    strEnfermedadesRenales: "NO_SABE",
    txtDetallesHeredo: "",
    txtCirugiasPrevias: "",
    txtHospitalizaciones: "",
    txtTransfusiones: "",
    txtFracturas: "",
    txtAlergiasMedicamentos: "",
    txtEnfermedadesCronicas: "",
    strTabaquismo: "NO",
    intCigarrillosDia: 0,
    intAniosFumando: 0,
    strAlcoholismo: "NO",
    strFrecuenciaAlcohol: "",
    strDrogas: "NO",
    txtTipoDrogas: "",
    strActividadFisica: "",
    txtAlimentacion: "",
    intMenarca: null,
    datFechaUltimaMenstruacion: "",
    intGestas: 0,
    intPartos: 0,
    intCesareas: 0,
    intAbortos: 0,
    txtMetodoAnticonceptivo: "",
    txtComplicacionesObstetricas: "",
    isCompleto: false,
  });

  const esMujer = paciente?.strGenero?.toLowerCase() === "femenino";

  useEffect(() => {
    cargarHistoria();
  }, [intPaciente]);

  const cargarHistoria = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/expediente/historia-clinica?intPaciente=${intPaciente}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.historia) {
          setHistoria(data.historia);
          setFormData(data.historia);
        } else {
          setEditMode(true); // Si no hay historia, activar modo edición
        }
      }
    } catch (error) {
      console.error("Error al cargar historia clínica:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof HistoriaClinicaData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/expediente/historia-clinica", {
        method: historia ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, isCompleto: true }),
      });

      if (response.ok) {
        const data = await response.json();
        setHistoria(data.historia);
        setEditMode(false);
        onRefresh();
        Swal.fire({
          icon: "success",
          title: "¡Guardado!",
          text: "Historia clínica guardada exitosamente",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        throw new Error("Error al guardar");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al guardar la historia clínica",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Vista de solo lectura
  if (!editMode && historia) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Historia Clínica</h2>
            <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Historia clínica completa
            </p>
          </div>
          <Button onClick={() => setEditMode(true)} variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </div>

        {/* Mostrar datos existentes */}
        <div className="grid gap-6">
          {/* Antecedentes Heredofamiliares */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Antecedentes Heredofamiliares
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div><span className="font-medium">Diabetes:</span> {historia.strDiabetes}</div>
              <div><span className="font-medium">Hipertensión:</span> {historia.strHipertension}</div>
              <div><span className="font-medium">Cáncer:</span> {historia.strCancer}</div>
              <div><span className="font-medium">Cardiopatías:</span> {historia.strCardiopatias}</div>
              <div><span className="font-medium">Enf. Renales:</span> {historia.strEnfermedadesRenales}</div>
            </div>
            {historia.txtDetallesHeredo && (
              <div className="mt-3 p-3 bg-white rounded border">
                <p className="text-sm text-gray-700">{historia.txtDetallesHeredo}</p>
              </div>
            )}
          </div>

          {/* Antecedentes Personales Patológicos */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-600" />
              Antecedentes Personales Patológicos
            </h3>
            <div className="space-y-2 text-sm">
              {historia.txtCirugiasPrevias && (
                <div><span className="font-medium">Cirugías:</span> {historia.txtCirugiasPrevias}</div>
              )}
              {historia.txtHospitalizaciones && (
                <div><span className="font-medium">Hospitalizaciones:</span> {historia.txtHospitalizaciones}</div>
              )}
              {historia.txtAlergiasMedicamentos && (
                <div className="text-red-700"><span className="font-medium">⚠️ Alergias:</span> {historia.txtAlergiasMedicamentos}</div>
              )}
            </div>
          </div>

          {/* Hábitos */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" />
              Hábitos y Estilo de Vida
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="font-medium">Tabaquismo:</span> {historia.strTabaquismo}</div>
              <div><span className="font-medium">Alcoholismo:</span> {historia.strAlcoholismo}</div>
              <div><span className="font-medium">Actividad Física:</span> {historia.strActividadFisica || "No especificado"}</div>
            </div>
          </div>

          {/* Gineco-Obstétricos (solo mujeres) */}
          {esMujer && (
            <div className="border rounded-lg p-4 bg-pink-50">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Baby className="w-5 h-5 text-pink-600" />
                Antecedentes Gineco-Obstétricos
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div><span className="font-medium">Menarca:</span> {historia.intMenarca || "N/A"} años</div>
                <div><span className="font-medium">Gestas:</span> {historia.intGestas}</div>
                <div><span className="font-medium">Partos:</span> {historia.intPartos}</div>
                <div><span className="font-medium">Cesáreas:</span> {historia.intCesareas}</div>
                <div><span className="font-medium">Abortos:</span> {historia.intAbortos}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Modo edición/creación
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {historia ? "Editar Historia Clínica" : "Registrar Historia Clínica"}
          </h2>
          <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
            <AlertCircle className="w-4 h-4 text-yellow-600" />
            Complete toda la información para un expediente completo
          </p>
        </div>
      </div>

      {/* Antecedentes Heredofamiliares */}
      <div className="border rounded-lg p-6 bg-gray-50">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Antecedentes Heredofamiliares
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {["strDiabetes", "strHipertension", "strCancer", "strCardiopatias", "strEnfermedadesRenales"].map((field) => (
            <div key={field}>
              <Label>{field.replace("str", "").replace(/([A-Z])/g, " $1")}</Label>
              <select
                value={formData[field as keyof HistoriaClinicaData] as string}
                onChange={(e) => handleChange(field as keyof HistoriaClinicaData, e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="NO_SABE">No sabe</option>
                <option value="SI">Sí</option>
                <option value="NO">No</option>
              </select>
            </div>
          ))}
        </div>

        <div>
          <Label>Detalles adicionales</Label>
          <Textarea
            value={formData.txtDetallesHeredo}
            onChange={(e) => handleChange("txtDetallesHeredo", e.target.value)}
            placeholder="Especifique qué familiar tuvo qué enfermedad..."
            rows={3}
          />
        </div>
      </div>

      {/* Antecedentes Personales Patológicos */}
      <div className="border rounded-lg p-6 bg-gray-50">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-600" />
          Antecedentes Personales Patológicos
        </h3>
        
        <div className="grid gap-4">
          <div>
            <Label>Cirugías Previas</Label>
            <Textarea
              value={formData.txtCirugiasPrevias}
              onChange={(e) => handleChange("txtCirugiasPrevias", e.target.value)}
              placeholder="Ej: Apendicectomía (2020), Cesárea (2018)..."
              rows={2}
            />
          </div>
          <div>
            <Label>Hospitalizaciones</Label>
            <Textarea
              value={formData.txtHospitalizaciones}
              onChange={(e) => handleChange("txtHospitalizaciones", e.target.value)}
              placeholder="Hospitalizaciones previas..."
              rows={2}
            />
          </div>
          <div>
            <Label>⚠️ Alergias a Medicamentos</Label>
            <Textarea
              value={formData.txtAlergiasMedicamentos}
              onChange={(e) => handleChange("txtAlergiasMedicamentos", e.target.value)}
              placeholder="Ej: Penicilina, Ibuprofeno..."
              rows={2}
              className="border-red-300"
            />
          </div>
        </div>
      </div>

      {/* Hábitos */}
      <div className="border rounded-lg p-6 bg-gray-50">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Cigarette className="w-5 h-5 text-gray-600" />
          Hábitos y Estilo de Vida
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Tabaquismo</Label>
            <select
              value={formData.strTabaquismo}
              onChange={(e) => handleChange("strTabaquismo", e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="NO">No</option>
              <option value="SI">Sí</option>
              <option value="EX_FUMADOR">Ex-fumador</option>
            </select>
          </div>

          {formData.strTabaquismo === "SI" && (
            <>
              <div>
                <Label>Cigarrillos por día</Label>
                <Input
                  type="number"
                  value={formData.intCigarrillosDia}
                  onChange={(e) => handleChange("intCigarrillosDia", parseInt(e.target.value) || 0)}
                  min="0"
                />
              </div>
              <div>
                <Label>Años fumando</Label>
                <Input
                  type="number"
                  value={formData.intAniosFumando}
                  onChange={(e) => handleChange("intAniosFumando", parseInt(e.target.value) || 0)}
                  min="0"
                />
              </div>
            </>
          )}

          <div>
            <Label>Alcoholismo</Label>
            <select
              value={formData.strAlcoholismo}
              onChange={(e) => handleChange("strAlcoholismo", e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="NO">No</option>
              <option value="SI">Sí</option>
              <option value="OCASIONAL">Ocasional</option>
            </select>
          </div>

          <div>
            <Label>Actividad Física</Label>
            <select
              value={formData.strActividadFisica}
              onChange={(e) => handleChange("strActividadFisica", e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Seleccionar...</option>
              <option value="Sedentario">Sedentario</option>
              <option value="Ligero">Ligero (1-2 veces/semana)</option>
              <option value="Moderado">Moderado (3-4 veces/semana)</option>
              <option value="Intenso">Intenso (5+ veces/semana)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Gineco-Obstétricos (solo para mujeres) */}
      {esMujer && (
        <div className="border rounded-lg p-6 bg-pink-50">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Baby className="w-5 h-5 text-pink-600" />
            Antecedentes Gineco-Obstétricos
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Menarca (edad de primera menstruación)</Label>
              <Input
                type="number"
                value={formData.intMenarca || ""}
                onChange={(e) => handleChange("intMenarca", parseInt(e.target.value) || null)}
                min="8"
                max="20"
                placeholder="Ej: 12"
              />
            </div>

            <div>
              <Label>Gestas (embarazos)</Label>
              <Input
                type="number"
                value={formData.intGestas}
                onChange={(e) => handleChange("intGestas", parseInt(e.target.value) || 0)}
                min="0"
              />
            </div>

            <div>
              <Label>Partos</Label>
              <Input
                type="number"
                value={formData.intPartos}
                onChange={(e) => handleChange("intPartos", parseInt(e.target.value) || 0)}
                min="0"
              />
            </div>

            <div>
              <Label>Cesáreas</Label>
              <Input
                type="number"
                value={formData.intCesareas}
                onChange={(e) => handleChange("intCesareas", parseInt(e.target.value) || 0)}
                min="0"
              />
            </div>

            <div>
              <Label>Abortos</Label>
              <Input
                type="number"
                value={formData.intAbortos}
                onChange={(e) => handleChange("intAbortos", parseInt(e.target.value) || 0)}
                min="0"
              />
            </div>

            <div>
              <Label>Fecha Última Menstruación (FUM)</Label>
              <Input
                type="date"
                value={formData.datFechaUltimaMenstruacion}
                onChange={(e) => handleChange("datFechaUltimaMenstruacion", e.target.value)}
              />
            </div>

            <div className="md:col-span-3">
              <Label>Método Anticonceptivo Actual</Label>
              <Input
                value={formData.txtMetodoAnticonceptivo}
                onChange={(e) => handleChange("txtMetodoAnticonceptivo", e.target.value)}
                placeholder="Ej: DIU, Píldora, Ninguno..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex gap-3 justify-end border-t pt-4">
        {historia && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setEditMode(false)}
            disabled={saving}
          >
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Guardar Historia Clínica
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
