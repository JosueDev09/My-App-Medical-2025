"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card/card";
import { Input } from "@/components/ui/input/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table/table";
import { Badge } from "@/components/ui/badge/badge";

const pagosMock = [
  {
    paciente: "Juan Pérez",
    doctor: "Dra. Ana López",
    fecha: "2025-05-08",
    monto: 500,
    estado: "pagado",
    metodo: "Transferencia"
  },
  {
    paciente: "María García",
    doctor: "Dr. Carlos Ruiz",
    fecha: "2025-05-07",
    monto: 300,
    estado: "pendiente",
    metodo: "-"
  },
];

export default function ContabilidadPagos() {
  const [filtro, setFiltro] = useState("");

  const pagosFiltrados = pagosMock.filter((pago) =>
    pago.paciente.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Pagos registrados</h1>

      <Input
        placeholder="Buscar por paciente..."
        className="max-w-sm"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagosFiltrados.map((pago, i) => (
                <TableRow key={i}>
                  <TableCell>{pago.paciente}</TableCell>
                  <TableCell>{pago.doctor}</TableCell>
                  <TableCell>{pago.fecha}</TableCell>
                  <TableCell className="text-green-700 font-medium">${pago.monto}</TableCell>
                  <TableCell>{pago.metodo}</TableCell>
                  <TableCell>
                    <Badge variant={pago.estado === "pagado" ? "success" : "destructive"}>
                      {pago.estado}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
