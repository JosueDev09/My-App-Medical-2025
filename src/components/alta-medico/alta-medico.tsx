// src/components/forms/FormularioDoctor.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Button } from "../../components/ui/button/button";
import { getInputValidationClasses } from "../../lib/validationsInputs";
import { useRegistroDoctor } from "../../hooks/useRegistroDoctor";
import { Label } from "../../components/ui/label/label";
import { Input } from "../../components/ui/input/input";
import { Textarea } from "../../components/ui/textarea/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select/select";
import { User, Briefcase, Clock, CheckCircle,UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const pasos = [
  { id: "personales", title: "Datos Personales", icon: <User /> },
  { id: "profesionales", title: "Datos Profesionales", icon: <Briefcase /> },
  { id: "horarios", title: "Horarios", icon: <Clock /> },
  { id: "usuario", title: "Usuario", icon: <UserPlus /> },
];

export default function FormularioDoctor() {
  const router = useRouter();

  const {
    form,
    setForm,
    form2,
    setForm2,
    form3,
    setForm3,
    errores,
    handleSubmitDatosPersonales,
    handleSubmitDatosProfesionales,
    form4,
    setForm4,
  } = useRegistroDoctor();

  const [pasoActual, setPasoActual] = useState(0);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [completado, setCompletado] = useState<boolean[]>(Array(pasos.length).fill(false));
  const [finalizado, setFinalizado] = useState(false);

  const siguientePaso = async () => {
    let exito = true;
    if (!exito) return;

    const nuevosCompletados = [...completado];
    nuevosCompletados[pasoActual] = true;
    setCompletado(nuevosCompletados);

    if (pasoActual === pasos.length - 1) {
      setFinalizado(true);
      Swal.fire({
        icon: "success",
        title: "¡Guardado exitosamente!",
        text: "El formulario ha sido completado.",
        confirmButtonColor: "#10B981",
      }).then(() => {
        router.push("/dashboard/doctores");
      });
    } else {
      setPasoActual((prev) => prev + 1);
    }
  };

  const pasoAnterior = () => {
    if (finalizado) return;
    const nuevosCompletados = [...completado];
    nuevosCompletados[pasoActual - 1] = false;
    setCompletado(nuevosCompletados);
    setPasoActual((prev) => Math.max(prev - 1, 0));
  };

  const variants = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <div className="relative h-2 bg-gray-200 rounded-full mb-10 overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-300"
          style={{ width: `${(pasoActual / (pasos.length - 1)) * 100}%` }}
        ></div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between mb-4">
          {pasos.map((paso, index) => (
            <div key={index} className="flex flex-col items-center w-full">
              {completado[index] ? (
                <motion.div
                  className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white text-lg font-bold z-10"
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 0.4 }}
                >
                  <CheckCircle />
                </motion.div>
              ) : (
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold z-10
                    ${index < pasoActual ? "bg-green-500" : index === pasoActual ? "bg-blue-500" : "bg-gray-300"}`}
                >
                  {paso.icon}
                </div>
              )}
              <span className="text-xs text-center mt-1 w-24">{paso.title}</span>
            </div>
          ))}
        </div>
        <p className="text-center font-medium">
          Paso {pasoActual + 1} de {pasos.length}: {pasos[pasoActual].title}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={pasoActual}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          {/* Aquí colocas los formularios paso a paso como ya lo tenías */}

          {/* FORMULARIO PASO 0 */}
          {pasoActual === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-3">Nombre(s)</Label>
                <Input
                  value={form.strNombre}
                  onChange={(e: any) => setForm({ ...form, strNombre: e.target.value })}
                  onBlur={() => setTouched({ ...touched, strNombre: true })}
                  className={getInputValidationClasses(form.strNombre, touched.strNombre, { minLength: 3 })}
                />
              </div>
              <div>
                <Label className="mb-3">Apellidos</Label>
                <Input
                  value={form.strApellidos}
                  onChange={(e: any) => setForm({ ...form, strApellidos: e.target.value })}
                  onBlur={() => setTouched({ ...touched, strApellidos: true })}
                  className={getInputValidationClasses(form.strApellidos, touched.strApellidos, { minLength: 3 })}
                />
              </div>
              <div>
                <Label className="mb-3">Fecha de nacimiento</Label>
                <Input
                  type="date"
                  value={form.datFechaNacimiento ?? ""}
                  onChange={(e: any) => setForm({ ...form, datFechaNacimiento: e.target.value })}
                  onBlur={() => setTouched({ ...touched, datFechaNacimiento: true })}
                  className={getInputValidationClasses(form.datFechaNacimiento ?? "", touched.datFechaNacimiento, {})}
                />
              </div>
              <div>
                <Label className="mb-3">Sexo</Label>
                <select
                  value={form.strSexo}
                  onChange={(e) => setForm({ ...form, strSexo: e.target.value })}
                  onBlur={() => setTouched({ ...touched, strSexo: true })}
                  className={`w-full px-3 py-2 rounded-md border focus:outline-none ${getInputValidationClasses(
                    form.strSexo,
                    touched.strSexo,
                    { minLength: 3 }
                  )}`}
                >
                  <option value="">Seleccionar</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div>
                <Label className="mb-3">Estado</Label>
                <Input
                  value={form.strEstado}
                  onChange={(e: any) => setForm({ ...form, strEstado: e.target.value })}
                  onBlur={() => setTouched({ ...touched, strEstado: true })}
                  className={getInputValidationClasses(form.strEstado, touched.strEstado, { minLength: 3 })}
                />
              </div>
              <div>
                <Label className="mb-3">Ciudad</Label>
                <Input
                  value={form.strCiudad}
                  onChange={(e: any) => setForm({ ...form, strCiudad: e.target.value })}
                  onBlur={() => setTouched({ ...touched, strCiudad: true })}
                  className={getInputValidationClasses(form.strCiudad, touched.strCiudad, { minLength: 3 })}
                />
              </div>
              <div>
                <Label className="mb-3">Correo</Label>
                <Input
                  value={form.strEmail}
                  onChange={(e: any) => setForm({ ...form, strEmail: e.target.value })}
                  onBlur={() => setTouched({ ...touched, strEmail: true })}
                  className={getInputValidationClasses(form.strEmail, touched.strEmail, { minLength: 3 })}
                />
              </div>
              <div>
                <Label className="mb-3">Telefono</Label>
                <Input
                  value={form.strTelefono}
                  onChange={(e: any) => setForm({ ...form, strTelefono: e.target.value })}
                  onBlur={() => setTouched({ ...touched, strTelefono: true })}
                  className={getInputValidationClasses(form.strTelefono, touched.strTelefono, { minLength: 3 })}
                />
              </div>
            </div>
          )}

          {/* FORMULARIO PASO 1 */}
       {pasoActual === 1 && (
            <motion.div
                key="paso1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
                <div>
                <Label className="mb-3">Especialidad</Label>
                <Select
                    value={String(form2.idEspecialidad)}
                    onValueChange={(value) =>
                    setForm2({ ...form2, idEspecialidad: Number(value) })
                    }
                >
                    <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona una especialidad" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="1">Cardiología</SelectItem>
                    <SelectItem value="2">Pediatría</SelectItem>
                    {/* Agrega más especialidades si es necesario */}
                    </SelectContent>
                </Select>
                </div>

                <div>
                <Label className="mb-3">Cédula Profesional</Label>
                <Input
                    value={form2.strCedulaP}
                    onChange={(e) => setForm2({ ...form2, strCedulaP: e.target.value })}
                    onBlur={() => setTouched({ ...touched, strCedulaP: true })}
                    className={getInputValidationClasses(form2.strCedulaP, touched.strCedulaP, { minLength: 5 })}
                />
                </div>

                <div>
                <Label className="mb-3">CURP o RFC</Label>
                <Input
                    value={form2.strCurpRFC}
                    onChange={(e) => setForm2({ ...form2, strCurpRFC: e.target.value })}
                    onBlur={() => setTouched({ ...touched, strCurpRFC: true })}
                    className={getInputValidationClasses(form2.strCurpRFC, touched.strCurpRFC, {})}
                />
                </div>

                <div>
                <Label className="mb-3">Precio de Consulta</Label>
                <Input
                    type="number"
                    value={form2.dblPrecioConsulta}
                    onChange={(e) => setForm2({ ...form2, dblPrecioConsulta: e.target.value })}
                    onBlur={() => setTouched({ ...touched, dblPrecioConsulta: true })}
                    className={getInputValidationClasses(form2.dblPrecioConsulta, touched.dblPrecioConsulta, {})}
                />
                </div>

                <div>
                <Label className="mb-3">Consultorio</Label>
                <Input
                    value={form2.strConsultorio}
                    onChange={(e) => setForm2({ ...form2, strConsultorio: e.target.value })}
                    onBlur={() => setTouched({ ...touched, strConsultorio: true })}
                    className={getInputValidationClasses(form2.strConsultorio, touched.strConsultorio, {})}
                />
                </div>

                <div className="md:col-span-2">
                <Label className="mb-3">Descripción Profesional</Label>
                <Textarea
                    value={form2.strDescripcionDoctor}
                    onChange={(e) => setForm2({ ...form2, strDescripcionDoctor: e.target.value })}
                    onBlur={() => setTouched({ ...touched, strDescripcionDoctor: true })}
                    className={getInputValidationClasses(form2.strDescripcionDoctor, touched.strDescripcionDoctor, {})}
                />
                </div>
            </motion.div>
            )}

         {/* FORMULARIO PASO 2 */}
       {pasoActual === 2 && (
            <motion.div
                key="horarios"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
                <div>
                <Label className="mb-3">Hora de inicio</Label>
                <Input
                    type="time"
                    value={form3.horarioInicio}
                    onChange={(e) =>
                    setForm3({ ...form3, horarioInicio: e.target.value })
                    }
                    onBlur={() =>
                    setTouched({ ...touched, horarioInicio: true })
                    }
                    className={getInputValidationClasses(
                        form3.horarioInicio,
                    touched.horarioInicio,
                    {}
                    )}
                />
                </div>

                <div>
                <Label className="mb-3">Hora de fin</Label>
                <Input
                    type="time"
                    value={form3.horarioFin}
                    onChange={(e) =>
                    setForm3({ ...form3, horarioFin: e.target.value })
                    }
                    onBlur={() =>
                    setTouched({ ...touched, horarioFin: true })
                    }
                    className={getInputValidationClasses(
                        form3.horarioFin,
                    touched.horarioFin,
                    {}
                    )}
                />
                </div>

                <div className="md:col-span-2">
                <Label className="mb-3">Días disponibles</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map((dia) => {
                    const isChecked = form3.diasDisponibles.includes(dia);
                    return (
                        <label
                        key={dia}
                        className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer ${
                            isChecked ? "bg-green-100 border-green-500 text-green-700" : "bg-white border-gray-300"
                        }`}
                        >
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                            const updatedDias = isChecked
                                ? form3.diasDisponibles.filter((d) => d !== dia)
                                : [...form3.diasDisponibles, dia];
                            setForm3({ ...form3, diasDisponibles: updatedDias });
                            }}
                            className="accent-green-600"
                        />
                        {dia}
                        </label>
                    );
                    })}
                </div>
                </div>
            </motion.div>
            )}
         
          {/* FORMULARIO PASO 3 */}
        {pasoActual === 3 && (
                <motion.div
                    key="usuario"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <div>
                    <Label className="mb-3">Nombre de usuario</Label>
                    <Input
                        value={form4.strUsuario}
                        onChange={(e) => setForm4({ ...form4, strUsuario: e.target.value })}
                        onBlur={() => setTouched({ ...touched, strUsuario: true })}
                        className={getInputValidationClasses(form4.strUsuario, touched.strUsuario, { minLength: 3 })}
                    />
                    </div>

                    <div>
                    <Label className="mb-3">Contraseña</Label>
                    <Input
                        type="password"
                        value={form4.strPassword}
                        onChange={(e) => setForm4({ ...form4, strPassword: e.target.value })}
                        onBlur={() => setTouched({ ...touched, strPassword: true })}
                        className={getInputValidationClasses(form4.strPassword, touched.strPassword, { minLength: 6 })}
                    />
                    </div>

                    <div>
                        <Label className="mb-3">Confirmar contraseña</Label>
                        <Input
                            type="password"
                            value={form4.strConfirmPassword}
                            onChange={(e) => setForm4({ ...form4, strConfirmPassword: e.target.value })}
                            onBlur={() => setTouched({ ...touched, strConfirmPassword: true })}
                            className={`${
                            touched.strConfirmPassword &&
                            form4.strConfirmPassword !== form4.strPassword
                                ? "border-red-500 ring-1 ring-red-500"
                                : getInputValidationClasses(form4.strConfirmPassword, touched.strConfirmPassword, { minLength: 6 })
                            }`}
                        />
                        {touched.strConfirmPassword && form4.strConfirmPassword !== form4.strPassword && (
                            <p className="text-red-500 text-sm mt-1">Las contraseñas no coinciden</p>
                        )}
                        </div>

                    <div>
                    <Label className="mb-3">Rol</Label>
                    <select
                        value={form4.strRol}
                        onChange={(e) => setForm4({ ...form4, strRol: e.target.value })}
                        onBlur={() => setTouched({ ...touched, strRol: true })}
                        className={`w-full px-3 py-2 rounded-md border focus:outline-none ${getInputValidationClasses(
                        form4.strRol,
                        touched.strRol,
                        { minLength: 3 }
                        )}`}
                    >
                        <option value="">Seleccionar rol</option>
                        <option value="doctor">Doctor</option>
                        {/* Aquí podrías agregar más roles si deseas */}
                    </select>
                    </div>

                    <div>
                    <Label className="mb-3">Estatus</Label>
                    <select
                        value={form4.strEstadoUsuario}
                        onChange={(e) => setForm4({ ...form4, strEstadoUsuario: e.target.value })}
                        onBlur={() => setTouched({ ...touched, strEstadoUsuario: true })}
                        className={`w-full px-3 py-2 rounded-md border focus:outline-none ${getInputValidationClasses(
                        form4.strEstadoUsuario,
                        touched.strEstadoUsuario,
                        { minLength: 3 }
                        )}`}
                    >
                        <option value="">Seleccionar estado</option>
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                    </select>
                    </div>
                </motion.div>
                )}


        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-10">
        {pasoActual > 0 && <Button onClick={pasoAnterior}>Atrás</Button>}
        <Button onClick={siguientePaso}>{pasoActual === pasos.length - 1 ? "Finalizar" : "Siguiente"}</Button>
      </div>
    </div>
  );
}
