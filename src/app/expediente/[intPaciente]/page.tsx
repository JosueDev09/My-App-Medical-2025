"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import ExpedienteClinico from "@/components/expediente/expediente-clinico";

export default function ExpedientePacientePage() {
  const params = useParams();
  const { data: session } = useSession();
  const [userRole, setUserRole] = useState<string | null>(null);

  const intPaciente = params?.intPaciente as string || "";

  useEffect(() => {
    if (session?.user?.rol) {
      setUserRole(session.user.rol);
    } else {
      const roleMatch = document.cookie.match(/(^| )role=([^;]+)/);
      const role = roleMatch?.[2];
      if (role) {
        setUserRole(role);
      }
    }
  }, [session]);

  return (
    <div className="container mx-auto p-6">
      <ExpedienteClinico intPaciente={parseInt(intPaciente)} />
    </div>
  );
}
