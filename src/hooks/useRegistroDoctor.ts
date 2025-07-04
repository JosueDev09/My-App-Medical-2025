import { useState } from "react";
import Swal from "sweetalert2";

// Tipos opcionales para TypeScript
interface TabsCompletados {
  dPersonales: boolean;
  dProfesionales: boolean;
  hAtencion: boolean;
  uSistema: boolean;
}

interface FormData {
  strNombre: string;
  strApellidos: string;
  datFechaNacimiento?: string; // Opcional
  strTelefono?: string; // Opcional
  strEmail?: string; // Opcional
  strSexo?: string; // Opcional
  strCiudad?: string; // Opcional
  strEstado?: string; // Opcional
  strDireccion?: string; // Opcional
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
    const [activeTab, setActiveTab] = useState<string>("dPersonales");

  // ID del doctor
  const [intDoctor, setIntDoctor] = useState<number | null>(null);

  // Datos del formulario
  const [form, setForm] = useState<FormData>({
    strNombre: "",
    strApellidos: "",
    datFechaNacimiento: "", // Puedes inicializarlo como undefined si no es obligatorio
    strTelefono: "",
    strEmail: "",
    strCiudad: "",
    strEstado: "",
    strSexo: "",
    strDireccion: "",

    // Otros campos...
  });

  // Errores
  const [errores, setErrores] = useState<Errores>({});

  const handleTabChange = (value: string) => {
  // Si el tab que quieren abrir está completado, no cambiar
  if (tabsCompletados[value as keyof typeof tabsCompletados]) {
    return;
  }
  setActiveTab(value);
};

  // Submit Datos Personales
  const handleSubmitDatosPersonales = async () => {
    try {
      const response = await fetch("/api/guardar-doctor", {
        method: "POST",
        body: JSON.stringify(form),
      });
      const data = await response.json();



      if(data.success) {
        Swal.fire({
          icon: "success",
          title: "Datos guardados correctamente",
          text: "Los datos personales del doctor se han guardado exitosamente.",
        });
        // Aquí podrías obtener el ID del doctor si tu API lo devuelve
        // setIdDoctor(data.idDoctor); // Asumiendo que tu API devuelve el ID del doctor
        if (data.intDoctor) {
            setIntDoctor(data.intDoctor); // Asumiendo que tu API devuelve el ID del doctor
        }
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
    if (!intDoctor) {
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
    intDoctor,
    setIntDoctor,
    form,
    setForm,
    errores,
    setErrores,
    handleSubmitDatosPersonales,
    handleSubmitDatosProfesionales,
    handleTabChange,
    activeTab, setActiveTab
  };
}
