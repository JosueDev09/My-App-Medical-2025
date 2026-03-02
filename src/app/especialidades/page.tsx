"use client";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table/table";
import { Pencil, Trash2, Plus, Stethoscope, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog/dialog";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";
import { Textarea } from "@/components/ui/textarea/textarea";

interface Especialidad {
  id: number;
  nombre: string;
  descripcion?: string;
}

export default function EspecialidadesPage() {
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [especialidadActual, setEspecialidadActual] = useState<Especialidad | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: ""
  });

  // Cargar especialidades
  const fetchEspecialidades = async () => {
    try {
      const url = busqueda 
        ? `/api/especialidades?busqueda=${encodeURIComponent(busqueda)}`
        : '/api/especialidades';
      
      const response = await fetch(url);
      if (!response.ok) throw new Error("Error al cargar especialidades");
      
      const data = await response.json();
      setEspecialidades(data.data || []);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al cargar las especialidades");
    }
  };

  useEffect(() => {
    fetchEspecialidades();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEspecialidades();
    }, 300);
    return () => clearTimeout(timer);
  }, [busqueda]);

  // Abrir modal para crear
  const handleNuevo = () => {
    setEspecialidadActual(null);
    setFormData({ nombre: "", descripcion: "" });
    setModalOpen(true);
  };

  // Abrir modal para editar
  const handleEditar = (especialidad: Especialidad) => {
    setEspecialidadActual(especialidad);
    setFormData({
      nombre: especialidad.nombre,
      descripcion: especialidad.descripcion || ""
    });
    setModalOpen(true);
  };

  // Guardar (crear o actualizar)
  const handleGuardar = async () => {
    if (!formData.nombre.trim()) {
      alert("El nombre de la especialidad es requerido");
      return;
    }

    setCargando(true);
    try {
      const url = '/api/especialidades';
      const method = especialidadActual ? 'PUT' : 'POST';
      const body = especialidadActual
        ? { id: especialidadActual.id, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error("Error al guardar");

      await fetchEspecialidades();
      setModalOpen(false);
      alert(especialidadActual ? "Especialidad actualizada" : "Especialidad creada");
    } catch (error) {
      console.error("Error:", error);
      alert("Error al guardar la especialidad");
    } finally {
      setCargando(false);
    }
  };

  // Confirmar eliminación
  const handleConfirmarEliminar = (especialidad: Especialidad) => {
    setEspecialidadActual(especialidad);
    setModalEliminar(true);
  };

  // Eliminar
  const handleEliminar = async () => {
    if (!especialidadActual) return;

    setCargando(true);
    try {
      const response = await fetch(`/api/especialidades?id=${especialidadActual.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error("Error al eliminar");

      await fetchEspecialidades();
      setModalEliminar(false);
      alert("Especialidad eliminada exitosamente");
    } catch (error) {
      console.error("Error:", error);
      alert("Error al eliminar la especialidad. Puede estar en uso.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Stethoscope className="w-6 h-6" />
          Especialidades Médicas
        </h1>
        <Button onClick={handleNuevo} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nueva Especialidad
        </Button>
      </div>

      {/* Buscador */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Buscar especialidad..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabla */}
      <div className="rounded-xl border shadow-sm overflow-hidden border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-left font-semibold border-r border-gray-200">
                ID
              </TableHead>
              <TableHead className="text-left font-semibold border-r border-gray-200">
                Nombre
              </TableHead>
              <TableHead className="text-left font-semibold border-r border-gray-200">
                Descripción
              </TableHead>
              <TableHead className="text-left font-semibold">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {especialidades.length > 0 ? (
              especialidades.map((especialidad) => (
                <TableRow
                  key={especialidad.id}
                  className="hover:bg-muted/10 transition border-gray-200"
                >
                  <TableCell className="font-medium border-r border-gray-200">
                    {especialidad.id}
                  </TableCell>
                  <TableCell className="font-medium border-r border-gray-200">
                    {especialidad.nombre}
                  </TableCell>
                  <TableCell className="border-r border-gray-200">
                    {especialidad.descripcion || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Pencil
                        className="w-4 h-4 cursor-pointer text-blue-500 hover:text-blue-700"
                        onClick={() => handleEditar(especialidad)}
                      />
                      <Trash2
                        className="w-4 h-4 cursor-pointer text-red-500 hover:text-red-700"
                        onClick={() => handleConfirmarEliminar(especialidad)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  No hay especialidades registradas
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal Crear/Editar */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {especialidadActual ? "Editar Especialidad" : "Nueva Especialidad"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Cardiología"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Descripción de la especialidad..."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
              disabled={cargando}
            >
              Cancelar
            </Button>
            <Button onClick={handleGuardar} disabled={cargando}>
              {cargando ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Eliminar */}
      <Dialog open={modalEliminar} onOpenChange={setModalEliminar}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
          </DialogHeader>

          <p className="text-gray-600">
            ¿Está seguro de que desea eliminar la especialidad{" "}
            <span className="font-semibold">{especialidadActual?.nombre}</span>?
          </p>
          <p className="text-sm text-red-600">
            Esta acción no se puede deshacer.
          </p>

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setModalEliminar(false)}
              disabled={cargando}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleEliminar}
              disabled={cargando}
              className="bg-red-600 hover:bg-red-700"
            >
              {cargando ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
