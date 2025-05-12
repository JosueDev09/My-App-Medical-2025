'use client';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog/dialog';
import { Input } from '@/components/ui/input/input';
import { Label } from '@/components/ui/label/label';
import { Textarea } from '@/components/ui/textarea/textarea';
import { Button } from '@/components/ui/button/button';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

export default function AgendarCita() {
  const [openAntecedentes, setOpenAntecedentes] = useState(false);
  const router = useRouter();
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

    const cita = {
      ...form,
      antecedentes,
    };

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
      })
      .then(() => {
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
            antecedentesFamiliares: ''
          },
        });
        setAntecedentes({
          medicamentos: '',
          enfermedades: '',
          alergias: '',
          cirugias: '',
          embarazo: '',
          antecedentesFamiliares: ''
        });
      });
      router.push("/resumen-citas");
    } else {
      alert('Error al agendar la cita');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">Agendar Cita Médica</h1>

        <div className="space-y-4">
          <div>
            <Label>Nombre completo</Label>
            <Input
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className={errores.nombre ? 'border-red-500' : ''}
            />
            {errores.nombre && <p className="text-red-500 text-sm">{errores.nombre}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Edad</Label>
              <Input
                type="number"
                value={form.edad}
                onChange={(e) => setForm({ ...form, edad: e.target.value })}
                className={errores.edad ? 'border-red-500' : ''}
              />
              {errores.edad && <p className="text-red-500 text-sm">{errores.edad}</p>}
            </div>
            <div>
              <Label>Sexo</Label>
              <Input
                value={form.sexo}
                onChange={(e) => setForm({ ...form, sexo: e.target.value })}
                className={errores.sexo ? 'border-red-500' : ''}
              />
              {errores.sexo && <p className="text-red-500 text-sm">{errores.sexo}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Teléfono</Label>
              <Input
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                className={errores.telefono ? 'border-red-500' : ''}
              />
              {errores.telefono && <p className="text-red-500 text-sm">{errores.telefono}</p>}
            </div>
            <div>
              <Label>Correo electrónico</Label>
              <Input
                type="email"
                value={form.correo}
                onChange={(e) => setForm({ ...form, correo: e.target.value })}
                className={errores.correo ? 'border-red-500' : ''}
              />
              {errores.correo && <p className="text-red-500 text-sm">{errores.correo}</p>}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Especialidad</Label>
            <Input
              value={form.especialidad}
              onChange={(e) => setForm({ ...form, especialidad: e.target.value })}
              className={errores.especialidad ? 'border-red-500' : ''}
            />
            {errores.especialidad && <p className="text-red-500 text-sm">{errores.especialidad}</p>}
          </div>
          <div>
            <Label>Nombre del médico</Label>
            <Input value={form.medico} onChange={(e) => setForm({ ...form, medico: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Fecha preferida</Label>
              <Input
                type="date"
                value={form.fecha}
                onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                className={errores.fecha ? 'border-red-500' : ''}
              />
              {errores.fecha && <p className="text-red-500 text-sm">{errores.fecha}</p>}
            </div>
            <div>
              <Label>Hora preferida</Label>
              <Input
                type="time"
                value={form.hora}
                onChange={(e) => setForm({ ...form, hora: e.target.value })}
                className={errores.hora ? 'border-red-500' : ''}
              />
              {errores.hora && <p className="text-red-500 text-sm">{errores.hora}</p>}
            </div>
          </div>
          <div>
            <Label>Motivo de consulta</Label>
            <Textarea
              value={form.motivo}
              onChange={(e) => setForm({ ...form, motivo: e.target.value })}
              className={errores.motivo ? 'border-red-500' : ''}
            />
            {errores.motivo && <p className="text-red-500 text-sm">{errores.motivo}</p>}
          </div>
        </div>

        {/* Botón para abrir antecedentes médicos */}
        <div className="flex justify-end">
          <Dialog open={openAntecedentes} onOpenChange={setOpenAntecedentes}>
            <DialogTrigger asChild>
              <Button variant="outline" className='bg-yellow-500 text-white hover:bg-amber-300 hover:text-white cursor-pointer'>Agregar Antecedentes Médicos</Button>
            </DialogTrigger>
            <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Antecedentes Médicos Relevantes</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {/* Medicamentos actuales */}
                      <div>
                        <Label className="flex items-center justify-between p-2">
                          Medicamentos actuales                         
                        </Label>
                        <Input
                          disabled={antecedentes.medicamentos === 'N/A'}
                          value={antecedentes.medicamentos === 'N/A' ? '' : antecedentes.medicamentos}
                          onChange={(e) =>
                            setAntecedentes({ ...antecedentes, medicamentos: e.target.value })
                          }
                        />
                         <input
                              type="checkbox"
                              id="na-medicamentos"
                              className='ml-2'
                              checked={antecedentes.medicamentos === 'N/A'}
                              onChange={(e) =>
                                setAntecedentes({
                                  ...antecedentes,
                                  medicamentos: e.target.checked ? 'N/A' : '',
                                })
                              }
                            />
                            <label className='text-[13px] ml-2' htmlFor="na-medicamentos">No aplica.</label>
                      </div>

                      {/* Enfermedades crónicas */}
                      <div>
                        <Label className="flex items-center justify-between p-2">
                          Enfermedades crónicas                     
                        </Label>
                        <Input
                          disabled={antecedentes.enfermedades === 'N/A'}
                          value={antecedentes.enfermedades === 'N/A' ? '' : antecedentes.enfermedades}
                          onChange={(e) =>
                            setAntecedentes({ ...antecedentes, enfermedades: e.target.value })
                          }
                        />
                          <input
                              type="checkbox"
                              className='ml-2'
                              id="na-enfermedades"
                              checked={antecedentes.enfermedades === 'N/A'}
                              onChange={(e) =>
                                setAntecedentes({
                                  ...antecedentes,
                                  enfermedades: e.target.checked ? 'N/A' : '',
                                })
                              }
                            />
                            <label  className='text-[13px] ml-2' htmlFor="na-enfermedades">No aplica.</label>
                      </div>

                      {/* Repite esta lógica para: alergias, cirugías, embarazo, antecedentes familiares */}
                      <div>
                        <Label className="flex items-center justify-between p-2">
                        Embarazo                       
                        </Label>
                        <Input
                          disabled={antecedentes.embarazo === 'N/A'}
                          value={antecedentes.embarazo === 'N/A' ? '' : antecedentes.embarazo}
                          onChange={(e) =>
                            setAntecedentes({ ...antecedentes, embarazo: e.target.value })
                          }
                        />
                         <input
                              type="checkbox"
                              className='ml-2'
                              id="na-medicamentos"
                              checked={antecedentes.embarazo === 'N/A'}
                              onChange={(e) =>
                                setAntecedentes({
                                  ...antecedentes,
                                  embarazo: e.target.checked ? 'N/A' : '',
                                })
                              }
                            />
                            <label  className='text-[13px] ml-2' htmlFor="na-medicamentos">No aplica.</label>
                      </div>

                      {/* Cirugías previas */}
                      <div>
                        <Label className="flex items-center justify-between p-2">
                        Cirugias Previas                       
                        </Label>
                        <Input
                          disabled={antecedentes.cirugias === 'N/A'}
                          value={antecedentes.cirugias === 'N/A' ? '' : antecedentes.cirugias}
                          onChange={(e) =>
                            setAntecedentes({ ...antecedentes, cirugias: e.target.value })
                          }
                        />
                         <input
                              type="checkbox"
                              id="na-medicamentos"
                              className='ml-2'
                              checked={antecedentes.cirugias === 'N/A'}
                              onChange={(e) =>
                                setAntecedentes({
                                  ...antecedentes,
                                  cirugias: e.target.checked ? 'N/A' : '',
                                })
                              }
                            />
                            <label  className='text-[13px] ml-2' htmlFor="na-medicamentos">No aplica.</label>
                      </div>

                      {/* Ejemplo para alergias */}
                      <div>
                        <Label className="flex items-center justify-between p-2">
                          Alergias
                          
                        </Label>
                        <Input
                          disabled={antecedentes.alergias === 'N/A'}
                          value={antecedentes.alergias === 'N/A' ? '' : antecedentes.alergias}
                          onChange={(e) =>
                            setAntecedentes({ ...antecedentes, alergias: e.target.value })
                          }
                        />
                        <input
                              type="checkbox"
                              id="na-alergias"
                              className='ml-2'
                              checked={antecedentes.alergias === 'N/A'}
                              onChange={(e) =>
                                setAntecedentes({
                                  ...antecedentes,
                                  alergias: e.target.checked ? 'N/A' : '',
                                })
                              }
                            />
                            <label  className='text-[13px] ml-2' htmlFor="na-alergias">No aplica.</label>
                      </div>
                    </div>

                    <DialogFooter className="pt-4">
                      <Button className='bg-blue-500' onClick={() => setOpenAntecedentes(false)}>Guardar y cerrar</Button>
                    </DialogFooter>
                  </DialogContent>

          </Dialog>
        </div>

        {/* Botón final */}
        <div className="text-center pt-4">
          <Button onClick={handleSubmit} className="w-full bg-blue-500 hover:bg-blue-400 cursor-pointer">Agendar cita</Button>
        </div>
      </div>
    </div>
  );
}
