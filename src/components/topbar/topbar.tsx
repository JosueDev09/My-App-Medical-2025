"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,DropdownMenuSeparator } from "@/components/ui/dropdown-menu/dropdown-menu";
import { Bell, User, LogOut, CalendarCheck, Clock, UserX2, } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { log } from "console";


interface DecodedToken {
  rol: string;
  exp: number;
}

export default function TopBar() {
  const router = useRouter();
  const { data: session } = useSession();
  const [userRole, setUserRole] = useState<string | null>(null);

  

  const handleLogout = async () => { 

    console.log("Entro al handleLogout");

    
    const cookies = document.cookie;

    console.log("cookies", cookies);

    const hasCustomToken = document.cookie.includes("role=");
    // const hasCustomToken = cookies.includes("token=");
    console.log("hasCustomToken", hasCustomToken);
  
    

      if (hasCustomToken) {
        try {
         
          // Llama al endpoint para eliminar cookies HttpOnly
          await fetch("/api/logout", { method: "GET" });
        } catch (error) {
          console.error("Error al cerrar sesión:", error);
        }
        
        router.push("/login"); // ✅ correcto // Redirige a la página de inicio de sesión
      } else {
        // 🔐 Logout con NextAuth (Google)
        signOut({ callbackUrl: '/login' });
      }
    };

    useEffect(() => {
      if (session?.user?.rol) {
        setUserRole(session.user.rol.toLowerCase());
      } else {
        const roleMatch = document.cookie.match(/(^| )role=([^;]+)/);
        const role = roleMatch?.[2];
        if (role) {
          setUserRole(role.toLowerCase());
        }
      }
    }, [session]);
  const notifications = 3;

  const notificationList = [
    {
      tipo: "confirmada",
      mensaje: "Cita con Juan Pérez confirmada",
    },
    {
      tipo: "nueva",
      mensaje: "Nueva cita agendada con la Dra. López",
    },
    {
      tipo: "cancelada",
      mensaje: "Cita cancelada por el paciente",
    },
  ];
  const getIcon = (tipo: string) => {
    switch (tipo) {
      case "confirmada":
        return <CalendarCheck className="w-4 h-4 text-green-500" />;
      case "nueva":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "cancelada":
        return <UserX2 className="w-4 h-4 text-red-500" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex items-center justify-between p-4 print:hidden">
      <h1 className="text-2xl font-bold text-gray-900 ml-10">Esymbel Health</h1>
      <div className="flex items-center gap-4">
      <label className="font-bold text-gray-500 text-l mr-[90px]">{userRole?.toUpperCase() || "Cargando rol..."}</label>
        {/* Notificaciones */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="relative cursor-pointer">
              <Bell className="w-6 h-6 text-gray-700" />
              {notifications > 0 && (
                <span className="absolute -top-2 -left-3 bg-red-500 text-white text-xs  px-1.5 py-0.5">
                  {notifications}
                </span>
              )}
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-80 mt-2 mr-16">
            <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notificationList.length > 0 ? (
              notificationList.map((item, index) => (
                <DropdownMenuItem key={index} className="flex items-center gap-2">
                  {getIcon(item.tipo)}
                  <span className="text-sm text-muted-foreground">
                    {item.mensaje}
                  </span>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem>
                <div className="text-sm text-muted-foreground">Sin notificaciones</div>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Avatar con menú desplegable */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage className="cursor-pointer" src="/path-to-avatar.jpg" alt="User Avatar" />
              <AvatarFallback className="cursor-pointer">U</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Usuario</DropdownMenuLabel>
            <DropdownMenuItem className="cursor-pointer">
              <User className="w-4 h-4 mr-2" /> Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut className="w-4 h-4 mr-2 " /> Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
