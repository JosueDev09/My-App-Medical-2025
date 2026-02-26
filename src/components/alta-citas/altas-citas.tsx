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
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import  BreadcrumbSteps   from '@/components/ui/breadcrum-step/BreadcrumbSteps';
import { agendarCita } from '@/app/citas/alta-citas/agendarCita';
import AutocompletePacientes from '@/components/ui/autocomplete/autocomplete-pacientes';

interface PacienteExistente {
  intPaciente: number;
  strNombre: string;
  strApellidoPaterno: string | null;
  strApellidoMaterno: string | null;
  strEmail: string;
  strTelefono: string;
  strGenero: string;
  datFechaNacimiento: string;
}

export default function altaCitas () {
  const [especialidades, setEspecialidades] = useState<any[]>([]);
  const [doctores, setDoctores] = useState<any[]>([]);
  const [pacienteExistente, setPacienteExistente] = useState<PacienteExistente | null>(null);

  // Función para calcular edad desde fecha de nacimiento
  const calcularEdad = (fechaNacimiento: string): number => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    
    return edad;
  };


    const {
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
      } = agendarCita();

          useEffect(() => {
            const cargarEspecialidades = async () => {
              const res = await fetch('/api/citas?tipo=especialidades');
              const data = await res.json();
              setEspecialidades(data[0 ]); // usa tu estado aquí
            };
          
            cargarEspecialidades();
          }, []);

          useEffect(() => {
            const cargarDoctores = async () => {
              if (!form.idEspecialidad) return;
          
              try {
                const res = await fetch(`/api/citas?tipo=doctores&idEspecialidad=${form.idEspecialidad}`);
                if (!res.ok) throw new Error('Error al cargar doctores');
                const data = await res.json();
                setDoctores(data);
              } catch (error) {
                console.error(error);
              }
            };
          
            cargarDoctores();
          }, [form.idEspecialidad]);
  
  return (
  <div className="flex flex-col items-center justify-center min-h-screen ">
      <div className="w-full max-w-3xl">
      <BreadcrumbSteps pasoActual={0} />
      </div>
      <div className="w-full  bg-white  rounded-2xl shadow-lg p-8 space-y-2  ">
        <h1 className="text-2xl font-bold text-center">Agendar Cita Médica</h1>

        <div className="space-y-4">
          <div>
            <Label className='mb-2'>Nombre completo</Label>
            <AutocompletePacientes
              value={form.strNombrePaciente}
              onChange={(value) => handleChangeCampo('strNombrePaciente', value)}
              onSelectPaciente={(paciente) => {
                setPacienteExistente(paciente);
                if (paciente) {
                  // Auto-completar campos con datos del paciente existente
                  const edad = calcularEdad(paciente.datFechaNacimiento);
                  setForm({
                    ...form,
                    intPaciente: paciente.intPaciente,
                    strNombrePaciente: `${paciente.strNombre} ${paciente.strApellidoPaterno || ''} ${paciente.strApellidoMaterno || ''}`.trim(),
                    strCorreoPaciente: paciente.strEmail,
                    strTelefonoPaciente: paciente.strTelefono,
                    intEdad: edad,
                    strGenero: paciente.strGenero,
                  });
                } else {
                  // Si se deselecciona, limpiar el intPaciente
                  setForm({
                    ...form,
                    intPaciente: 0,
                  });
                }
              }}
              error={errores.strNombrePaciente}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className='mb-2'>Edad</Label>
              <Input
                type="number"
                value={form.intEdad}
                onChange={(e) => handleChangeCampo('intEdad', e.target.value)}
                className={errores.edad ? 'border-red-500 overflow-auto' : ''}
                disabled={!!pacienteExistente}
              />
              {errores.edad && <p className="text-red-500 text-sm">{errores.edad}</p>}
            </div>
            <div>
              <Label className='mb-2'>Genero</Label>
              <select
                onChange={(e) => handleChangeCampo('strGenero', e.target.value)}
                value={form.strGenero}
                className={`w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer ${errores.sexo ? 'border-red-500' : ''} ${pacienteExistente ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                disabled={!!pacienteExistente}
              >
                <option value="">Selecciona género</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
              {errores.sexo && <p className="text-red-500 text-sm">{errores.sexo}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className='mb-2'>Teléfono</Label>
              <Input
                value={form.strTelefonoPaciente}
                onChange={(e) => handleChangeCampo('strTelefonoPaciente', e.target.value)}
                className={errores.strTelefonoPaciente ? 'border-red-500 overflow-auto' : ''}
                disabled={!!pacienteExistente}
              />
              {errores.strTelefonoPaciente && <p className="text-red-500 text-sm overflow-auto">{errores.strTelefonoPaciente}</p>}
            </div>
            <div>
              <Label className='mb-2'>Correo electrónico</Label>
              <Input
                type="email"
                value={form.strCorreoPaciente}
                onChange={(e) => handleChangeCampo('strCorreoPaciente', e.target.value)}
                className={errores.correo ? 'border-red-500' : ''}
                disabled={!!pacienteExistente}
              />
              {errores.strCorreoPaciente && <p className="text-red-500 text-sm overflow-auto">{errores.strCorreoPaciente}</p>}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className='mb-2'>Especialidad</Label>
            <select
              onChange={(e) => handleChangeCampo('idEspecialidad', e.target.value)}
              value={form.idEspecialidad.toString()}
              className={`w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer ${errores.idEspecialidad ? 'border-red-500' : ''}`}
            >
              <option value="0">Selecciona una especialidad</option>
              {especialidades.map((esp: any) => (
                <option key={esp.idEspecialidad} value={esp.idEspecialidad.toString()}>
                  {esp.idEspecialidad} - {esp.strNombreEspecialidad}
                </option>
              ))}
            </select>
            {errores.especialidad && <p className="text-red-500 text-sm">{errores.especialidad}</p>}
          </div>
          <div>
            <Label className='mb-2'>Médico</Label>
            <select
              disabled={!form.idEspecialidad}
              onChange={(e) => handleChangeCampo('intDoctor', e.target.value)}
              value={form.intDoctor ? form.intDoctor.toString() : ''}
              className={`w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed ${errores.intDoctor ? 'border-red-500' : ''}`}
            >
              <option value="">Selecciona a tu médico</option>
              {doctores.map((doct: any) => (
                <option key={doct.intDoctor} value={doct.intDoctor.toString()}>
                  {doct.strNombreDoctor}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className='mb-2'>Fecha preferida</Label>
              <Input
                type="date"
                value={form.datFecha}
                onChange={(e) => handleChangeCampo('datFecha', e.target.value)}
                className={errores.datFecha ? 'border-red-500 overflow-auto' : ''}
              />
              {errores.datFecha && <p className="text-red-500 text-sm ">{errores.datFecha}</p>}
            </div>
            <div>
              <Label className='mb-2'>Hora preferida</Label>
              <Input
                type="time"
                value={form.intHora}
                onChange={(e) => handleChangeCampo('intHora', e.target.value)}
                className={errores.hora ? 'border-red-500 overflow-auto' : ''}
              />
              {errores.intHora && <p className="text-red-500 text-sm">{errores.intHora}</p>}
            </div>
          </div>
          <div>
            <Label className='mb-2'>Motivo de consulta</Label>
            <Textarea
              value={form.strMotivo}
              onChange={(e) => handleChangeCampo('strMotivo', e.target.value)}
              className={errores.motivo ? 'border-red-500 overflow-auto' : ''}
            />
            {errores.strMotivo && <p className="text-red-500 text-sm">{errores.strMotivo}</p>}
          </div>
        </div>

        {/* Botón para abrir antecedentes médicos */}
        {/* <div className="flex justify-end">
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
                      {/* <div>
                        <Label className="flex items-center justify-between p-2">
                          Medicamentos actuales                         
                        </Label>
                        <Input
                          disabled={antecedentes.medicamentos === 'N/A'}
                          value={antecedentes.medicamentos === 'N/A' ? '' : antecedentes.medicamentos}
                          onChange={(e) =>
                            setAntecedentes({ ...antecedentes, medicamentos: e.target.value })
                          }
                        /> */}
                         {/* <input
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
                      </div> */}

                      {/* Enfermedades crónicas */}
                      {/* <div>
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
                      </div> */}

                      {/* Repite esta lógica para: alergias, cirugías, embarazo, antecedentes familiares */}
                      {/* <div>
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
                      </div> */}

                      {/* Cirugías previas */}
                      {/* <div>
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
                      </div> */}

                      {/* Ejemplo para alergias */}
                      {/* <div>
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
                    </div> */}

                    {/* <DialogFooter className="pt-4">
                      <Button className='bg-blue-500' onClick={() => setOpenAntecedentes(false)}>Guardar y cerrar</Button>
                    </DialogFooter>
                  </DialogContent>

          </Dialog> */}
        {/* </div> */} 

        {/* Botón final */}
        <div className="text-center pt-1">
          <Button onClick={handleSubmit} className="w-[250px] mb-28 bg-blue-500 hover:bg-blue-400 cursor-pointer">Agendar cita</Button>
        </div>
      </div>
    </div>
    );
    }