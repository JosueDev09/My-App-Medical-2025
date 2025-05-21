
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



export default function CitasPage() {
  const router = useRouter();
  const [citas, setCitas] = useState<Cita[]>([]);


    /* ---------- Cargar citas al montar ---------- */
    useEffect(() => {
      async function fetchCitas() {
        try {
          const response = await fetch('/api/citas?tipo=lista-citas');
          if (!response.ok) throw new Error("Network response was not ok");
          const data: Cita[] = await response.json();
          console.log("Datos recibidos:", data[0]);
          setCitas(data);
        } catch (error) {
          console.error("Error al obtener las citas:", error);
        }
      }
      fetchCitas();
    }, []);

   
    const handleAgregarCita = async () => {
     
    await router.push("/citas/alta-citas");
    }

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
                citas.map((cita) => (
                  <TableRow
                    key={cita.intCita ?? `${cita.datFecha}-${cita.intHora}`}
                    className="hover:bg-muted/10 transition border-gray-200"
                  >
                    <TableCell className="font-medium border-r border-gray-200">
                      {cita.strNombrePaciente}
                    </TableCell>
                    <TableCell className="border-r border-gray-200">
                      {cita.datFecha}
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
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          cita.strEstatusPago === "PAGADO"
                            ? "bg-green-100 text-green-700"
                            : cita.strEstatusPago === "PENDIENTE"
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
                        <Trash2 className="w-4 h-4 cursor-pointer" />
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
