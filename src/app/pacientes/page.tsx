"use client";
import { useState,useEffect } from "react";
import { Paciente } from "@/types/pacientes";   
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table/table";
//import { Button } from "@/components/ui/button";
import { Pencil, Trash2,User,Calendar,Stethoscope ,Eye , Clock,Activity,Mail,PhoneCallIcon,MapPinHouseIcon, CalendarFoldIcon } from "lucide-react";


export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  
  /* ---------- Cargar citas al montar ---------- */
  useEffect(() => {
    async function fetchPacientes() {
      try {
        const response = await fetch("/api/pacientes");
        if (!response.ok) throw new Error("Network response was not ok");
        const data: Paciente[] = await response.json();
        console.log("Datos recibidos:", data[0]);
        setPacientes(data);
      } catch (error) {
        console.error("Error al obtener los pacientes:", error);
      }
    }
    fetchPacientes();
  }, []);

return (
  <div className="p-6">
    <h1 className="text-2xl font-semibold mb-6">🧑 Pacientes</h1>
    <div className="w-full overflow-x-auto">

   
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
            <PhoneCallIcon className="w-4 h-4 text-muted-foreground" />
               Telefono
          </div>
          </TableHead>
          <TableHead className="text-left font-semibold border-r border-gray-200">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
               Correo
          </div>
          </TableHead>
          <TableHead className="text-left font-semibold border-r border-gray-200">
          <div className="flex items-center gap-2">
            <MapPinHouseIcon  className="w-4 h-4 text-muted-foreground" />
               Direccion
          </div>
          </TableHead>
          <TableHead className="text-left font-semibold border-r border-gray-200">
          <div className="flex items-center gap-2">
            <CalendarFoldIcon  className="w-4 h-4 text-muted-foreground" />
               Fecha Nacimiento
          </div>
          </TableHead>
          <TableHead className="text-left font-semibold border-r border-gray-200">
          <div className="flex items-center gap-2">
            <Eye  className="w-4 h-4 text-muted-foreground" />
               Estado
          </div>
          </TableHead>
            <TableHead className="text-left font-semibold">Acciones</TableHead>
          </TableRow>
        </TableHeader>
         <TableBody>
            {pacientes.length > 0 ? (
              pacientes.map((paciente) => (
                <TableRow
                  key={paciente.id }
                  className="hover:bg-muted/10 transition border-gray-200"
                >
                  <TableCell className="font-medium border-r border-gray-200">
                    {paciente.strNombre}
                  </TableCell>
                  <TableCell className="border-r border-gray-200">
                    {paciente.strTelefono}
                  </TableCell>
                  <TableCell className="border-r border-gray-200">
                    {paciente.strEmail}
                  </TableCell>
                  <TableCell className="border-r border-gray-200">
                    {paciente.strDireccion}
                  </TableCell>
                  <TableCell className="border-r border-gray-200">
                    {paciente.datFechaNacimiento}
                  </TableCell>                
                  <TableCell>
                    <div className="flex gap-2">
                      <Pencil className="w-4 h-4 cursor-pointer" />
                      <Trash2 className="w-4 h-4 cursor-pointer" />
                    </div>
                  </TableCell>

                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No hay pacientes.
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
  

  
