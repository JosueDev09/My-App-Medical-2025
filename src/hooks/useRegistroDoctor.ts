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
  datFechaNacimiento: string; // Opcional
  strTelefono: string; // Opcional
  strEmail: string; // Opcional
  strSexo: string; // Opcional
  strCiudad: string; // Opcional
  strEstado: string; // Opcional
  strDireccion: string; // Opcional
  // Puedes agregar más campos aquí
}

interface FormData2 {
  idEspecialidad: number;
  strCedulaP: string;
  strCurpRFC: string; // Opcional
  dblPrecioConsulta: string; // Opcional
  strConsultorio: string; // Opcional
  strDescripcionDoctor: string; // Opcional
}

interface FormData3 {
  horarioInicio: string;
  horarioFin: string;
  diasDisponibles: string[];

}

interface FormData4 {
  strUsuario: string;
  strPassword: string;
  strConfirmPassword: string;
  strRol: string;
  strEstadoUsuario: string;
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

   const [form2, setForm2] = useState<FormData2>({
    idEspecialidad: 0,
    strCedulaP: "",
    strCurpRFC: "",
    dblPrecioConsulta:"", // Puedes inicializarlo como undefined si no es obligatorio
    strConsultorio: "",
    strDescripcionDoctor: ""
  });

   const [form3, setForm3] = useState<FormData3>({
    horarioInicio:"",
    horarioFin:"",
    diasDisponibles: [],
  });

    const [form4, setForm4] = useState<FormData4>({
    strUsuario: "",
    strPassword: "",
    strConfirmPassword: "",
    strRol: "",
    strEstadoUsuario: "",

  });

  // Errores
  const [errores, setErrores] = useState<Errores>({});

//   const handleTabChange = (value: string) => {
//   // Si el tab que quieren abrir está completado, no cambiar
//   if (tabsCompletados[value as keyof typeof tabsCompletados]) {
//     return;
//   }
//   setActiveTab(value);
// };

const handleTabChange = (nextTab: string) => {
  if (nextTab === "dProfesionales" && !tabsCompletados.dPersonales) {
   Swal.fire({
      icon: "warning",
      title: "Datos Personales Incompletos",
      text: "Primero completa los Datos Personales del Doctor.",
    });
    return;
  }

  if (nextTab === "hAtencion" && !tabsCompletados.dProfesionales) {
   Swal.fire({
      icon: "warning",
      title: "Datos Profesionales Incompletos",
      text: "Primero completa los Datos Profesionales del Doctor.",
    });
    return;
  }

  if (nextTab === "uSistema" && !tabsCompletados.hAtencion) {
   Swal.fire({
      icon: "warning",
      title: "Datos de Atención Incompletos",
      text: "Primero completa los Datos de Atención del Doctor.",
    });
    return;
  }

  setActiveTab(nextTab);
};

  // Submit Datos Personales
  const handleSubmitDatosPersonales = async () => {
    try {

      // Validación simple de campos obligatorios
      const camposObligatorios: (keyof FormData)[] = [
        "strNombre",
        "strApellidos",
        "datFechaNacimiento",
        "strTelefono",
        "strEmail",
        "strCiudad",
        "strEstado",
        "strSexo",
        "strDireccion",
      ];
      const nuevosErrores: Errores = {};
      camposObligatorios.forEach((campo) => {
        if (!form[campo] || form[campo].trim() === "") {
          nuevosErrores[campo] = "Este campo es obligatorio";
        }
      });
      setErrores(nuevosErrores);
      // Si hay errores, no continuar
      if (Object.keys(nuevosErrores).length > 0) {
        Swal.fire({
          icon: "error",
          title: "Error de validación",
          text: "Por favor, completa todos los campos obligatorios.",
        });                                                 
        return;
      }
      const response = await fetch("/api/Doctor/guardar-doctor", {
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
       
        //console.log("Datos personales guardados:", data);
        if (data.intDoctor > 0) {
          console.log("ID del doctor guardado:", data.intDoctor);
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
     Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, completa primero los Datos Personales del Doctor.",
      });

       console.log("intDoctor", intDoctor);
      return;
    }
      console.log("intDoctor", intDoctor);

    if (!form2.idEspecialidad || form2.idEspecialidad <= 0) {
      Swal.fire({
        icon: "error",
        title: "Error de validación",
        text: "Por favor, selecciona una especialidad válida.",
      });
      return;
    }
    // Validación simple de campos obligatorios
    const camposObligatorios: (keyof FormData2)[] = [
      "idEspecialidad",
      "strCedulaP",
      "strCurpRFC",
      "dblPrecioConsulta",
      "strConsultorio",
      "strDescripcionDoctor",
    ];
    const nuevosErrores: Errores = {};
    camposObligatorios.forEach((campo) => {
      if (!form2[campo] || form2[campo].toString().trim() === "") {
        nuevosErrores[campo] = "Este campo es obligatorio";
      }
    });
    setErrores(nuevosErrores);
    // Si hay errores, no continuar
    if (Object.keys(nuevosErrores).length > 0) {
      Swal.fire({
        icon: "error",
        title: "Error de validación",
        text: "Por favor, completa todos los campos obligatorios.",
      });
    } 
    const response = await fetch("/api/Doctor/guardar-datos-profesionales", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...form2, idDoctor: intDoctor }), // Aquí envías el ID del doctor
    });
    const data = await response.json();
    if (data.success) {
      Swal.fire({
        icon: "success",
        title: "Datos guardados correctamente",
        text: "Los datos profesionales del doctor se han guardado exitosamente.",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al guardar datos",
        text: data.message || "Ocurrió un error al guardar los datos profesionales.",
      });
    }

    // Aquí enviarías a tu API usando idDoctor
    setTabsCompletados((prev) => ({
      ...prev,
      dProfesionales: true,
    }));
  };

    const handleChangeCampo = (campo: keyof typeof form, valor: string) => {
    setForm({ ...form, [campo]: valor });
  
    // Limpia error en tiempo real si el campo es válido
    if (valor.trim() !== '') {
      setErrores((prev) => ({ ...prev, [campo]: '' }));
    }
  };

      const handleChangeCampo2 = (campo: keyof typeof form2, valor: string) => {
    setForm2({ ...form2, [campo]: valor });
  
    // Limpia error en tiempo real si el campo es válido
    if (valor.trim() !== '') {
      setErrores((prev) => ({ ...prev, [campo]: '' }));
    }
  };
   const handleChangeCampo3 = (campo: keyof typeof form3, valor: string) => {
    setForm3({ ...form3, [campo]: valor });
  
    // Limpia error en tiempo real si el campo es válido
    if (valor.trim() !== '') {
      setErrores((prev) => ({ ...prev, [campo]: '' }));
    }
  };

   const handleChangeCampo4 = (campo: keyof typeof form4, valor: string) => {
    setForm4({ ...form4, [campo]: valor });

    // Limpia error en tiempo real si el campo es válido
    if (valor.trim() !== '') {
      setErrores((prev) => ({ ...prev, [campo]: '' }));
    }
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
    activeTab, setActiveTab,
    handleChangeCampo,
    form2,
    setForm2,
    handleChangeCampo2,
    form3,
    setForm3,
    handleChangeCampo3,
    form4,
    setForm4,
    handleChangeCampo4
  };
}
