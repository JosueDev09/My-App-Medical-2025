"use client";
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { useSearchParams } from "next/navigation";
import { FormLogin } from "@/components/formLogin/formLogin";


export default function LoginPage() {

  const searchParams = useSearchParams();

  useEffect(() => {
    const msg = searchParams?.get("msg");
    if (msg === "auth") {
      Swal.fire({
        icon: "warning",
        title: "Debes iniciar sesión",
        text: "Tu sesion ha caducado.",
        confirmButtonText: "Entendido",
      });
    }
  }, [searchParams]);

  return (
    <div className="h-screen w-full flex fixed inset-0 overflow-hidden">
      {/* Left side - Image/Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-black relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h1 className="text-5xl font-bold mb-4 leading-tight">
              Esymbel Medical
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Sistema integral de gestión médica y expedientes clínicos
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 hover:bg-white/10 rounded-lg p-4 transition-colors cursor-pointer">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">
                  Gestión de Pacientes
                </h3>
                <p className="text-sm text-blue-100">
                  Administra expedientes, consultas y seguimiento de pacientes en un solo lugar
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 hover:bg-white/10 rounded-lg p-4 transition-colors cursor-pointer">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">
                  Calendario de Citas
                </h3>
                <p className="text-sm text-blue-100">
                  Organiza y gestiona citas médicas con recordatorios automáticos
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 hover:bg-white/10 rounded-lg p-4 transition-colors cursor-pointer">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">
                  Expedientes Clínicos
                </h3>
                <p className="text-sm text-blue-100">
                  Historial médico completo con recetas, estudios y evolución del paciente
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 hover:bg-white/10 rounded-lg p-4 transition-colors cursor-pointer">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">
                  Seguridad y Privacidad
                </h3>
                <p className="text-sm text-blue-100">
                  Protección de datos médicos con cifrado y acceso controlado
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-sm text-blue-100">
              &copy; 2026 Esymbel Medical. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Esymbel Medical</h1>
            <p className="text-gray-600">Sistema de gestión médica</p>
          </div>
          <FormLogin />
        </div>
      </div>
    </div>
  );
}
