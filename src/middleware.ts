/* eslint-disable @typescript-eslint/no-explicit-any */
// middleware.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { auth } from '@/auth'; // Asegúrate de apuntar a tu archivo correcto
import { jwtVerify } from 'jose';



const encoder = new TextEncoder();
const secret = encoder.encode(process.env.AUTH_SECRET || 'secret');
//Rutas base y los roles permitidos
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
};


export async function middleware(req: NextRequest) {

  console.log("🛡️ Middleware ejecutado en:", req.nextUrl.pathname);
  const token = req.cookies.get('token')?.value;
  const pathname = req.nextUrl.pathname;

  let userRole: string | null = null;
  let authType: 'credenciales' | 'google' | null = null;


    if (token) {
      try {
        const { payload } = await jwtVerify(token, secret);
    
        // 🔒 Validar expiración manualmente
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          console.warn("⚠️ Token expirado");
          const url = req.nextUrl.clone();
          url.pathname = "/login";
          url.searchParams.set("msg", "auth");
          return NextResponse.redirect(url);
        }
    
        userRole = payload.rol as string;
        authType = 'credenciales';
        console.log('🔐 Token válido (credenciales). Rol:', userRole);
      } catch (err: any) {
        console.warn('❌ Token inválido:', err);
        const url = req.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("msg", "auth");
        return NextResponse.redirect(url);
      }
    }

  // 2. Si no hay token válido, intentar con sesión de NextAuth (Google)
  if (!userRole) {
    const session = await auth();

    if (session?.user) {
      userRole = session.user.rol as string;
      authType = 'google';
      console.log('✅ Sesión con Google. Rol:', userRole);
    }
  }

  // 3. Si no hay sesión válida → login
  if (!userRole) {
    console.log('⛔ Sin sesión, redireccionando a login con mensaje');
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("msg", "auth");
    return NextResponse.redirect(url);
  }

  // 4. Verificar acceso según ruta y rol
  for (const path in accessControl) {
    if (pathname.startsWith(path)) {
      const allowedRoles = accessControl[path];
      if (!allowedRoles.includes(userRole)) {
        console.warn(`🚫 Rol "${userRole}" no autorizado para acceder a "${pathname}"`);
        return NextResponse.redirect(new URL('/no-autorizado', req.url));
      }
    }
  }

  console.log(`🟢 Acceso permitido a "${pathname}" como "${authType}"`);
  return NextResponse.next();
}

// Define en qué rutas se aplica este middleware
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/medicos/alta-medicos:path*',
    '/especialidad/:path*',
    '/citas/:path*',
    '/calendario-doctor/:path*',
    '/pacientes/:path*',
    '/contabilidad/:path*',
    '/contabilidad/pagos/:path*',
    '/contabilidad/resumen/:path*',
    '/agenda/:path*',
    '/historial-medico/:path*'
  ]
};
