"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export  function LoginImage({ isLogin }: { isLogin: boolean }) {

return (
     <div className="md:w-1/2 w-full bg-blue-950 text-white flex flex-col justify-center items-center p-8">
              <Image
                src={isLogin ? "/doct.svg" : "/loginDoct.png"}
                alt="Bienvenido"
                width={380}
                height={380}
                className="mb-4 float-animation"
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
    );

}