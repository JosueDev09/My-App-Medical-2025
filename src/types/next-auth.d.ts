// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: number;
    rol: string;
  }

  interface Session {
    user: {
      id: number;
      rol: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      authType?: string; // 'credenciales' o 'google'
    };
  }

  interface JWT {
    id: number;
    rol: string;
  }
}
