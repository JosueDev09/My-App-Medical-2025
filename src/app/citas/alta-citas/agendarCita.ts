/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export function agendarCita() {
    
  const [openAntecedentes, setOpenAntecedentes] = useState(false);
  const router = useRouter();
  const [pasoActual, setPasoActual] = useState(0);

  // const [antecedentes, setAntecedentes] = useState({
  //   medicamentos: '',
  //   enfermedades: '',
  //   alergias: '',
  //   cirugias: '',
  //   embarazo: '',
  //   antecedentesFamiliares: '',
  // });

  const [form, setForm] = useState({
  
    strNombrePaciente:'',
    intEdad: 0 ,
    strGenero:'' ,
    strCorreoPaciente:'' ,
    strTelefonoPaciente:'' ,
    idEspecialidad: 0 ,
    intDoctor: 0 ,
    datFecha:'' ,
    intHora: '0' ,
    //dblTotal:'',
    strMotivo:'' 
  });

  const [errores, setErrores] = useState<{ [key: string]: string }>({});

  const validarFormulario = () => {
    const nuevosErrores: { [key: string]: string } = {};

    if (!form.strNombrePaciente.trim()) nuevosErrores.strNombrePaciente = 'Nombre requerido';
    if (!form.intEdad || isNaN(Number(form.intEdad))) nuevosErrores.intEdad = 'Edad inválida';
    if (!form.strGenero.trim()) nuevosErrores.strGenero = 'Sexo requerido';
    if (!form.strTelefonoPaciente.trim() || form.strTelefonoPaciente.length < 10) nuevosErrores.strTelefonoPaciente = 'Teléfono inválido';
    if (!form.strCorreoPaciente.trim() || !/\S+@\S+\.\S+/.test(form.strCorreoPaciente)) nuevosErrores.strCorreoPaciente = 'Correo inválido';
    if (!form.idEspecialidad) nuevosErrores.idEspecialidad = 'Especialidad requerida';
    if (!form.datFecha) nuevosErrores.datFecha = 'Fecha requerida';
    if (!form.intHora) nuevosErrores.intHora = 'Hora requerida';
    if (!form.strMotivo.trim()) nuevosErrores.strMotivo = 'Motivo requerido';

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async () => {
    if (!validarFormulario()) return;

    const cita = { ...form }; //antecedentes

    const res = await fetch('/api/citas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cita),
    });




    if (res.ok) {
      const nuevaCita = await res.json(); // 👈 obtén la cita
      const folio = nuevaCita.strFolio;
      Swal.fire({
        icon: 'success',
        title: 'Cita agendada',
        text: 'La cita ha sido agendada exitosamente.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#3085d6',
      }).then(() => {
        setForm({
          strNombrePaciente: '0',
          intEdad: 0,
          strGenero: '0',
          strTelefonoPaciente: '0',
          strCorreoPaciente: '0',
          idEspecialidad: 0,
          intDoctor: 0,
          datFecha: '0',
          intHora: '0',
          strMotivo: '0',
      //    dblTotal: '0', // agrega este campo
      //    strFolio: '',  // agrega este campo también
        });

        // setAntecedentes({
        //   medicamentos: '',
        //   enfermedades: '',
        //   alergias: '',
        //   cirugias: '',
        //   embarazo: '',
        //   antecedentesFamiliares: '',
        // });

        router.push(`/citas/resumen-citas?folio=${folio}`);
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
    // antecedentes,
    // setAntecedentes,
    form,
    setForm,
    errores,
    pasoActual,
    setPasoActual,
    handleSubmit,
    handleChangeCampo
  };
}
