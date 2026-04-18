import { auth } from '@/auth';

export interface AuthUser {
  id: number;
  email: string | null;
  rol: string;
  username: string | null;
  intDoctor?: number;
}

/**
 * Obtiene y verifica el usuario autenticado desde la sesión de NextAuth
 * @returns Datos del usuario autenticado
 * @throws Error si no hay sesión activa
 */
export async function getAuthenticatedUser(): Promise<AuthUser> {
  const session = await auth();
  
  if (!session?.user) {
    throw new Error('Usuario no autenticado. No hay sesión activa');
  }

  const user = session.user as any;

  return {
    id: user.id,
    email: user.email,
    rol: user.rol,
    username: user.name,
    intDoctor: user.intDoctor
  };
}

/**
 * Verifica si el usuario tiene uno de los roles especificados
 * @param user Usuario autenticado
 * @param allowedRoles Roles permitidos
 * @returns true si el usuario tiene uno de los roles permitidos
 */
export function hasRole(user: AuthUser, allowedRoles: string[]): boolean {
  return allowedRoles.some(role => user.rol.toLowerCase() === role.toLowerCase());
}
