"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import DiagnosticosManager from "@/components/diagnosticos/diagnosticos-manager";

export default function DiagnosticosPage() {
  const { data: session } = useSession();
  const [userRole, setUserRole] = useState<string | null>(null);

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
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">🩺 Diagnósticos CIE-10</h1>
        <p className="text-gray-600 mt-2">
          Catálogo de Clasificación Internacional de Enfermedades (CIE-10)
        </p>
      </div>

      <DiagnosticosManager />
    </div>
  );
}
