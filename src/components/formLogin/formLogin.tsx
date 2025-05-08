"use client"
import { useState } from "react";
import { useSession } from "next-auth/react";
import { SignIn } from "../ui/signin-google/signin-google";
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';


export function FormLogin(){
  const [strUsuario, setUsuario] = useState("");
  const [strContra, setContra] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { data: session } = useSession({ required: false });
  const [error, setError] = useState("");
   const router = useRouter();

   const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ strUsuario, strContra })
      });
  
      console.log("res", res);
  
      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || "Error al iniciar sesión.");
        return;
      }
  
      const data = await res.json();
      console.log("Token:", data.token);
      router.push("/dashboard");
    } catch (err) {
      console.error("Error al hacer login:", err);
      setError("Error inesperado al iniciar sesión.");
    }
  };

  return (
    <form onSubmit={handleLogin} className="w-full max-w-sm mx-auto">
      
      <div className="mb-4">
          
        <label htmlFor="strUsuario" className="block text-gray-700 text-sm font-bold mb-2">
          Usuario
        </label>
     
        <input
          type="text"
          id="strUsuario"
          value={strUsuario}
          onChange={(e) => setUsuario(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Usuario / Correo"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="strContra" className="block text-gray-700 text-sm font-bold mb-2">
          Contraseña
        </label>
        <input
           type={showPassword ? "text" : "password"}
          id="strContra"
          value={strContra}
          onChange={(e) => setContra(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Contraseña"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="relative top-1/2 ml-[-35px] top-[10px] transform -translate-y-1/2 text-gray-500 hover:text-gray-800"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs italic mt-1 mb-[15px]">{error}</p>}
      <button
          type="submit"
          className="w-full bg-blue-950 text-white py-2 rounded cursor-pointer"
        >
           Entrar
        </button>
        
      <SignIn  />
    </form>
  );
}