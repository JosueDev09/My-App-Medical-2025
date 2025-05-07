// middleware.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { auth } from '@/auth'; // Asegúrate de apuntar a tu archivo correcto
import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.AUTH_SECRET! || 'secret'; // Asegúrate de que esto esté definido en tu entorno
//Rutas base y los roles permitidos
const accessControl: Record<string, string[]> = {
  '/dashboard': ['admin','Paciente','Doctor'],
  '/medicos': ['admin','Doctor'],
  '/especialidad': ['admin','Doctor'],
  '/citas': ['admin', 'Doctor', 'Paciente'],
  '/calendario-doctor': ['Doctor'],
  '/pacientes': ['Doctor','admin']
};


export async function middleware(req: NextRequest) {
  
  const session = await auth();
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
 
  //console.log("session", session);
  const userRole = session?.user?.rol; // Asegúrate de que 'role' exista en el tipo 'User'
  const { pathname } = req.nextUrl;
  const payload = jwt.verify(token, JWT_SECRET) as { rol: string };

  // Verifica si la ruta actual necesita control de acceso
  for (const path in accessControl) {
    if (pathname.startsWith(path)) {
      const allowedRoles = accessControl[path];
      if (!allowedRoles.includes(userRole as string) || !allowedRoles.includes(payload.rol  as string)) {
        return NextResponse.redirect(new URL('/no-autorizado', req.url));
      }
    }
  }

  return NextResponse.next();
}

// Define en qué rutas se aplica este middleware
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/medicos/:path*',
    '/especialidad/:path*',
    '/citas/:path*',
    '/calendario-doctor/:path*',
    '/pacientes/:path*',
  ]
};
