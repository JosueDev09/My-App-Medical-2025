
"use client";

import { useEffect, useRef } from 'react';
import { useState } from 'react';
import '../styles/globals.css';
import TopBar from "@/components/topbar/topbar";
import Sidebar from '@/components/sidebar';
import { usePathname } from "next/navigation";
import "@/lib/fontawesome"; // asegúrate que la ruta sea correcta
import {Menu} from "lucide-react";
import { SessionProvider } from 'next-auth/react';




export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  const pathname = usePathname();
  const hideLayout = ['/login', '/registro'].includes(pathname as string);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const isMobile = window.innerWidth < 768; // Tailwind md breakpoint

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
    <html lang="es">
      <body className="min-h-screen w-full bg-gray-100">
      <SessionProvider>
        {/* Sidebar */}
        {!hideLayout && (
          <Sidebar
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
            sidebarRef={sidebarRef} // Pasamos la referencia
          />
        )}

        {/* Contenedor de contenido */}
      <div className={`transition-all duration-300 ${!hideLayout ? 'md:ml-64' : ''}`}>
        {/* Topbar + botón hamburguesa */}
        {!hideLayout && (
          <div className="sticky top-0 z-40 bg-white flex items-center justify-between px-4 py-2 border-b">
            {/* Botón hamburger en móviles */}
            <button
              className="md:hidden p-2 rounded bg-gray-100 hover:bg-gray-200"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
             <Menu size={20} className="text-gray-800" />
            </button>

            {/* TopBar ocupa el resto del espacio */}
            <div className="flex-1">
              <TopBar />
            </div>
          </div>
        )}
          <main
            className={`min-h-screen w-full ${
              hideLayout ? 'flex justify-center items-center' : 'p-4 overflow-auto'
            }`}
          >
            {children}
          </main>
        </div>
        </SessionProvider>
      </body>
    </html>
  );
}