import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';

export interface AuthUser {
  id: number;
  email: string;
  rol: string;
  username: string;
  authType: string;
  intDoctor?: number;
}

/**
 * Obtiene y verifica el usuario autenticado desde el token JWT en cookies
 * @returns Datos del usuario autenticado con información de la BD
 * @throws Error si no hay token, es inválido, o el usuario no existe
 */
export async function getAuthenticatedUser(): Promise<AuthUser> {
  // Obtener token de las cookies
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('token');
  
  if (!tokenCookie) {
    throw new Error('Token no encontrado. Usuario no autenticado');
  }

  // Decodificar el token JWT
  let userData: any;
  try {
    userData = jwt.verify(tokenCookie.value, process.env.AUTH_SECRET || '');
  } catch (error) {
    console.error("Error al verificar token:", error);
    throw new Error('Token inválido');
  }

  const email = userData.email;
  
  if (!email) {
    throw new Error('Email no encontrado en el token');
  }

  // Obtener información adicional del usuario desde la base de datos
  const [userRows]: any = await db.query(
    'SELECT r.strRol, d.intDoctor FROM tbusuarios u INNER JOIN tbroles r ON u.intRol = r.intRol INNER JOIN tbDoctores d ON u.id = d.intUsuario WHERE u.strCorreo = ?',
    [email]
  );

  if (!userRows || userRows.length === 0) {
    throw new Error('Usuario no encontrado en la base de datos');
  }

  const dbUser = userRows[0];

  //console.log("Usuario autenticado:", email, "Rol:", dbUser.strRol);
  return {
    id: userData.id,
    email: userData.email,
    rol: (dbUser.strRol || userData.rol).toLowerCase(),
    username: userData.username,
    authType: userData.authType,
    intDoctor: dbUser.intDoctor
  };
}

/**
 * Verifica si el usuario tiene uno de los roles especificados
 * @param user Usuario autenticado
 * @param allowedRoles Roles permitidos
 * @returns true si el usuario tiene uno de los roles permitidos
 */
export function hasRole(user: AuthUser, allowedRoles: string[]): boolean {
  return allowedRoles.some(role => user.rol === role.toLowerCase());
}
