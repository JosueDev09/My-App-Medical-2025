"use client"
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
 
export function SignIn() {
    return (
        <button
        type="button"
        onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
        className="w-[300px] m-auto mt-[15px]   text-black py-2 rounded justify-center hover:bg-gray-200 transition cursor-pointer flex items-center gap-2 border border-gray-300"
      >
         <Image
        src="/icono-google.svg"
        alt="Google"
        width={20}
        height={20}
        className="inline-block"
      />
        Iniciar sesión con Google
      </button>
      );
}