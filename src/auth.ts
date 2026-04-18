/* eslint-disable @typescript-eslint/no-explicit-any */

import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from '@/lib/db'
import bcrypt from 'bcrypt'
import { authConfig } from './auth.config'

function mapRol(intRol: number): string {
  switch (intRol) {
    case 1: return "SuperAdmin";
    case 2: return "Administrador";
    case 3: return "Paciente";
    case 4: return "Doctor";
    default: return "Paciente";
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Usuario", type: "text" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          // Validar usuario usando el stored procedure
          const [spRows]: any = await db.query(
            "CALL sp_ValidarLoginUsuario (?)",
            [credentials.username]
          );
          const user = spRows[0]?.[0];

          if (!user) {
            return null;
          }

          // Verificar contraseña
          const isValidPassword = await bcrypt.compare(
            credentials.password as string,
            user.strContra
          );

          if (!isValidPassword) {
            return null;
          }

          // Si es un doctor, obtener su intDoctor
          let intDoctor = null;
          if (user.intRol === 4) {
            const [doctorRows]: any = await db.query(
              "SELECT intDoctor FROM tbdoctores WHERE intUsuario = ?",
              [user.id]
            );
            if (doctorRows.length > 0) {
              intDoctor = doctorRows[0].intDoctor;
            }
          }

          // Retornar objeto user con todos los datos
          return {
            id: user.id.toString(),
            name: user.strUsuario,
            email: user.strCorreo,
            rol: mapRol(user.intRol),
            intDoctor: intDoctor,
          } as any;
        } catch (error) {
          console.error("Error en authorize:", error);
          return null;
        }
      },
    }),
  ],
}); 