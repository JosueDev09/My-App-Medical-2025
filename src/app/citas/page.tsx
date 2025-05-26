/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useState,useEffect } from "react";
import { Cita } from "@/types/citas";   
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table/table";
//import { Button } from "@/components/ui/button";
import { Pencil, Trash2,User,Calendar,Stethoscope ,Eye , Clock,Activity } from "lucide-react";
import { Button } from "@/components/ui/button/button";
import { useRouter } from "next/navigation";
import formatearFechaLarga from '@/lib/formatterFecha';
import Swal from "sweetalert2";
import { useCitas } from "@/hooks/useCitas";




export default function CitasPage() {
 const {
    citas,
    handleAgregarCita,
    handleVerCita,
    handleEliminarCita,
  } = useCitas();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">📅 Citas Programadas</h1>
      <div className="w-full overflow-x-auto">

     <Button variant="outline" onClick={handleAgregarCita} className="mb-4 cursor-pointer bg-blue-500 text-white hover:bg-blue-400 hover:text-white">Agendar cita </Button> 
      <div className="rounded-xl border shadow-sm overflow-hidden  border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 ">
            <TableHead className="text-left font-semibold border-r border-gray-200">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
                 Paciente
            </div>
            </TableHead>

            <TableHead className="text-left font-semibold border-r border-gray-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
                 Fecha
            </div>
            </TableHead>
            <TableHead className="text-left font-semibold border-r border-gray-200">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
                 Hora
            </div>
            </TableHead>
            <TableHead className="text-left font-semibold border-r border-gray-200">
            <div className="flex items-center gap-2">
              <Stethoscope  className="w-4 h-4 text-muted-foreground" />
                 Doctor
            </div>
            </TableHead>
            <TableHead className="text-left font-semibold border-r border-gray-200">
            <div className="flex items-center gap-2">
              <Activity  className="w-4 h-4 text-muted-foreground" />
                 Especialidad
            </div>
            </TableHead>
            <TableHead className="text-left font-semibold border-r border-gray-200">
            <div className="flex items-center gap-2">
              <Eye  className="w-4 h-4 text-muted-foreground" />
                 Estatus de pago
            </div>
            </TableHead>
              <TableHead className="text-left font-semibold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
           <TableBody>
              {citas.length > 0 ? (
                citas.map((cita,index) => (
                  <TableRow
                   key={cita.intCita ?? `${cita.datFecha}-${cita.intHora}-${index}`}
                   className="hover:bg-muted/10 transition border-gray-200"
                  >
                    <TableCell className="font-medium border-r border-gray-200">
                      {cita.strNombrePaciente}
                    </TableCell>
                    <TableCell className="border-r border-gray-200 uppercase">
                      {formatearFechaLarga(cita.datFecha)}
                    </TableCell>
                    <TableCell className="border-r border-gray-200">
                      {cita.intHora}
                    </TableCell>
                    <TableCell className="border-r border-gray-200">
                      {cita.strNombreDoctor}
                    </TableCell>
                    <TableCell className="border-r border-gray-200">
                      {cita.strNombreEspecialidad}
                    </TableCell>
                    <TableCell className="border-r border-gray-200">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full uppercase ${
                          cita.strEstatusPago === "pagado"
                            ? "bg-green-100 text-green-700"
                            : cita.strEstatusPago === "pendiente"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {cita.strEstatusPago}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Pencil className="w-4 h-4 cursor-pointer" />
                         <a onClick={() => handleEliminarCita(cita.strFolio)}> 
                          <Trash2 className="w-4 h-4 cursor-pointer" />
                         </a>
                        <a onClick={() => handleVerCita(cita.strFolio)}>
                         <Eye className="w-4 h-4 cursor-pointer"  />
                        </a>   

                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No hay citas disponibles.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
        </Table>
      </div>
      </div>
    </div>
  );
}
