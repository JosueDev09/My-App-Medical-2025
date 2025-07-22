// src/components/forms/FormularioDoctor.tsx
"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import {Button} from "../../components/ui/button/button";
import { getInputValidationClasses } from "../../lib/validationsInputs";
import { useRegistroDoctor } from "../../hooks/useRegistroDoctor";
import {Label} from "../../components/ui/label/label";
import {Input} from "../../components/ui/input/input";
import {Textarea} from "../../components/ui/textarea/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select/select";

const pasos = ["Datos Personales", "Datos Profesionales", "Horarios", "Usuario"];

export default function FormularioDoctor() {
  const {
    form,
    setForm,
    form2,
    setForm2,
    errores,
    handleSubmitDatosPersonales,
    handleSubmitDatosProfesionales,
  } = useRegistroDoctor();

  const [paso, setPaso] = useState(0);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [completado, setCompletado] = useState<boolean[]>(Array(pasos.length).fill(false));

  const siguientePaso = async () => {
    let exito = true;
   // if (paso === 0) exito = await handleSubmitDatosPersonales();
  //  if (paso === 1) exito = await handleSubmitDatosProfesionales();
    if (!exito) return;

    const nuevosCompletados = [...completado];
    nuevosCompletados[paso] = true;
    setCompletado(nuevosCompletados);

    if (paso === pasos.length - 1) {
      Swal.fire({
        icon: "success",
        title: "¡Guardado exitosamente!",
        text: "El formulario ha sido completado.",
        confirmButtonColor: "#10B981"
      });
    } else {
      setPaso((prev) => prev + 1);
    }
  };

  const pasoAnterior = () => {
    setPaso((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      {/* Barra de progreso */}
      <div className="relative h-2 bg-gray-200 rounded-full mb-10 overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-300"
          style={{ width: `${(paso / (pasos.length - 1)) * 100}%` }}
        ></div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between mb-4">
          {pasos.map((titulo, index) => (
            <div key={index} className="flex flex-col items-center w-full">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold z-10
                  ${index < paso ? "bg-green-500" : index === paso ? "bg-blue-500" : "bg-gray-300"}`}
              >
                {completado[index] ? "✓" : index + 1}
              </div>
              <span className="text-xs text-center mt-1 w-24">{titulo}</span>
            </div>
          ))}
        </div>
        <p className="text-center font-medium">
          Paso {paso + 1} de {pasos.length}: {pasos[paso]}
        </p>
      </div>

      {paso === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Nombre(s)</Label>
            <Input
              value={form.strNombre}
              onChange={(e:any) => setForm({ ...form, strNombre: e.target.value })}
              onBlur={() => setTouched({ ...touched, strNombre: true })}
              className={getInputValidationClasses(form.strNombre, touched.strNombre, { minLength: 3 })}
            />
          </div>
          <div>
            <Label>Apellidos</Label>
            <Input
              value={form.strApellidos}
              onChange={(e:any) => setForm({ ...form, strApellidos: e.target.value })}
              onBlur={() => setTouched({ ...touched, strApellidos: true })}
              className={getInputValidationClasses(form.strApellidos, touched.strApellidos, { minLength: 3 })}
            />
          </div>
          <div>
            <Label>Fecha de nacimiento</Label>
            <Input
              type="date"
              value={form.datFechaNacimiento ?? ""}
              onChange={(e:any) => setForm({ ...form, datFechaNacimiento: e.target.value })}
              onBlur={() => setTouched({ ...touched, datFechaNacimiento: true })}
              className={getInputValidationClasses(form.datFechaNacimiento ?? "", touched.datFechaNacimiento, {})}
            />
          </div>
          <div>
            <Label>Sexo</Label>
            <select
              value={form.strSexo}
              onChange={(e) => setForm({ ...form, strSexo: e.target.value })}
              onBlur={() => setTouched({ ...touched, strSexo: true })}
              className={`w-full px-3 py-2 rounded-md border focus:outline-none ${getInputValidationClasses(form.strSexo, touched.strSexo, { minLength: 3 })}`}
            >
              <option value="">Seleccionar</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div>
            <Label>Estado</Label>
            <Input
              value={form.strEstado}
              onChange={(e:any) => setForm({ ...form, strEstado: e.target.value })}
              onBlur={() => setTouched({ ...touched, strEstado: true })}
              className={getInputValidationClasses(form.strEstado, touched.strEstado, { minLength: 3 })}
            />
          </div>
          <div>
            <Label>Ciudad</Label>
            <Input
              value={form.strCiudad}
              onChange={(e:any) => setForm({ ...form, strCiudad: e.target.value })}
              onBlur={() => setTouched({ ...touched, strCiudad: true })}
              className={getInputValidationClasses(form.strCiudad, touched.strCiudad, { minLength: 3 })}
            />
          </div>
        </div>
      )}

      {paso === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Especialidad</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona una especialidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Cardiología</SelectItem>
                <SelectItem value="2">Pediatría</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Cédula Profesional</Label>
            <Input
              value={form2.strCedulaP}
              onChange={(e:any) => setForm2({ ...form2, strCedulaP: e.target.value })}
              onBlur={() => setTouched({ ...touched, strCedulaP: true })}
              className={getInputValidationClasses(form2.strCedulaP, touched.strCedulaP, { minLength: 5 })}
            />
          </div>
        </div>
      )}

      <div className="flex justify-between mt-10">
        {paso > 0 && <Button onClick={pasoAnterior}>Atrás</Button>}
        <Button onClick={siguientePaso}>{paso === pasos.length - 1 ? "Finalizar" : "Siguiente"}</Button>
      </div>
    </div>
  );
}
