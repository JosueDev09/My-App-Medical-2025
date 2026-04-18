import type { NextAuthConfig } from 'next-auth';

// Rutas base y los roles permitidos
const accessControl: Record<string, string[]> = {
  '/dashboard': ['SuperAdmin','Paciente','Doctor'],
  '/medicos/alta-medicos': ['SuperAdmin','Doctor'],
  '/especialidad': ['SuperAdmin','Doctor'],
  '/citas': ['SuperAdmin', 'Doctor', 'Paciente'],
  '/calendario-doctor': ['Doctor','SuperAdmin'],
  '/pacientes': ['Doctor','SuperAdmin'],
  '/contabilidad': ['SuperAdmin'],
  '/contabilidad/pagos': ['SuperAdmin'],
  '/contabilidad/resumen': ['SuperAdmin'],
  '/agenda': ['Doctor','SuperAdmin','Recepcion'],
  '/historial-medico': ['SuperAdmin', 'Doctor', 'Recepcion'],
  '/expedientes': ['SuperAdmin', 'Doctor', 'Recepcion'],
  '/diagnosticos': ['SuperAdmin', 'Doctor']
};

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;
      
      // Permitir acceso a rutas públicas
      if (pathname === '/login' || pathname === '/' || pathname.startsWith('/_next') || pathname.startsWith('/api/auth')) {
        return true;
      }
      
      // Si está en login y ya está autenticado, redirigir a dashboard
      if (pathname === '/login' && isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      
      // Si no está autenticado en ruta protegida, redirigir a login
      if (!isLoggedIn) {
        return false;
      }
      
      // Verificar roles para rutas protegidas
      const userRole = (auth.user as any).rol as string;
      
      for (const path in accessControl) {
        if (pathname.startsWith(path)) {
          const allowedRoles = accessControl[path];
          if (!allowedRoles.includes(userRole)) {
            return Response.redirect(new URL('/no-autorizado', nextUrl));
          }
        }
      }
      
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = parseInt(user.id as string);
        token.rol = (user as any).rol;
        token.username = user.name;
        token.email = user.email;
        token.intDoctor = (user as any).intDoctor;
      }
      return token;
    },
    async session({ session, token }) {
      (session.user.id as any) = token.id as number;
      (session.user.rol as any) = token.rol as string;
      (session.user.name as any) = token.username as string;
      (session.user.email as any) = token.email as string;
      (session.user.intDoctor as any) = token.intDoctor as number;
      return session;
    },
  },
  providers: [], // Los providers se agregan en auth.ts
} satisfies NextAuthConfig;
