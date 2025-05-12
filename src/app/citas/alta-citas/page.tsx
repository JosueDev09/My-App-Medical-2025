"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input/input";
import { Textarea } from "@/components/ui/textarea/textarea";
import { Button } from "@/components/ui/button/button";
import { Card, CardContent } from "@/components/ui/card/card";
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select/select";
import { Checkbox } from "@/components/ui/checkbox/checkbox";

export default function AgendarCitaForm() {
  const router = useRouter();
  const [especialidad, setEspecialidad] = useState("");
  const [doctor, setDoctor] = useState("");
  const [fechaHora, setFechaHora] = useState("");
  const [motivo, setMotivo] = useState("");
  const [modalidad, setModalidad] = useState("presencial");
  const [notas, setNotas] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aceptaTerminos) {
      alert("Debes aceptar los términos y condiciones.");
      return;
    }
    // Simular guardado y redirigir a pantalla de pago
    console.log({ especialidad, doctor, fechaHora, motivo, modalidad, notas });
    router.push("/pago-cita");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-2xl h-full shadow-md">
        <CardContent className="p-8 space-y-6">
          <h1 className="text-3xl font-bold text-center text-gray-800">
            Agendar Cita Médica
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select onValueChange={setEspecialidad} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una especialidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cardiologia">Cardiología</SelectItem>
                <SelectItem value="pediatria">Pediatría</SelectItem>
                <SelectItem value="dermatologia">Dermatología</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={setDoctor} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un médico" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ana">Dra. Ana López</SelectItem>
                <SelectItem value="carlos">Dr. Carlos Ruiz</SelectItem>
                <SelectItem value="sofia">Dra. Sofía Méndez</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="datetime-local"
              value={fechaHora}
              onChange={(e) => setFechaHora(e.target.value)}
              required
            />

            <Textarea
              placeholder="Motivo de la consulta"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              required
            />

            <Select onValueChange={setModalidad} defaultValue="presencial">
              <SelectTrigger>
                <SelectValue placeholder="Selecciona modalidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="presencial">Presencial</SelectItem>
                <SelectItem value="virtual">Videollamada</SelectItem>
              </SelectContent>
            </Select>

            <Textarea
              placeholder="Notas adicionales (opcional)"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
            />

            <div className="flex items-center space-x-2">
              <Checkbox id="terminos" checked={aceptaTerminos} onCheckedChange={() => setAceptaTerminos(!aceptaTerminos)} />
              <label htmlFor="terminos" className="text-sm text-gray-700">
                Acepto los términos y condiciones
              </label>
            </div>

            <Button type="submit" className="w-full mt-2">
              Continuar al pago
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
