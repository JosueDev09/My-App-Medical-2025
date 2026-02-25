"use client";

import { useEffect, useRef, useState } from 'react';
import { usePathname } from "next/navigation";
import Sidebar from '@/components/sidebar';
import { Menu } from "lucide-react";
import { SessionProvider } from 'next-auth/react';

interface LayoutClientProps {
  children: React.ReactNode;
}

export default function LayoutClient({ children }: LayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  
  const hideLayout = ['/login', '/registro', '/inicio'].includes(pathname as string);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const isMobile = window.innerWidth < 768;

      if (
        sidebarOpen &&
        isMobile &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setSidebarOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  return (
    <SessionProvider>
      {/* Sidebar */}
      {!hideLayout && (
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          sidebarRef={sidebarRef}
        />
      )}

      {/* Contenedor de contenido */}
      <div className={`transition-all duration-300 ${!hideLayout ? 'md:ml-72' : ''}`}>
        {/* Topbar + botón hamburguesa */}
        {!hideLayout && (
          <div className="sticky top-0 z-40 bg-white flex items-center justify-between px-4 py-2 border-b">
            {/* Botón hamburger en móviles */}
            <button
              className="md:hidden p-2 rounded bg-gray-100 hover:bg-gray-200 print:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={20} className="text-gray-800" />
            </button>
          </div>
        )}
        
        <main
          className={`min-h-screen w-full ${
            hideLayout ? 'flex justify-center items-center' : 'p-6 md:p-8 overflow-auto'
          }`}
        >
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}
