"use client";
import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus, Stethoscope, Search, Filter } from "lucide-react";
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
  const [filtroEstado, setFiltroEstado] = useState<"TODOS" | "ACTIVO" | "INACTIVO">("TODOS");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [especialidadActual, setEspecialidadActual] = useState<Especialidad | null>(null);
  const [formData, setFormData] = useState({ nombre: "", descripcion: "" });

  const loadEspecialidades = async (query?: string) => {
    try {
      const url = query ? `/api/especialidades?busqueda=${encodeURIComponent(query)}` : '/api/especialidades';
      const response = (await globalThis.fetch(url)) as Response;
      if (!response.ok) throw new Error("Error al cargar especialidades");
      const data = await response.json();
      setEspecialidades(data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadEspecialidades();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => loadEspecialidades(busqueda), 300);
    return () => clearTimeout(timer);
  }, [busqueda]);

  const handleNuevo = () => {
    setEspecialidadActual(null);
    setFormData({ nombre: "", descripcion: "" });
    setModalOpen(true);
  };

  const handleEditar = (especialidad: Especialidad) => {
    setEspecialidadActual(especialidad);
    setFormData({ nombre: especialidad.nombre, descripcion: especialidad.descripcion || "" });
    setModalOpen(true);
  };

  const handleGuardar = async () => {
    if (!formData.nombre.trim()) {
      alert("El nombre de la especialidad es requerido");
      return;
    }
    setCargando(true);
    try {
      const url = '/api/especialidades';
      const method = especialidadActual ? 'PUT' : 'POST';
      const body = especialidadActual ? { id: especialidadActual.id, ...formData } : formData;
  const response = await globalThis.fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!response.ok) throw new Error("Error al guardar");
  await loadEspecialidades();
      setModalOpen(false);
      alert(especialidadActual ? "Especialidad actualizada" : "Especialidad creada");
    } catch (error) {
      console.error(error);
      alert("Error al guardar la especialidad");
    } finally {
      setCargando(false);
    }
  };

  const handleConfirmarEliminar = (especialidad: Especialidad) => {
    setEspecialidadActual(especialidad);
    setModalEliminar(true);
  };

  const handleEliminar = async () => {
    if (!especialidadActual) return;
    setCargando(true);
    try {
  const response = await globalThis.fetch(`/api/especialidades?id=${especialidadActual.id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error("Error al eliminar");
  await loadEspecialidades();
      setModalEliminar(false);
      alert("Especialidad eliminada exitosamente");
    } catch (error) {
      console.error(error);
      alert("Error al eliminar la especialidad. Puede estar en uso.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Especialidades</h1>
            <p className="text-gray-600 mt-1">Total: {especialidades.length} especialidades</p>
          </div>
          <Button onClick={handleNuevo} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Nueva Especialidad
          </Button>
        </div>

        {/* Barra de búsqueda y filtros (igual que Pacientes) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar especialidad..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10 w-full"
              />
            </div>

            {/* Filtros de estado */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={filtroEstado === "TODOS" ? "default" : "outline"}
                  onClick={() => setFiltroEstado("TODOS")}
                >
                  Todos
                </Button>
                <Button
                  size="sm"
                  variant={filtroEstado === "ACTIVO" ? "default" : "outline"}
                  onClick={() => setFiltroEstado("ACTIVO")}
                  className={filtroEstado === "ACTIVO" ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  Activos
                </Button>
                <Button
                  size="sm"
                  variant={filtroEstado === "INACTIVO" ? "default" : "outline"}
                  onClick={() => setFiltroEstado("INACTIVO")}
                  className={filtroEstado === "INACTIVO" ? "bg-gray-600 hover:bg-gray-700" : ""}
                >
                  Inactivos
                </Button>
              </div>
            </div>
          </div>
        </div>

        {especialidades.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay especialidades registradas</h3>
            <p className="text-gray-600 mb-4">Agrega tu primera especialidad para comenzar</p>
            <Button onClick={handleNuevo} className="bg-blue-600 hover:bg-blue-700">Agregar Especialidad</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {especialidades.map((esp) => (
              <div key={esp.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all">
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 text-lg">{esp.nombre}</h3>
                  <p className="text-sm text-gray-600 mt-2">{esp.descripcion || 'Sin descripción'}</p>
                </div>
                <div className="border-t border-gray-100 p-3 bg-gray-50 rounded-b-lg flex items-center justify-between">
                  <div className="text-sm text-gray-600">ID #{esp.id}</div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditar(esp)} className="p-2 hover:bg-blue-100 rounded-lg transition-colors">
                      <Pencil className="w-4 h-4 text-blue-600" />
                    </button>
                    <button onClick={() => handleConfirmarEliminar(esp)} className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Crear/Editar */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{especialidadActual ? 'Editar Especialidad' : 'Nueva Especialidad'}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre *</Label>
                <Input id="nombre" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} placeholder="Ej: Cardiología" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea id="descripcion" value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} placeholder="Descripción de la especialidad..." className="mt-1" rows={3} />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setModalOpen(false)} disabled={cargando}>Cancelar</Button>
              <Button onClick={handleGuardar} disabled={cargando}>{cargando ? 'Guardando...' : 'Guardar'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal Eliminar */}
        <Dialog open={modalEliminar} onOpenChange={setModalEliminar}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirmar Eliminación</DialogTitle>
            </DialogHeader>
            <p className="text-gray-600">¿Está seguro de que desea eliminar la especialidad <span className="font-semibold">{especialidadActual?.nombre}</span>?</p>
            <p className="text-sm text-red-600">Esta acción no se puede deshacer.</p>
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setModalEliminar(false)} disabled={cargando}>Cancelar</Button>
              <Button onClick={handleEliminar} disabled={cargando} className="bg-red-600 hover:bg-red-700">{cargando ? 'Eliminando...' : 'Eliminar'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
