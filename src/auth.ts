/* eslint-disable @typescript-eslint/no-explicit-any */


import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

 

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
        token.authType = 'google';
      }
      //console.log("JWT token:", token); // 👈 aquí debes ver id y rol
      return token;
    },
    async session({ session, token }) {
      //console.log("SESSION antes:", session);
      (session.user.id as any) = token.id as number;
      (session.user.rol as any) = token.rol as string;
      (session.user.authType as any) = token.authType as string;
     // console.log("SESSION después:", session);
      return session;
    }
    
  },
}); 