"use client";
import { useState,useEffect } from "react";
import { Medico } from "@/types/medicos";   
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table/table";
//import { Button } from "@/components/ui/button";
import { Pencil, Trash2,User,Calendar,Stethoscope ,Eye , Clock,Activity,PhoneCallIcon,Mail,MapPinHouseIcon

 } from "lucide-react";

export default function MedicosPage() {
  const [medicos, setMedicos] = useState<Medico[]>([]);

  /* ---------- Cargar citas al montar ---------- */
  useEffect(() => {
    async function fetchMedicos() {
      try {
        const response = await fetch("/api/medicos");
        if (!response.ok) throw new Error("Network response was not ok");
        const data: Medico[] = await response.json();
        console.log("Datos recibidos:", data[0]);
        setMedicos(data);
      } catch (error) {
        console.error("Error al obtener los medicos:", error);
      }
    }
    fetchMedicos();
  }, []);

return (
  <div className="p-6">
    <h1 className="text-2xl font-semibold mb-6">👨‍⚕️ Medicos</h1>
    <div className="w-full overflow-x-auto">

   
    <div className="rounded-xl border shadow-sm overflow-hidden  border-gray-200">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 ">
          <TableHead className="text-left font-semibold border-r border-gray-200">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
               Doctor
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
            <Activity  className="w-4 h-4 text-muted-foreground" />
               Especialidad
          </div>
          </TableHead>
          <TableHead className="text-left font-semibold border-r border-gray-200">
          <div className="flex items-center gap-2">
            <Eye  className="w-4 h-4 text-muted-foreground" />
               Estatus
          </div>
          </TableHead>
            <TableHead className="text-left font-semibold">Acciones</TableHead>
          </TableRow>
        </TableHeader>
         <TableBody>
            {medicos.length > 0 ? (
              medicos.map((medico) => (
                <TableRow
                  key={medico.id }
                  className="hover:bg-muted/10 transition border-gray-200"
                >
                  <TableCell className="font-medium border-r border-gray-200">
                    {medico.strNombre}
                  </TableCell>
                  <TableCell className="border-r border-gray-200">
                    {medico.strTelefono}
                  </TableCell>
                  <TableCell className="border-r border-gray-200">
                    {medico.strEmail}
                  </TableCell>
                  <TableCell className="border-r border-gray-200">
                    {medico.strDireccion}
                  </TableCell>
                  <TableCell className="border-r border-gray-200">
                    {medico.strEspecialidad}
                  </TableCell>
                  <TableCell className="border-r border-gray-200">
                    {medico.strEstatus}
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
                  No hay medicos.
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
