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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select/select';
import  BreadcrumbSteps   from '@/components/ui/breadcrum-step/BreadcrumbSteps';
import { agendarCita } from '@/app/citas/alta-citas/agendarCita';

export default function altaCitas () {
  const [especialidades, setEspecialidades] = useState<any[]>([]);
  const [doctores, setDoctores] = useState<any[]>([]);


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
            <Input
              value={form.strNombrePaciente}
              onChange={(e) => handleChangeCampo('strNombrePaciente', e.target.value)}
              className={errores.nombre ? 'border-red-500 overflow-auto' : ''}
            />
            {errores.nombre && <p className="text-red-500 text-sm">{errores.nombre}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className='mb-2'>Edad</Label>
              <Input
                type="number"
                value={form.intEdad}
                onChange={(e) => handleChangeCampo('intEdad', e.target.value)}
                className={errores.edad ? 'border-red-500 overflow-auto' : ''}
              />
              {errores.edad && <p className="text-red-500 text-sm">{errores.edad}</p>}
            </div>
            <div>
              <Label className='mb-2'>Genero</Label>
              <Select
                onValueChange={(value) => handleChangeCampo('strGenero', value)}
                value={form.strGenero}          
               >
              <SelectTrigger  className={`w-[150px] h-10 ${errores.especialidad ? 'border-red-500 overflow-auto' : ''} cursor-pointer`}>
                <SelectValue  placeholder="Género" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Masculino">Masculino</SelectItem>
                <SelectItem value="Femenino">Femenino</SelectItem>
                {/* Agrega más si lo deseas */}
              </SelectContent>
            </Select>
             
              {errores.sexo && <p className="text-red-500 text-sm overflow-auto">{errores.sexo}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className='mb-2'>Teléfono</Label>
              <Input
                value={form.strTelefonoPaciente}
                onChange={(e) => handleChangeCampo('strTelefonoPaciente', e.target.value)}
                className={errores.strTelefonoPaciente ? 'border-red-500 overflow-auto' : ''}
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
              />
              {errores.strCorreoPaciente && <p className="text-red-500 text-sm overflow-auto">{errores.strCorreoPaciente}</p>}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className='mb-2'>Especialidad</Label>
            
            <Select
            
                onValueChange={(value) => handleChangeCampo('idEspecialidad', value)}
                value={form.idEspecialidad.toString()}
              >
                <SelectTrigger
                  className={`w-full h-10 ${errores.idEspecialidad ? 'border-red-500 overflow-auto' : ''} cursor-pointer`}
                >
                 <SelectValue  placeholder="Selecciona una especialidad" />
                </SelectTrigger>

                <SelectContent>
                <SelectItem value="0" disabled>
                    Selecciona una especialidad
                    </SelectItem>
                  {especialidades.map((esp: any) => (
                    <SelectItem key={esp.idEspecialidad} value={esp.idEspecialidad.toString()}>
                     {esp.idEspecialidad} - {esp.strNombreEspecialidad}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            {errores.especialidad && <p className="text-red-500 text-sm overflow-auto">{errores.especialidad}</p>}
          </div>
          <div>
            <Label className='mb-2'>Médico</Label>
            <Select
                disabled={!form.idEspecialidad}
                onValueChange={(value) => handleChangeCampo('intDoctor', value)}
                value={form.intDoctor ? form.intDoctor.toString() : ''}
              >
                <SelectTrigger
                  className={`w-full h-10 ${errores.intDoctor ? 'border-red-500 overflow-auto' : ''} cursor-pointer`}
                >
                  <SelectValue placeholder="Selecciona a tu médico" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="0" disabled>
                    Selecciona a tu médico
                  </SelectItem>

                  {doctores.map((doct: any) => (
                    <SelectItem key={doct.intDoctor} value={doct.intDoctor.toString()}>
                      {doct.strNombreDoctor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
          
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