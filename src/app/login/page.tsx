"use client";
import { useState,useEffect } from 'react';
import { useSession} from 'next-auth/react';
import Swal from 'sweetalert2';
import { RegisterGoogle } from "@/components/ui/register-google/register-google";
import { useRouter } from 'next/navigation';
import { LoginImage } from "@/components/images/loginImage";
import { FormLogin } from "@/components/formLogin/formLogin";


export default function LoginPage() {

  const [isLogin, setIsLogin] = useState(true);

  const { data: session, status } = useSession({ required: false });
  const [alertShown, setAlertShown] = useState(false);
  const router = useRouter();


  // useEffect(() => {
  //   if (status === 'authenticated' && session?.user && !alertShown) {
  //     setAlertShown(true);

  //     Swal.fire({
  //       icon: 'warning',
  //       title: 'Sesión activa',
  //       text: 'Ya tienes una sesión iniciada.',
  //       confirmButtonText: 'Entendido',
  //       allowOutsideClick: false,
  //       allowEscapeKey: false,
  //     }).then(() => {
  //       window.location.href = '/dashboard'; // 👈 Redirección después de dar click en "Entendido"
  //     });
  //   }
  // }, [session, status, alertShown]);


  return (
    <div className="flex min-h-screen justify-center items-center px-4">
       <div className="relative bg-white rounded shadow-lg overflow-hidden w-full max-w-4xl h-auto flex flex-col md:flex-row">
        
        {/* Panel de imagen fijo (25%) */}
        
        <LoginImage isLogin={isLogin} />  

        {/* Panel deslizante (75%) */}
        <div className="relative md:w-1/2 w-full overflow-hidden">
          <div
            className={`flex w-[200%] h-full transition-transform duration-700 ease-in-out ${
              isLogin ? 'translate-x-0' : '-translate-x-1/2'
            }`}
          >
            {/* Formulario de Login */}
            <div className="w-full md:w-1/2 p-6 flex flex-col justify-center items-center bg-white">
              <h1 className="text-2xl font-bold mb-4 text-center">Iniciar sesión</h1>
              <FormLogin/>
              <button
                className="mt-4 text-sm text-blue-800 underline cursor-pointer"
                onClick={() => setIsLogin(false)}
              >
                ¿No tienes cuenta? Regístrate
              </button>
            </div>

            {/* Formulario de Registro */}
            <div className="w-full md:w-1/2 p-6 flex flex-col justify-center items-center bg-white">
              <h1 className="text-2xl font-bold mb-4 text-center">Registrarse</h1>
              <form className="space-y-4 w-full max-w-sm">
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
                <RegisterGoogle />
              </form>
              <button
                className="mt-4 text-sm text-blue-800 underline cursor-pointer"
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
