// hooks/useCitas.ts

import { Cita } from "@/types/citas";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export function useCitas() {
  const router = useRouter();
  const [citas, setCitas] = useState<Cita[]>([]);
  const { data: session, status } = useSession();
  let tipoUsuario = ""; 

  // Cargar citas al montar el componente
  useEffect(() => {
    const cokies = document.cookie;
   // console.log("Cookies:", cokies);
    const hasCustomToken = document.cookie.includes("role=");
    //console.log("Tiene token personalizado:", hasCustomToken);

    
    if(hasCustomToken)  {
      const roleMatch = document.cookie.match(/(^| )role=([^;]+)/);
      tipoUsuario = roleMatch?.[2] || ""; // Obtener el rol del token personalizado
     // console.log("Tipo de usuario desde cookie:", tipoUsuario);
    }


    if(session?.user?.rol && session?.user?.rol !== "undefined") {
    tipoUsuario = session?.user?.rol; // 👈 asume que tienes un rol en el token
   // console.log("Tipo de usuario:", tipoUsuario);
    }

   
    console.log("Tipo de usuario final:", tipoUsuario);
    async function fetchCitas() {
      try {
        if(tipoUsuario === "SuperAdmin") {
           const response = await fetch("/api/citas?tipo=lista-citas-admin");

          if (!response.ok) throw new Error("Error al obtener citas");
          const data: Cita[] = await response.json();
          setCitas(data);
         // console.log("Citas obtenidas:", data);
        }
        if(tipoUsuario === "Paciente") {
           const response = await fetch("/api/citas?tipo=lista-citas-paciente");

          if (!response.ok) throw new Error("Error al obtener citas");
          const data: Cita[] = await response.json();
          setCitas(data);
        }
       
      } catch (error) {
        console.error("Error al obtener las citas:", error);
      }
    
    }fetchCitas();
  }, [status, session]);

  const handleAgregarCita = async () => {
    router.push("/citas/alta-citas");
  };

  const handleVerCita = async (strFolio: string) => {
    try {
      const res = await fetch(`/api/citas/${strFolio}`);
      const data = await res.json();

      if (data[0].strEstatusPago === "pagado") {
        router.push(`/recibo-pago?folio=${strFolio}`);
      } else {
        router.push(`/citas/resumen-citas?folio=${strFolio}`);
      }
    } catch (error) {
      console.error("Error al ver la cita:", error);
    }
  };

  const handleEliminarCita = async (strFolio: string) => {
   
    Swal.fire({
      title: "¿Eliminar cita?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/citas/${strFolio}`, {
            method: "DELETE",
          });

          if (res.ok) {
            router.push("/citas");
            console.log("✅ Cita eliminada");
          } else {
            alert("Error al eliminar la cita");
          }
        } catch (error) {
          console.error("Error al eliminar la cita:", error);
        }
      }
    });
  };

  return {
    citas,
    handleAgregarCita,
    handleVerCita,
    handleEliminarCita,
  };
}
