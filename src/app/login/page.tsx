'use client';
import { useState } from 'react';
import Image from 'next/image';
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const handleLogin = () => {
    signIn("google"); // Esto abrirá la ventana emergente de Google para autenticar al usuario
  };
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex min-h-screen justify-center items-center px-4">
      <div className="relative bg-white rounded shadow-lg overflow-hidden max-w-4xl w-full h-[600px] flex">
        
        {/* Panel de imagen fijo (25%) */}
        <div className="w-1/2 bg-blue-950 text-white flex flex-col justify-center items-center p-8">
          <Image
            src={isLogin ? "/doct.svg" : "/loginDoct.png"}
            alt="Bienvenido"
            width={380}
            height={380}
            className="mb-4"
          />
          <h2 className="text-xl font-semibold mb-2 text-center">
            {isLogin ? 'Bienvenido' : '¡Únete ahora!'}
          </h2>
          <p className="text-center text-sm">
            {isLogin
              ? 'Gestiona tus citas de forma simple y eficiente.'
              : 'Crea tu cuenta para comenzar a gestionar tus citas.'}
          </p>
        </div>

        {/* Panel deslizante (75%) */}
        <div className="relative w-3/4 overflow-hidden">
          <div
            className={`flex w-[200%] h-full transition-transform duration-700 ease-in-out ${
              isLogin ? 'translate-x-0' : '-translate-x-1/2'
            }`}
          >
            {/* Formulario de Login */}
            <div className="w-1/2 p-8 flex flex-col justify-center bg-white">
              <h1 className="text-2xl font-bold mb-4 text-center">Iniciar sesión</h1>
              <form className="space-y-4">
                <input
                  type="email"
                  placeholder="Correo"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="password"
                  placeholder="Contraseña"
                  className="w-full p-2 border rounded"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-950 text-white py-2 rounded"
                >
                  Entrar
                </button>
                <button
                  onClick={handleLogin}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Iniciar sesión con Google
                </button>
              </form>
              <button
                className="mt-4 text-sm text-blue-800 underline"
                onClick={() => setIsLogin(false)}
              >
                ¿No tienes cuenta? Regístrate
              </button>
            </div>

            {/* Formulario de Registro */}
            <div className="w-1/2 p-8 flex flex-col justify-center bg-white">
              <h1 className="text-2xl font-bold mb-4 text-center">Registrarse</h1>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Nombre completo"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="email"
                  placeholder="Correo"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="password"
                  placeholder="Contraseña"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="password"
                  placeholder="Confirmar contraseña"
                  className="w-full p-2 border rounded"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-950 text-white py-2 rounded"
                >
                  Registrarse
                </button>
              </form>
              <button
                className="mt-4 text-sm text-blue-800 underline"
                onClick={() => setIsLogin(true)}
              >
                ¿Ya tienes cuenta? Inicia sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
