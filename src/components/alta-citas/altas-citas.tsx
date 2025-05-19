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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select/select';
import  BreadcrumbSteps   from '@/components/ui/breadcrum-step/BreadcrumbSteps';
import { agendarCita } from '@/app/citas/alta-citas/agendarCita';

export default function altaCitas () {

    const {
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
      } = agendarCita();
  
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
              value={form.nombre}
              onChange={(e) => handleChangeCampo('nombre', e.target.value)}
              className={errores.nombre ? 'border-red-500 overflow-auto' : ''}
            />
            {errores.nombre && <p className="text-red-500 text-sm">{errores.nombre}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className='mb-2'>Edad</Label>
              <Input
                type="number"
                value={form.edad}
                onChange={(e) => handleChangeCampo('edad', e.target.value)}
                className={errores.edad ? 'border-red-500 overflow-auto' : ''}
              />
              {errores.edad && <p className="text-red-500 text-sm">{errores.edad}</p>}
            </div>
            <div>
              <Label className='mb-2'>Sexo</Label>
              <Select
             onValueChange={(value) => handleChangeCampo('sexo', value)}
              value={form.sexo}          
               >
              <SelectTrigger  className={`w-[150px] h-10 ${errores.especialidad ? 'border-red-500 overflow-auto' : ''} cursor-pointer`}>
                <SelectValue  placeholder="Género" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Masculino</SelectItem>
                <SelectItem value="F">Femenino</SelectItem>
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
                value={form.telefono}
                onChange={(e) => handleChangeCampo('telefono', e.target.value)}
                className={errores.telefono ? 'border-red-500 overflow-auto' : ''}
              />
              {errores.telefono && <p className="text-red-500 text-sm overflow-auto">{errores.telefono}</p>}
            </div>
            <div>
              <Label className='mb-2'>Correo electrónico</Label>
              <Input
                type="email"
                value={form.correo}
                onChange={(e) => handleChangeCampo('correo', e.target.value)}
                className={errores.correo ? 'border-red-500' : ''}
              />
              {errores.correo && <p className="text-red-500 text-sm overflow-auto">{errores.correo}</p>}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className='mb-2'>Especialidad</Label>
            
          <Select
           onValueChange={(value) => handleChangeCampo('especialidad', value)}
            value={form.especialidad}
          >
            <SelectTrigger  className={`w-full h-10 ${errores.especialidad ? 'border-red-500 overflow-auto' : ''} cursor-pointer `}> 
              <SelectValue placeholder="Selecciona una especialidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Medicina general">Medicina general</SelectItem>
              <SelectItem value="Pediatría">Pediatría</SelectItem>
              <SelectItem value="Ginecología">Ginecología</SelectItem>
              <SelectItem value="Dermatología">Dermatología</SelectItem>
              <SelectItem value="Traumatología">Traumatología</SelectItem>
              <SelectItem value="Psiquiatría">Psiquiatría</SelectItem>
              <SelectItem value="Cardiología">Cardiología</SelectItem>
              {/* Agrega más si lo deseas */}
            </SelectContent>
          </Select>
           
            {errores.especialidad && <p className="text-red-500 text-sm overflow-auto">{errores.especialidad}</p>}
          </div>
          <div>
            <Label className='mb-2'>Médico</Label>
            <Select
           onValueChange={(value) => handleChangeCampo('medico', value)}
            value={form.medico}
          >
            <SelectTrigger  className={`w-full h-10 ${errores.medico ? 'border-red-500 overflow-auto' : ''} cursor-pointer`}> 
              <SelectValue placeholder="Selecciona a tu médico" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Dr. Juan Pérez">Dr. Juan Pérez</SelectItem>
              <SelectItem value="Dra. María López">Dra. María López</SelectItem>
              <SelectItem value="Dr. Carlos García">Dr. Carlos García</SelectItem>
              <SelectItem value="Dra. Ana Torres">Dra. Ana Torres</SelectItem>
              <SelectItem value="Dr. Luis Martínez">Dr. Luis Martínez</SelectItem>
              {/* Agrega más si lo deseas */}
            </SelectContent>
          </Select>
          
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className='mb-2'>Fecha preferida</Label>
              <Input
                type="date"
                value={form.fecha}
                onChange={(e) => handleChangeCampo('fecha', e.target.value)}
                className={errores.fecha ? 'border-red-500 overflow-auto' : ''}
              />
              {errores.fecha && <p className="text-red-500 text-sm ">{errores.fecha}</p>}
            </div>
            <div>
              <Label className='mb-2'>Hora preferida</Label>
              <Input
                type="time"
                value={form.hora}
                onChange={(e) => handleChangeCampo('hora', e.target.value)}
                className={errores.hora ? 'border-red-500 overflow-auto' : ''}
              />
              {errores.hora && <p className="text-red-500 text-sm">{errores.hora}</p>}
            </div>
          </div>
          <div>
            <Label className='mb-2'>Motivo de consulta</Label>
            <Textarea
              value={form.motivo}
              onChange={(e) => handleChangeCampo('motivo', e.target.value)}
              className={errores.motivo ? 'border-red-500 overflow-auto' : ''}
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
        <div className="text-center pt-1">
          <Button onClick={handleSubmit} className="w-[250px] mb-28 bg-blue-500 hover:bg-blue-400 cursor-pointer">Agendar cita</Button>
        </div>
      </div>
    </div>
    );
    }