import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const encoder = new TextEncoder();
const secret = encoder.encode(process.env.AUTH_SECRET || 'secret');

export default async function Home() {
  // Verificar si hay token de sesión
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  let isAuthenticated = false;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret);
      
      // Verificar si no está expirado
      if (payload.exp && payload.exp * 1000 > Date.now()) {
        isAuthenticated = true;
      }
    } catch (error) {
      console.log('Token inválido en home page');
    }
  }

  // Si está autenticado, redirigir al dashboard, sino al login
  if (isAuthenticated) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
}
