'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import NavLink from './nav-link';
import {LayoutDashboard,Calendar,Users,Stethoscope,User, Activity} from "lucide-react";
import { useSession } from 'next-auth/react';
import { jwtDecode } from 'jwt-decode'; // ✅ CORRECTO


 // Este valor debe provenir del sistema de autenticación
 interface DecodedToken {
  rol: string;
  exp: number;
  [key: string]: any;
}

const routes = [
  { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, roles: ['SuperAdmin', 'doctor','Paciente'] },
  { name: 'Citas', path: '/citas', icon: <Calendar size={20} />, roles: ['SuperAdmin', 'doctor','Paciente'] },
  { name: 'Pacientes', path: '/pacientes', icon: <Users size={20} />, roles: ['SuperAdmin', 'doctor'] },
  { name: 'Médicos', path: '/medicos', icon: <Stethoscope size={20} />, roles: ['SuperAdmin'] },
  { name: 'Especialidades', path: '/especialidad', icon: <Activity size={20} />, roles: ['SuperAdmin'] },
  { name: 'Calendario', path: '/calendario-doctor', icon: <Calendar size={20} />, roles: ['doctor','SuperAdmin'] },
];

// Filtra las rutas según el rol del usuario

export default function Sidebar({isOpen,onToggle,sidebarRef,}: {isOpen: boolean;onToggle: () => void; sidebarRef: React.RefObject<HTMLDivElement | null>;}) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [userRole, setUserRole] = useState<string | null>(null);


  useEffect(() => {
    if (session?.user?.rol) {
      setUserRole(session.user.rol.toLowerCase());
    } else {
      const roleMatch = document.cookie.match(/(^| )role=([^;]+)/);
      const role = roleMatch?.[2];
      if (role) {
        setUserRole(role.toLowerCase());
      } else {
        console.warn("No se encontró cookie 'role'");
      }
    }
  }, [session]);
  const filteredRoutes = routes.filter(route =>
    route.roles.map(r => r.toLowerCase()).includes((userRole || '').toLowerCase())
  );
  return (
    <aside
      ref={sidebarRef}
      className={`w-64 h-screen fixed bg-gray-950 border-r px-4 py-6 transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
    >
      <h1 className="text-2xl text-white font-bold mb-8 ml-12 lg:mr-1">Esymbel Health</h1>
      <nav className="flex flex-col gap-8">
        {filteredRoutes.map(route => (
          <NavLink key={route.path} href={route.path} active={pathname === route.path}>
            <div className="flex items-center gap-2">
              {route.icon}
              <span>{route.name}</span>
            </div>
          </NavLink>
        ))}
      </nav>
    </aside>
  );

}
