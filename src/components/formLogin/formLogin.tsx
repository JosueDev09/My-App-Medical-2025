"use client"
import { useState } from "react";
import { SignIn } from "../ui/signin-google/signin-google";
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
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ strUsuario, strContra })
      });

      if (!res.ok) {
        const errorData = await res.json();
        setErrorContra(errorData.error || 'Error al iniciar sesión');
        return;
      }
  
      const data = await res.json();

      if (data.error) {
        setErrorContra(data.error);
        return;
      } 
      
      Swal.fire({
        title: "Autenticando datos...",
        allowOutsideClick: false,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        },
      }); 
      
      await esperar(3000);
      router.push("/dashboard");
    
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

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-white text-slate-500">O continúa con</span>
        </div>
      </div>

      {/* Google Sign In */}
      <SignIn />
    </form>
  );
}