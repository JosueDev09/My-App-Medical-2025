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

const citas = [
  {
    id: "1",
    paciente: "Juan Pérez",
    fecha: "2025-04-22",
    hora: "10:00 AM",
    doctor: "Dr. Gómez",
    especialidad:"Medico Familiar",
    estado: "Confirmada",
  },
  {
    id: "2",
    paciente: "María López",
    fecha: "2025-04-23",
    hora: "2:00 PM",
    doctor: "Dra. Ramírez",
    especialidad:"Pediatra",
    estado: "Pendiente",
  },
];

export default function CitasPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">📅 Citas Programadas</h1>
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
                 Estado
            </div>
            </TableHead>
              <TableHead className="text-left font-semibold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {citas.map((cita) => (
              <TableRow key={cita.id} className="hover:bg-muted/10 transition  border-gray-200">
                <TableCell className="font-medium border-r  border-gray-200">{cita.paciente}</TableCell>
                <TableCell className="border-r  border-gray-200">{cita.fecha}</TableCell>
                <TableCell className="border-r  border-gray-200">{cita.hora}</TableCell>
                <TableCell className="border-r  border-gray-200">{cita.doctor}</TableCell>
                <TableCell className="border-r  border-gray-200">{cita.especialidad}</TableCell>
                <TableCell className="border-r  border-gray-200">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      cita.estado === "Confirmada"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {cita.estado}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {/* <Button variant="outline" size="icon"> */}
                      <Pencil className="w-4 h-4" />
                    {/* </Button> */}
                    {/* <Button variant="destructive" size="icon"> */}
                      <Trash2 className="w-4 h-4" />
                    {/* </Button> */}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      </div>
    </div>
  );
}
