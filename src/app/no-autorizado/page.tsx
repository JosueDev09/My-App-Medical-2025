"use client";

import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function NoAutorizado() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md w-full">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 text-red-600 rounded-full p-4">
            <Lock className="w-8 h-8" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Acceso denegado</h1>
        <p className="text-gray-600 mb-6">
          No tienes los permisos necesarios para ver esta página.
        </p>
        <button
          onClick={() => router.back()}
          className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
