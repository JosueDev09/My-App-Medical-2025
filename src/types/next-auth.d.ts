// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: number;
    rol: string;
    intDoctor?: number;
  }

  interface Session {
    user: {
      id: number;
      rol: string;
      intDoctor?: number;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface JWT {
    id: number;
    rol: string;
    intDoctor?: number;
    username?: string;
  }
}
