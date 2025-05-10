"use client";

import { Card, CardContent } from "@/components/ui/card/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs/tabs";
import { BarChart2, DollarSign, ClipboardList } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select/select";

export default function ContabilidadResumen() {
  const [doctorSeleccionado, setDoctorSeleccionado] = useState<string | null>(null);
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Resumen de Contabilidad</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-md">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Ingresos del mes</p>
              <h2 className="text-xl font-semibold text-green-600">$42,300</h2>
            </div>
            <DollarSign className="w-6 h-6 text-green-500" />
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pagos pendientes</p>
              <h2 className="text-xl font-semibold text-red-600">$7,800</h2>
            </div>
            <ClipboardList className="w-6 h-6 text-red-500" />
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total citas cobradas</p>
              <h2 className="text-xl font-semibold text-blue-600">124</h2>
            </div>
            <BarChart2 className="w-6 h-6 text-blue-500" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="mensual" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger className="cursor-pointer" value="mensual">Ingresos mensuales</TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="especialidad">Por especialidad</TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="doctor">Por doctor</TabsTrigger>
        </TabsList>

        <TabsContent value="mensual">
          <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
            [Gráfica mensual aquí]
          </div>
        </TabsContent>

        <TabsContent value="especialidad">
          <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
            [Gráfica por especialidad aquí]
          </div>
        </TabsContent>

        <TabsContent value="doctor">
              <div className="space-y-4">
                <Select onValueChange={(value) => setDoctorSeleccionado(value)}>
                  <SelectTrigger className="w-full max-w-sm cursor-pointer">
                    <SelectValue placeholder="Selecciona un doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="juan">Dr. Juan Pérez</SelectItem>
                    <SelectItem value="ana">Dra. Ana López</SelectItem>
                    <SelectItem value="carlos">Dr. Carlos Ruiz</SelectItem>
                  </SelectContent>
                </Select>

                {doctorSeleccionado && (
                  <Card className="mt-4">
                    <CardContent className="space-y-2">
                      <h2 className="font-bold text-lg text-gray-800">
                        {doctorSeleccionado === "juan" && "Dr. Juan Pérez"}
                        {doctorSeleccionado === "ana" && "Dra. Ana López"}
                        {doctorSeleccionado === "carlos" && "Dr. Carlos Ruiz"}
                      </h2>
                      <p>Citas cobradas: <span className="font-medium">12</span></p>
                      <p>Ingresos: <span className="text-green-600 font-semibold">$5,000</span></p>
                      <p>Pagos pendientes: <span className="text-red-500 font-semibold">$800</span></p>
                    </CardContent>
                  </Card>
                )}
              </div>
          </TabsContent>
      </Tabs>
    </div>
  );
}
