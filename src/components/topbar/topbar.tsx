// src/components/topbar/TopBar.tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,DropdownMenuSeparator } from "@/components/ui/dropdown-menu/dropdown-menu";
import { Bell, User, LogOut, CalendarCheck, Clock, UserX2, } from "lucide-react";

export default function TopBar() {
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
    <div className="flex items-center justify-between p-4 bg-white border-b shadow-md">
      <h1 className="text-2xl font-bold text-gray-900">Esymbel Health</h1>
      <div className="flex items-center gap-4">
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
              <AvatarImage src="/path-to-avatar.jpg" alt="User Avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Usuario</DropdownMenuLabel>
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" /> Perfil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut className="w-4 h-4 mr-2" /> Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
