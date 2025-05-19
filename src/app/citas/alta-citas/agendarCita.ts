'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export function agendarCita() {
    
  const [openAntecedentes, setOpenAntecedentes] = useState(false);
  const router = useRouter();
  const [pasoActual, setPasoActual] = useState(0);

  const [antecedentes, setAntecedentes] = useState({
    medicamentos: '',
    enfermedades: '',
    alergias: '',
    cirugias: '',
    embarazo: '',
    antecedentesFamiliares: '',
  });

  const [form, setForm] = useState({
    nombre: '',
    edad: '',
    sexo: '',
    telefono: '',
    correo: '',
    especialidad: '',
    medico: '',
    fecha: '',
    hora: '',
    motivo: '',
    antecedentes,
  });

  const [errores, setErrores] = useState<{ [key: string]: string }>({});

  const validarFormulario = () => {
    const nuevosErrores: { [key: string]: string } = {};

    if (!form.nombre.trim()) nuevosErrores.nombre = 'Nombre requerido';
    if (!form.edad || isNaN(Number(form.edad))) nuevosErrores.edad = 'Edad inválida';
    if (!form.sexo.trim()) nuevosErrores.sexo = 'Sexo requerido';
    if (!form.telefono.trim() || form.telefono.length < 10) nuevosErrores.telefono = 'Teléfono inválido';
    if (!form.correo.trim() || !/\S+@\S+\.\S+/.test(form.correo)) nuevosErrores.correo = 'Correo inválido';
    if (!form.especialidad.trim()) nuevosErrores.especialidad = 'Especialidad requerida';
    if (!form.fecha) nuevosErrores.fecha = 'Fecha requerida';
    if (!form.hora) nuevosErrores.hora = 'Hora requerida';
    if (!form.motivo.trim()) nuevosErrores.motivo = 'Motivo requerido';

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async () => {
    if (!validarFormulario()) return;

    const cita = { ...form, antecedentes };

    const res = await fetch('/api/citas/crear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cita),
    });

    if (res.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Cita agendada',
        text: 'La cita ha sido agendada exitosamente.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#3085d6',
      }).then(() => {
        setForm({
          nombre: '',
          edad: '',
          sexo: '',
          telefono: '',
          correo: '',
          especialidad: '',
          medico: '',
          fecha: '',
          hora: '',
          motivo: '',
          antecedentes: {
            medicamentos: '',
            enfermedades: '',
            alergias: '',
            cirugias: '',
            embarazo: '',
            antecedentesFamiliares: '',
          },
        });

        setAntecedentes({
          medicamentos: '',
          enfermedades: '',
          alergias: '',
          cirugias: '',
          embarazo: '',
          antecedentesFamiliares: '',
        });

        router.push('/resumen-citas');
      });
    } else {
      alert('Error al agendar la cita');
    }
  };

  const handleChangeCampo = (campo: keyof typeof form, valor: string) => {
    setForm({ ...form, [campo]: valor });
  
    // Limpia error en tiempo real si el campo es válido
    if (valor.trim() !== '') {
      setErrores((prev) => ({ ...prev, [campo]: '' }));
    }
  };

  return {
    openAntecedentes,
    setOpenAntecedentes,
    antecedentes,
    setAntecedentes,
    form,
    setForm,
    errores,
    pasoActual,
    setPasoActual,
    handleSubmit,
    handleChangeCampo
  };
}
