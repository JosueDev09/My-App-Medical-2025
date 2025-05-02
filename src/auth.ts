

import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { db } from "@/lib/db"; // tu conexión MySQL
 

export const { handlers, signIn, signOut, auth } = NextAuth({
  
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  secret: process.env.AUTH_SECRET,

  callbacks: {
    async signIn({ user }) {

     // console.log("user", user);
      // Verifica si ya existe el usuario en la tabla
      let tipoAccion = "login";

      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/guardar-usuario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          strCorreo: user.email,
          strNombre: user.name,
        }),
      });
      
      const { tipo } = await res.json(); // 'registro' o 'login'

      // Llama a la API para registrar el log (sin usar headers() aquí)
      await fetch(`${process.env.NEXT_PUBLIC_URL}/api/log-acceso`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          strCorreo: user.email,
          strNombre: user.name,
          tipo: tipoAccion,
        }),
      });

      return true;
    },
  },
});