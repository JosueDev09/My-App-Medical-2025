'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import NavLink from './nav-link';
import { LayoutDashboard, Calendar, Users, Stethoscope, Activity, Wallet, BarChart2, ClipboardList } from "lucide-react";
import { useSession } from 'next-auth/react';



const routes = [
  { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, roles: ['SuperAdmin', 'doctor','Paciente'] },
  { name: 'Citas', path: '/citas', icon: <Calendar size={20} />, roles: ['SuperAdmin', 'doctor','Paciente'] },
  { name: 'Pacientes', path: '/pacientes', icon: <Users size={20} />, roles: ['SuperAdmin', 'doctor'] },
  { name: 'Médicos', path: '/medicos', icon: <Stethoscope size={20} />, roles: ['SuperAdmin'] },
  { name: 'Especialidades', path: '/especialidad', icon: <Activity size={20} />, roles: ['SuperAdmin'] },
  { name: 'Calendario', path: '/calendario-doctor', icon: <Calendar size={20} />, roles: ['doctor','SuperAdmin'] },
  {
    name: 'Contabilidad',
    icon: <Wallet size={20} />,
    roles: ['SuperAdmin', 'Administrador'],
    children: [
      { name: 'Resumen', path: '/contabilidad/resumen', icon: <BarChart2 size={16} /> },
      { name: 'Pagos', path: '/contabilidad/pagos', icon: <ClipboardList size={16} /> },
    ]
  },
];

export default function Sidebar({isOpen,sidebarRef,}: {isOpen: boolean;onToggle: () => void; sidebarRef: React.RefObject<HTMLDivElement | null>;}) {
  const pathname = usePathname();
  const { data: session } = useSession();
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
      className={`w-64 h-screen fixed bg-gray-950 border-r px-4 py-6 transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 `}
    >
      <h1 className="text-2xl text-white font-bold mb-8 ml-12 lg:mr-1">Esymbel Health</h1>
      <nav className="flex flex-col gap-8 ">
        {filteredRoutes.map(route => (
          route.children ? (
            <div key={route.name}>
              <div className="flex items-center gap-2 text-sm text-gray-400 uppercase">
                {route.icon}
                <span>{route.name}</span>
              </div>
              <div className="ml-6 space-y-2 mt-2">
                {route.children.map(sub => (
                  <NavLink key={sub.path} href={sub.path} active={pathname === sub.path}>
                    <div className="flex items-center gap-2 text-gray-300 hover:text-white">
                      {sub.icon}
                      <span>{sub.name}</span>
                    </div>
                  </NavLink>
                ))}
              </div>
            </div>
          ) : (
            <NavLink key={route.path} href={route.path} active={pathname === route.path}>
              <div className="flex items-center gap-2">
                {route.icon}
                <span>{route.name}</span>
              </div>
            </NavLink>
          )
        ))}
      </nav>
    </aside>
  );
}
