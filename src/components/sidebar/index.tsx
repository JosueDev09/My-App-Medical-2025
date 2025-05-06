'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import NavLink from './nav-link';
import {LayoutDashboard,Calendar,Users,Stethoscope,User, Activity} from "lucide-react";

const userRole = 'doctor';  // Este valor debe provenir del sistema de autenticación

const routes = [
  { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, roles: ['admin', 'doctor','paciente'] },
  { name: 'Citas', path: '/citas', icon: <Calendar size={20} />, roles: ['admin', 'doctor','paciente'] },
  { name: 'Pacientes', path: '/pacientes', icon: <Users size={20} />, roles: ['admin', 'doctor'] },
  { name: 'Médicos', path: '/medicos', icon: <Stethoscope size={20} />, roles: ['admin'] },
  { name: 'Especialidades', path: '/especialidad', icon: <Activity size={20} />, roles: ['admin'] },
  { name: 'Calendario', path: '/calendario-doctor', icon: <Calendar size={20} />, roles: ['doctor'] },
];

// Filtra las rutas según el rol del usuario
const filteredRoutes = routes.filter(route => route.roles.includes(userRole));
export default function Sidebar({isOpen,onToggle,sidebarRef,}: {isOpen: boolean;onToggle: () => void; sidebarRef: React.RefObject<HTMLDivElement | null>;}) {
  const pathname = usePathname();
 
  return (
    <aside  ref={sidebarRef} className={`w-64 h-screen fixed bg-gray-950 border-r px-4 py-6 transition-transform duration-300 ease-in-out z-50  ${isOpen ? 'translate-x-0' : '-translate-x-full'}
     md:translate-x-0 `}>
      <h1 className="text-2xl text-white font-bold mb-8 ml-12 lg:mr-1">Esymbel Health</h1>
      <nav className="flex flex-col gap-8">
        {filteredRoutes.map(route => (
          <NavLink
            key={route.path}
            href={route.path}
            active={pathname === route.path}
          >
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
