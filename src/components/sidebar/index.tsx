'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import NavLink from './nav-link';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Stethoscope, 
  Activity, 
  Wallet, 
  BarChart2, 
  ClipboardList, 
  Plus,
  ChevronDown,
  X,
  Notebook,
  CalendarPlus,
  LogOut
} from "lucide-react";
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';

const routes = [
  { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, roles: ['SuperAdmin', 'doctor','Paciente'] },
  { name: 'Citas', path: '/citas', icon: <CalendarPlus size={20} />, roles: ['SuperAdmin', 'doctor','Paciente'] },
  { name: 'Agenda', path: '/agenda', icon: <Notebook size={20} />, roles: ['doctor','SuperAdmin'] },
  { name: 'Historial Médico', path: '/historial-medico', icon: <ClipboardList size={20} />, roles: ['SuperAdmin', 'Doctor', 'Recepcion'] },
  { name: 'Pacientes', path: '/pacientes', icon: <Users size={20} />, roles: ['SuperAdmin', 'doctor'] },
  { name: 'Doctores', path: '/medicos/lista-medicos', icon: <Stethoscope size={20} />, roles: ['SuperAdmin'] },
  // {
  //   name: 'Doctores',
  //   icon: <Stethoscope size={20} />,
  //   roles: ['SuperAdmin'],
  //   children: [
  //     { name: 'Alta doctor', path: '/medicos/alta-medicos', icon: <Plus size={18} /> },
  //     { name: 'Doctores', path: '/medicos/lista-medicos', icon: <Stethoscope size={18} /> },
  //   ]
  // },
  { name: 'Especialidades', path: '/especialidades', icon: <Activity size={20} />, roles: ['SuperAdmin'] },

  // { name: 'Calendario', path: '/calendario-doctor', icon: <Calendar size={20} />, roles: ['doctor','SuperAdmin'] },
  {
    name: 'Contabilidad',
    icon: <Wallet size={20} />,
    roles: ['SuperAdmin', 'Administrador'],
    children: [
      { name: 'Resumen', path: '/contabilidad/resumen', icon: <BarChart2 size={18} /> },
      { name: 'Pagos', path: '/contabilidad/pagos', icon: <ClipboardList size={18} /> },
    ]
  },
];

export default function Sidebar({
  isOpen,
  onToggle,
  sidebarRef,
}: {
  isOpen: boolean;
  onToggle: () => void;
  sidebarRef: React.RefObject<HTMLDivElement | null>;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);

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

    // Obtener el nombre del usuario
    if (session?.user?.username) {
      setUserName(session.user.username);
    } else {
      const usernameMatch = document.cookie.match(/(^| )username=([^;]+)/);
      const cookieUsername = usernameMatch?.[2];
      if (cookieUsername) {
        setUserName(decodeURIComponent(cookieUsername));
      }
    }
    
  }, [session]);

  // Auto-abrir menú si una ruta hija está activa
  useEffect(() => {
    routes.forEach(route => {
      if (route.children) {
        const hasActiveChild = route.children.some(child => pathname === child.path);
        if (hasActiveChild && !openMenus.includes(route.name)) {
          setOpenMenus(prev => [...prev, route.name]);
        }
      }
    });
  }, [pathname]);

  const toggleMenu = (menuName: string) => {
    setOpenMenus(prev =>
      prev.includes(menuName)
        ? prev.filter(name => name !== menuName)
        : [...prev, menuName]
    );
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que deseas cerrar sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        // Llamar al endpoint de logout para eliminar las cookies del servidor
        const response = await fetch('/api/logout', {
          method: 'POST',
          credentials: 'include'
        });

        if (response.ok) {
          // Redirigir al login
          window.location.href = '/login';
        } else {
          throw new Error('Error al cerrar sesión');
        }
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al cerrar sesión'
        });
      }
    }
  };

  const filteredRoutes = routes.filter(route =>
    route.roles.map(r => r.toLowerCase()).includes((userRole || '').toLowerCase())
  );

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-screen w-72 bg-slate-900 z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 flex flex-col`}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Activity className="text-white" size={22} />
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg leading-tight">Esymbel</h1>
              <p className="text-slate-400 text-xs">Health System</p>
            </div>
          </div>
          
          {/* Botón cerrar solo en móvil */}
          <button
            onClick={onToggle}
            className="md:hidden text-slate-400 hover:text-white transition-colors p-1"
            aria-label="Cerrar menú"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          {filteredRoutes.map(route => (
            route.children ? (
              // Menú con submenús
              <div key={route.name} className="space-y-1">
                <button
                  onClick={() => toggleMenu(route.name)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-slate-300 hover:bg-gradient-to-r hover:from-slate-800 hover:to-slate-800/50 hover:text-white hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 group-hover:text-blue-400 transition-colors duration-200">
                      {route.icon}
                    </span>
                    <span className="text-sm font-medium">{route.name}</span>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`text-slate-500 group-hover:text-slate-300 transition-all duration-200 ${
                      openMenus.includes(route.name) ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Submenú */}
                <div
                  className={`ml-4 space-y-1 overflow-hidden transition-all duration-200 ${
                    openMenus.includes(route.name) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  {route.children.map(sub => (
                    <NavLink key={sub.path} href={sub.path} active={pathname === sub.path}>
                      <div
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                          pathname === sub.path
                            ? 'bg-gradient-to-r from-blue-500/20 to-blue-500/10 text-blue-400 font-medium border-l-2 border-blue-400'
                            : 'text-slate-400 hover:bg-slate-800/70 hover:text-white hover:translate-x-1'
                        }`}
                      >
                        <span className={pathname === sub.path ? 'text-blue-400' : 'group-hover:text-blue-300'}>
                          {sub.icon}
                        </span>
                        <span>{sub.name}</span>
                      </div>
                    </NavLink>
                  ))}  
                </div>
              </div>
            ) : (
              // Menú simple
              <NavLink key={route.path} href={route.path} active={pathname === route.path}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 group ${
                    pathname === route.path
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 font-medium'
                      : 'text-slate-300 hover:bg-gradient-to-r hover:from-slate-800 hover:to-slate-800/50 hover:text-white hover:shadow-md hover:translate-x-1'
                  }`}
                >
                  <span className={pathname === route.path ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}>
                    {route.icon}
                  </span>
                  <span>{route.name}</span>
                </div>
              </NavLink>
            )
          ))}
        </nav>

        {/* Footer - Info de usuario */}
        <div className="p-4 border-t border-slate-800 relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
              {userName ? userName[0].toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-white truncate">
                {userName ? userName.toUpperCase() : 'USUARIO'}
              </p>
              <p className="text-xs text-slate-400 truncate capitalize">
                {userRole || 'Cargando...'}
              </p>
            </div>
            <ChevronDown 
              size={18} 
              className={`text-slate-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Menú desplegable */}
          {showUserMenu && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-slate-800 rounded-lg shadow-xl border border-slate-700 overflow-hidden">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-sm font-medium"
              >
                <LogOut size={18} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}