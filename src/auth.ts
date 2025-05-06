

import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { db } from "@/lib/db"; // tu conexión MySQL
import CredentialsProvider from "next-auth/providers/credentials";
export const runtime = "nodejs";
 

export const { handlers, signIn, signOut, auth } = NextAuth({
  
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  //   CredentialsProvider({
  //     name: "credentials",
  //     credentials: {
  //       identificador: { label: "Correo o Usuario", type: "text" },
  //       password: { label: "Contraseña", type: "password" },
  //     },
  //     async authorize(credentials) {
  //       const { identificador, password } = credentials as {
  //         identificador: string;
  //         password: string;
  //       };

  //      try {
  //        // Llamar al SP que devuelve info + passwordHash
  //       const [spRows]: any = await db.query("CALL sp_ValidarLoginUsuario(?)", [identificador]);
  //       const user = spRows[0]?.[0]; // mysql2 devuelve [[results], fields]
        
  //       console.log("user", user);
  //       if (!user) return null;

       

  //       return {
  //         id: user.id,
  //         name: user.strUsuario,
  //         email: user.strCorreo,
  //         rol: user.intRol,
  //       };
  //     } catch (error) {
  //       console.error("Error en la consulta:", error);
  //       return null; // O maneja el error como prefieras
  //       }
  //     },
  //  }),
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

      const data = await res.json();
      (user as any).id = data.id;   // 5
      (user as any).rol = data.rol; // 'doctor'
      
      // console.log("user", user as any);
        //console.log("data", data);
      
      return true;
    },
    async jwt({ token, user }) {
      
      if (user) {
        //console.log("USER en jwt:", user);
        token.id = (user as any).id;
        token.rol = (user as any).rol;
      }
      //console.log("JWT token:", token); // 👈 aquí debes ver id y rol
      return token;
    },
    async session({ session, token }) {
      //console.log("SESSION antes:", session);
      (session.user.id as any) = token.id as number;
      (session.user.rol as any) = token.rol as string;
     // console.log("SESSION después:", session);
      return session;
    }
    
  },
}); 