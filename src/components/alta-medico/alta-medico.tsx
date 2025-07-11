  
import { Input } from '@/components/ui/input/input';
import { Label } from '@/components/ui/label/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs/tabs";
import { Textarea } from '@/components/ui/textarea/textarea';
import { Button } from '@/components/ui/button/button';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select/select';
import { useRegistroDoctor } from "@/hooks/useRegistroDoctor";
import { cn } from "@/lib/utils"; // O usa clsx si prefieres
import {getInputValidationClasses } from "@/lib/validationsInputs"; // Asegúrate de que esta función esté definida en tu proyecto


export default function altaMedicos() {
  const [especialidades, setEspecialidades] = useState<any[]>([]);
  const [doctores, setDoctores] = useState<any[]>([]);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});


  
    const {
            tabsCompletados,
            setTabsCompletados,
            intDoctor,
            setIntDoctor,
            form,
            setForm,
            errores,
            setErrores,
            handleSubmitDatosPersonales,
            handleSubmitDatosProfesionales,
            activeTab, setActiveTab,
            handleTabChange,
            form2,
            setForm2,
            handleChangeCampo2,
            } = useRegistroDoctor();

          useEffect(() => {
            const cargarEspecialidades = async () => {
              const res = await fetch('/api/citas?tipo=especialidades');
              const data = await res.json();
              setEspecialidades(data[0 ]); // usa tu estado aquí
            };     
            cargarEspecialidades();
          }, []);

         
  
  return (
<div className="w-full  bg-white  rounded-2xl shadow-lg p-8 space-y-2  ">
        <h1 className="text-2xl font-bold text-center mb-[60px]">REGISTRAR DOCTOR</h1>
          
    <Tabs defaultValue="datos" className="w-full" value={activeTab} onValueChange={handleTabChange}>
      <div className='flex justify-between items-center mb-4'>
         <TabsList className="mb-[20px] flex gap-4">
          <TabsTrigger
            value="dPersonales"
            className={cn(
            "cursor-pointer px-4 py-2 rounded transition",
            tabsCompletados.dPersonales
                ? "bg-green-500 text-white data-[state=active]:bg-green-600 cursor-not-allowed"
                : "bg-yellow-300 text-black hover:bg-yellow-400 data-[state=active]:bg-yellow-400"
            )}
        >
            DATOS PERSONALES
        </TabsTrigger>
        </TabsList>

         <TabsList className="mb-[20px] flex gap-4">      
          <TabsTrigger
            value="dProfesionales"
           
           className={cn(
            "cursor-pointer px-4 py-2 rounded transition font-medium",
            tabsCompletados.dProfesionales
                ? "bg-green-500 text-white data-[state=active]:bg-green-600 cursor-not-allowed"
                : "bg-yellow-300 text-black hover:bg-yellow-400 data-[state=active]:bg-yellow-400"
            )}
        >
            DATOS PROFESIONALES
        </TabsTrigger>

        </TabsList>
         <TabsList className="mb-[20px] flex gap-4">
          <TabsTrigger
            value="hAtencion"
            className={cn(
            "cursor-pointer px-4 py-2 rounded transition",
            tabsCompletados.hAtencion
                ? "bg-green-500 text-white data-[state=active]:bg-green-600 cursor-not-allowed"
                : "bg-yellow-300 text-black hover:bg-yellow-400 data-[state=active]:bg-yellow-400"
            )}
        >
            HORARIOS DE ATENCIÓN
        </TabsTrigger>
        </TabsList>

         <TabsList className="mb-[20px] ">       
          <TabsTrigger
            value="uSistema"
            className={cn(
            "cursor-pointer px-4 py-2 rounded transition",
            tabsCompletados.uSistema
                ? "bg-green-500 text-white data-[state=active]:bg-green-600 cursor-not-allowed"
                : "bg-yellow-300 text-black hover:bg-yellow-400 data-[state=active]:bg-yellow-400"
            )}
        >
            USUARIO DEL SISTEMA
        </TabsTrigger>
        </TabsList>
      </div>
        
       <div className="border-b-[0.5px] border-gray-200 mb-[40px] "></div>

        <TabsContent value="dPersonales">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre(s) */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre(s)
                </label>
                <input
                type="text"
                value={form.strNombre}
                onChange={(e) =>
                setForm({ ...form, strNombre: e.target.value })
                }
                placeholder="Ej: Juan Carlos"
                onBlur={() => setTouched({ ...touched, strNombre: true })}
                className={`w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${getInputValidationClasses(form.strNombre, touched.strNombre, { minLength: 3 })}`}
                />
            </div>

            {/* Apellidos */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellidos
                </label>
                <input
                type="text"
                value={form.strApellidos}
                onChange={(e) =>
                setForm({ ...form, strApellidos: e.target.value })
                }
                placeholder="Ej: Pérez Gómez"
                onBlur={() => setTouched({ ...touched, strApellidos: true })}
                className={`w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${getInputValidationClasses(form.strApellidos, touched.strApellidos, { minLength: 3 })}`}
                />
            </div>

            {/* Fecha de nacimiento */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de nacimiento
                </label>
                <input
                type="date"
                value={form.datFechaNacimiento}
                onChange={(e) =>
                setForm({ ...form, datFechaNacimiento: e.target.value})
                }
                onBlur={() => setTouched({ ...touched, datFechaNacimiento: true })}
                className={`w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${getInputValidationClasses(form.datFechaNacimiento, touched.datFechaNacimiento, { minLength: 3 })}`}
                />
            </div>

            {/* Sexo */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Sexo
                </label>
                <select
                    value={form.strSexo}
                    onChange={(e) =>
                    setForm({ ...form, strSexo: e.target.value })
                    }
                    onBlur={() => setTouched({ ...touched, strSexo: true })}
                    className={`w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${getInputValidationClasses(form.strSexo, touched.strSexo, { minLength: 3 })}`}
                >
                    <option value="">Seleccionar sexo</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                </select>
                {/* <p className="text-sm text-gray-500 mt-2">Sexo seleccionado: {form.strSexo}</p> */}
            </div>

            {/* Estado */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
                </label>
                <input
                type="text"
                value={form.strEstado}
                onChange={(e) =>
                setForm({ ...form, strEstado: e.target.value })
                }
                placeholder="Ej: Jalisco"
                onBlur={() => setTouched({ ...touched, strEstado: true })}
                className={`w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${getInputValidationClasses(form.strEstado, touched.strEstado, { minLength: 3 })}`}
                />
            </div>

            {/* Ciudad */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Ciudad
                </label>
                <input
                type="text"
                value={form.strCiudad}
                onChange={(e) =>
                setForm({ ...form, strCiudad: e.target.value })
                }
                placeholder="Ej: Guadalajara"
                onBlur={() => setTouched({ ...touched, strCiudad: true })}
                className={`w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${getInputValidationClasses(form.strCiudad, touched.strCiudad, { minLength: 3 })}`}
                />
            </div>

            {/* Teléfono */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
                </label>
                <input
                type="tel"
                value={form.strTelefono}
                onChange={(e) =>
                setForm({ ...form, strTelefono: e.target.value })
                }
                placeholder="Ej: 3312345678"
                onBlur={() => setTouched({ ...touched, strTelefono: true })}
                className={`w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${getInputValidationClasses(form.strTelefono, touched.strTelefono, { minLength: 3 })}`}
                />
            </div>

            {/* Correo electrónico */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
                </label>
                <input
                type="email"
                value={form.strEmail}
                onChange={(e) =>
                setForm({ ...form, strEmail: e.target.value })
                }
                placeholder="Ej: doctor@correo.com"
                onBlur={() => setTouched({ ...touched, strEmail: true })}
                className={`w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${getInputValidationClasses(form.strEmail, touched.strEmail, { minLength: 3 })}`}
                />
            </div>

            {/* Dirección */}
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
                </label>
                <textarea
                rows={3}
                value={form.strDireccion}
                onChange={(e) =>
                setForm({ ...form, strDireccion: e.target.value })
                }
                placeholder="Calle, número, colonia, código postal"
                onBlur={() => setTouched({ ...touched, strDireccion: true })}
                className={`w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${getInputValidationClasses(form.strDireccion, touched.strDireccion, { minLength: 3 })}`}
                ></textarea>
            </div>
            </div>



                <div className="text-center pt-6">
                <button
                    onClick={handleSubmitDatosPersonales}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded mt-4 cursor-pointer"
                >
                    Guardar Datos Personales
                </button>
                </div>
          
        </TabsContent>

        <TabsContent value="dProfesionales">   
            <div className="space-y-4">
            <div>
                <Label className='mb-2'>ESPECIALIDAD</Label>
                
                <Select
                     onValueChange={(value) => handleChangeCampo2('idEspecialidad', value)}
                     value={form2.idEspecialidad.toString()}
                >
                    <SelectTrigger
                    className={`w-full h-10 ${errores.idEspecialidad ? 'border-red-500 overflow-auto' : ''} cursor-pointer`}
                    >
                    <SelectValue  placeholder="Selecciona una especialidad" />
                    </SelectTrigger>

                    <SelectContent>
                    <SelectItem value="0" disabled>
                        SELECCIONA ESPECIALIDAD.
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
            
                <div className="grid grid-cols-2 gap-4">
                <div>
                <Label className='mb-2'>CEDULA PROFESIONAL</Label>
                <Input
                   type="text"
                    value={form2.strCedulaP}
                    onChange={(e) => handleChangeCampo2('strCedulaP', e.target.value)}
                   onBlur={() => setTouched({ ...touched, strCedulaP: true })}
                   className={`w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${getInputValidationClasses(form2.strCedulaP, touched.strCedulaP, { minLength: 3 })}`}
                />
                {errores.strTelefonoPaciente && <p className="text-red-500 text-sm overflow-auto">{errores.strTelefonoPaciente}</p>}
                </div>
                <div>
                <Label className='mb-2'>CURP O RFC</Label>
                <Input
                    type="text"
                     value={form2.strCurpRFC}
                     onChange={(e) => handleChangeCampo2('strCurpRFC', e.target.value)}
                    onBlur={() => setTouched({ ...touched, strCurpRFC: true })}
                    className={`w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${getInputValidationClasses(form2.strCurpRFC, touched.strCurpRFC, { minLength: 3 })}`}
                />
               
                </div>
                <div>
                <Label className='mb-2'>COSTO POR CONSULTA - $</Label>
                <Input
                    type="text"
                     value={form2.dblPrecioConsulta}
                     onChange={(e) => handleChangeCampo2('dblPrecioConsulta', e.target.value)}
                     onBlur={() => setTouched({ ...touched, dblPrecioConsulta: true })}
                    className={`w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${getInputValidationClasses(form2.dblPrecioConsulta, touched.dblPrecioConsulta, { minLength: 3 })}`}
                />
            
                </div>
                <div>
                <Label className='mb-2'>CONSULTORIO</Label>
                <Input
                    type="text"
                     value={form2.strConsultorio}
                     onChange={(e) => handleChangeCampo2('strConsultorio', e.target.value)}
                     onBlur={() => setTouched({ ...touched, strConsultorio: true })}
                    className={`w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${getInputValidationClasses(form2.strConsultorio, touched.strConsultorio, { minLength: 3 })}`}
                />
                
                </div>
            </div>
            <div>
                <Label className='mb-2'>DESCRIPCION DE PERFIL PROFESIONAL</Label>
                <Textarea
                 value={form2.strDescripcionDoctor}
                 onChange={(e) => handleChangeCampo2('strDescripcionDoctor', e.target.value)}
                 onBlur={() => setTouched({ ...touched, strDescripcionDoctor: true })}
                className={`w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${getInputValidationClasses(form2.strDescripcionDoctor, touched.strDescripcionDoctor, { minLength: 3 })}`}
                />
                
            </div>
            </div>    

              <div className="text-center pt-6">
                <button
                    onClick={handleSubmitDatosProfesionales}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded mt-4 cursor-pointer"
                >
                    Guardar Datos Profesionales
                </button>
                </div> 
        </TabsContent>

        <TabsContent value="hAtencion">
             <div className="space-y-6">
                {/* Días de atención */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            "Lunes",
                            "Martes",
                            "Miércoles",
                            "Jueves",
                            "Viernes",
                            "Sábado",
                            "Domingo",
                        ].map((dia) => (
                            <label
                            key={dia}
                            className="flex items-center cursor-pointer select-none"
                            >
                            <input
                                type="checkbox"
                                className="peer sr-only"
                            />
                            <div
                                className="
                                w-5 h-5 mr-2 flex items-center justify-center
                                rounded border border-gray-300
                                peer-checked:bg-blue-600
                                peer-checked:border-blue-600
                                transition
                                "
                            >
                                {/* Palomita rellena blanca */}
                               
                            </div>
                            <span className="text-sm">{dia}</span>
                            </label>
                        ))}
                        </div>



                {/* Horario inicio y fin */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hora de inicio
                    </label>
                    <input
                        type="time"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hora de fin
                    </label>
                    <input
                        type="time"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    </div>
                </div>

                {/* Duración consulta */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duración de consulta (minutos)
                    </label>
                    <input
                    type="number"
                    min="1"
                    placeholder="Ejemplo: 30"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Notas adicionales */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas sobre disponibilidad
                    </label>
                    <textarea
                    rows={3}
                    placeholder="Ejemplo: No disponible en días festivos..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                </div>
                </div>

        </TabsContent>

        <TabsContent value="uSistema">
              <div className="space-y-6">
                    {/* Nombre de usuario */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre de usuario
                        </label>
                        <input
                        type="text"
                        placeholder="Ej: dr.juanperez"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Contraseña */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contraseña
                        </label>
                        <input
                        type="password"
                        placeholder="********"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Confirmar contraseña */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirmar contraseña
                        </label>
                        <input
                        type="password"
                        placeholder="********"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Rol de usuario */}
                    <div>

                        
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rol de usuario
                        </label>
                        <Select
                                // onValueChange={(value) => handleChangeCampo('idEspecialidad', value)}
                                // value={form.idEspecialidad.toString()}
                            >
                                <SelectTrigger
                                className={`w-full h-10 ${errores.idEspecialidad ? 'border-red-500 overflow-auto' : ''} cursor-pointer`}
                                >
                                <SelectValue  placeholder="Selecciona una especialidad" />
                                </SelectTrigger>

                                <SelectContent>
                                <SelectItem value="0" disabled>
                                    SELECCIONA ESPECIALIDAD.
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

                    {/* Estado de la cuenta */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estado de la cuenta
                        </label>
                        <select
                        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                        </select>
                    </div>
                    </div>

         </TabsContent>
      </Tabs>
      
      </div>
  
    );
    }