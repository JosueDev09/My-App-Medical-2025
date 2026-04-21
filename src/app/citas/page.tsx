/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { Pencil, Trash2,User,Calendar,Stethoscope ,Eye , Clock,Activity, DollarSign } from "lucide-react";
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

  const handleCambiarEstatusPago = async (folio: string, estatusActual: string) => {
    if (estatusActual === "pagado") {
      Swal.fire({
        icon: "info",
        title: "Ya está pagado",
        text: "Esta cita ya está marcada como pagada",
      });
      return;
    }

    const result = await Swal.fire({
      title: "¿Marcar como pagado?",
      text: "¿Deseas marcar esta cita como pagada?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, marcar como pagado",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch("/api/citas/pago", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ strFolio: folio, strEstatusPago: "pagado" }),
        });

        if (!response.ok) throw new Error("Error al actualizar el pago");

        Swal.fire({
          icon: "success",
          title: "¡Pagado!",
          text: "El estatus de pago ha sido actualizado",
          timer: 2000,
        });

        window.location.reload();
      } catch (error) {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo actualizar el estatus de pago",
        });
      }
    }
  };

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
                 Fecha de cita
            </div>
            </TableHead>
            <TableHead className="text-left font-semibold border-r border-gray-200">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
                 Hora de cita
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
              <DollarSign  className="w-4 h-4 text-muted-foreground" />
                 Estatus de pago
            </div>
            </TableHead>
            <TableHead className="text-left font-semibold border-r border-gray-200">
            <div className="flex items-center gap-2">
              <Eye  className="w-4 h-4 text-muted-foreground" />
                 Estatus de cita
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
                      {cita.strNombre} {cita.strApellidos}
                    </TableCell>
                    <TableCell className="border-r border-gray-200">
                      {cita.strNombreEspecialidad}
                    </TableCell>
                    <TableCell className="border-r border-gray-200 text-center">
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
                     <TableCell className="border-r border-gray-200 text-center">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full uppercase ${
                          cita.strEstatusCita === "CONFIRMADA"
                            ? "bg-blue-100 text-blue-700"
                            : cita.strEstatusCita === "PENDIENTE"
                            ? "bg-red-100 text-yellow-700"
                            : cita.strEstatusCita === "FINALIZADA"
                            ? "bg-green-100 text-green-700"
                            :  cita.strEstatusCita === "CANCELADA"
                            ? "bg-red-100 text-red-700"
                            : ""
                        }`}
                      >
                        {cita.strEstatusCita}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {cita.strEstatusPago !== "pagado" && (
                          <button 
                            onClick={() => handleCambiarEstatusPago(cita.strFolio, cita.strEstatusPago)}
                            title="Marcar como pagado"
                          >
                            <DollarSign className="w-4 h-4 cursor-pointer text-green-500 hover:text-green-700" />
                          </button>
                        )}
                        {/* <Pencil className="w-4 h-4 cursor-pointer text-blue-500 hover:text-blue-700" /> */}
                        { cita.strEstatusCita == "FINALIZADA" && (
                           <button onClick={() => handleEliminarCita(cita.strFolio)} disabled > 
                          <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700 " />
                         </button>
                        )}
                        
                        <button onClick={() => handleVerCita(cita.strFolio)}>
                         <Eye className="w-4 h-4 cursor-pointer text-green-500 hover:text-green-700"  />
                        </button>   

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
