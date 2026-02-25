"use client";

import { Card, CardContent, CardHeader, CardTitle  } from "@/components/ui/card/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs/tabs";
import { BarChart2, DollarSign, ClipboardList } from "lucide-react";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis,YAxis,ResponsiveContainer } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/charts/chart"


const chartData = [
  { month: "Enero", ingresos: 186, egresos: 80 },
  { month: "Febrero", ingresos: 305, egresos: 200 },
  { month: "Marzo", ingresos: 237, egresos: 120 },
  { month: "Abril", ingresos: 73, egresos: 190 },
  { month: "Mayo", ingresos: 209, egresos: 130 },
  { month: "Junio", ingresos: 214, egresos: 140 },
];

const chartConfig = {
  ingresos: {
    label: "Ingresos",
    color: "#4ade80",
  },
  egresos: {
    label: "Egresos",
    color: "#f87171",
  },
} satisfies ChartConfig

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
          <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 mt-[120px]">
          <ChartContainer config={chartConfig} className=" w-full  max-w-4xl mx-auto">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart accessibilityLayer data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="ingresos" fill="var(--color-ingresos)" radius={4} />
                  <Bar dataKey="egresos" fill="var(--color-egresos)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </TabsContent>

        <TabsContent value="especialidad">
          <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400  mt-[120px]">
          <ChartContainer config={chartConfig} className="w-full  max-w-4xl mx-auto">
              <BarChart accessibilityLayer data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) =>  value}
                  />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => `$${value}`}
                    />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="ingresos" fill="var(--color-ingresos)" radius={4} />
                  <Bar dataKey="egresos" fill="var(--color-egresos)" radius={4} />
              </BarChart>
          </ChartContainer>
          </div>
        </TabsContent>

        <TabsContent value="doctor">
              <div className="space-y-4">
                <select 
                  onChange={(e) => setDoctorSeleccionado(e.target.value)}
                  className="w-full max-w-sm h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                >
                  <option value="">Selecciona un doctor</option>
                  <option value="juan">Dr. Juan Pérez</option>
                  <option value="ana">Dra. Ana López</option>
                  <option value="carlos">Dr. Carlos Ruiz</option>
                </select>

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
