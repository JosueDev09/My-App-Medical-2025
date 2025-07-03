import { useState } from "react";

// Tipos opcionales para TypeScript
interface TabsCompletados {
  dPersonales: boolean;
  dProfesionales: boolean;
  hAtencion: boolean;
  uSistema: boolean;
}

interface FormData {
  nombre: string;
  apellidos: string;
  // Puedes agregar más campos aquí
}

interface Errores {
  [key: string]: string;
}

export function useRegistroDoctor() {
  // Estado de Tabs completos
  const [tabsCompletados, setTabsCompletados] = useState<TabsCompletados>({
    dPersonales: false,
    dProfesionales: false,
    hAtencion: false,
    uSistema: false,
  });

  // ID del doctor
  const [idDoctor, setIdDoctor] = useState<number | null>(null);

  // Datos del formulario
  const [form, setForm] = useState<FormData>({
    nombre: "",
    apellidos: "",
    // Otros campos...
  });

  // Errores
  const [errores, setErrores] = useState<Errores>({});

  // Submit Datos Personales
  const handleSubmitDatosPersonales = async () => {
    try {
      const response = await fetch("/api/crear-doctor", {
        method: "POST",
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (data.idDoctor) {
        setIdDoctor(data.idDoctor);
      }

      setTabsCompletados((prev) => ({
        ...prev,
        dPersonales: true,
      }));
    } catch (error) {
      console.error("Error al guardar datos personales", error);
    }
  };

  // Submit Datos Profesionales
  const handleSubmitDatosProfesionales = async () => {
    if (!idDoctor) {
      alert("Primero guarda los Datos Personales");
      return;
    }

    // Aquí enviarías a tu API usando idDoctor
    setTabsCompletados((prev) => ({
      ...prev,
      dProfesionales: true,
    }));
  };

  return {
    tabsCompletados,
    setTabsCompletados,
    idDoctor,
    setIdDoctor,
    form,
    setForm,
    errores,
    setErrores,
    handleSubmitDatosPersonales,
    handleSubmitDatosProfesionales,
  };
}
