
"use client";
import '../styles/globals.css';
import TopBar from "@/components/topbar/topbar";
import Sidebar from '@/components/sidebar';
import { usePathname } from "next/navigation";
import "@/lib/fontawesome"; // asegúrate que la ruta sea correcta



export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Ocultar sidebar y topbar si estamos en login
  const hideLayout = pathname === "/login";
  return (
   
    <html lang="es">
      <body className={hideLayout ? "min-h-screen w-full" : "min-h-screen flex"}>
        {!hideLayout && <Sidebar />}

        <div
          className={`flex flex-col flex-1 ${
            hideLayout ? "" : "h-screen overflow-hidden ml-64"
          }`}
        >
          {!hideLayout && <TopBar />}
          <main
            className={`flex-1 w-full ${
              hideLayout ? "flex justify-center items-center" : "p-6 overflow-auto"
            }`}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
   
  );
}
