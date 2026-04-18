"use client"
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';

export function FormLogin(){
  const [errorUsuario, setErrorUsuario] = useState('');
  const [errorContra, setErrorContra] = useState('');
  const [strUsuario, setUsuario] = useState("");
  const [strContra, setContra] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  function esperar(ms:any) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorUsuario('');
    setErrorContra('');
    let hasError = false;

    if (!strUsuario.trim()) {
      setErrorUsuario('El usuario es obligatorio');
      hasError = true;
    }
  
    if (!strContra.trim()) {
      setErrorContra('La contraseña es obligatoria');
      hasError = true;
    }
  
    if (hasError) return;
  
    try {
      Swal.fire({
        title: "Autenticando datos...",
        allowOutsideClick: false,
        showConfirmButton: false,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const result = await signIn("credentials", {
        username: strUsuario,
        password: strContra,
        redirect: false,
        callbackUrl: '/dashboard',
      });

      console.log("Resultado de signIn:", result);

      if (result?.error) {
        Swal.close();
        setErrorContra('Usuario o contraseña incorrectos');
        return;
      }

      if (result?.ok) {
        await esperar(1000);
        Swal.close();
        // Usar window.location para forzar recarga completa y actualización de sesión
        window.location.href = '/dashboard';
      }
    } catch (err) {
      console.error("Error al hacer login:", err);
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al iniciar sesión.",
      });
    }
  };

  return (
    <form onSubmit={handleLogin} className="w-full mx-auto space-y-5">
      {/* Logo y título */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 backdrop-blur-sm">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-white" 
            aria-hidden="true"
          >
            <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path>
          </svg>
        </div>
        <h1 className="text-5xl font-bold mb-4 leading-tight text-gray-900 dark:text-white">
          Bienvenido
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Ingresa tus credenciales para acceder al sistema
        </p>
      </div>
      {/* Campo Usuario */}
      <div className="space-y-2">
        <label htmlFor="strUsuario" className="text-xs font-medium text-slate-600 uppercase tracking-wide">
          Usuario
        </label>
        <input
          type="text"
          id="strUsuario"
          value={strUsuario}
          onChange={(e) => {
            setUsuario(e.target.value);
            setErrorUsuario('');
          }}
          className={`w-full px-4 py-3 bg-slate-50 border-0 rounded-lg text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 transition-all ${
            errorUsuario ? 'ring-2 ring-red-400 bg-red-50' : 'focus:ring-slate-900 focus:bg-white'
          }`}
          placeholder="correo@ejemplo.com"
          required
        />
        {errorUsuario && (
          <p className="text-xs text-red-500 flex items-center gap-1.5">
            <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
            {errorUsuario}
          </p>
        )}
      </div>

      {/* Campo Contraseña */}
      <div className="space-y-2">
        <label htmlFor="strContra" className="text-xs font-medium text-slate-600 uppercase tracking-wide">
          Contraseña
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="strContra"
            value={strContra}
            onChange={(e) => {
              setContra(e.target.value);
              setErrorContra('');
            }}
            className={`w-full px-4 py-3 pr-12 bg-slate-50 border-0 rounded-lg text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 transition-all ${
              errorContra ? 'ring-2 ring-red-400 bg-red-50' : 'focus:ring-slate-900 focus:bg-white'
            }`}
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errorContra && (
          <p className="text-xs text-red-500 flex items-center gap-1.5">
            <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
            {errorContra}
          </p>
        )}
      </div>

      {/* Botón Submit */}
      <button
        type="submit"
        className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium text-sm hover:bg-slate-800 active:scale-[0.99] transition-all shadow-md shadow-slate-900/20 mt-6"
      >
        Iniciar Sesión
      </button>
    </form>
  );
}