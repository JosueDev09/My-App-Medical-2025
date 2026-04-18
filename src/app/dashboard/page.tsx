"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { 
  Calendar, 
  Bell, 
  Star, 
  Clock,
  TrendingUp,
  Users,
  Activity,
  AlertCircle,
  ChevronRight,
  BarChart3
} from "lucide-react";
import { useSession } from "next-auth/react";
import FloatingChat from '../../components/ui/floatingChat/floatingChat';

const Dashboard: React.FC = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("Usuario");
  const { data: session } = useSession();
  const [numCitasHoy, setNumCitasHoy] = useState<number>(0);
  const [numPacientes, setNumPacientes] = useState<number>(0);
  const [numConsultasMes, setNumConsultasMes] = useState<number>(0);
  const [calificacion, setCalificacion] = useState<number>(0);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  
  useEffect(() => {
    console.log("Sesión actual:", session);
    
    // Obtener el rol del usuario
    if (session?.user?.rol) {
      setUserRole(session.user.rol.toLowerCase());
    } else {
      const roleMatch = document.cookie.match(/(^| )role=([^;]+)/);
      const role = roleMatch?.[2];
      if (role) {
        setUserRole(role.toLowerCase());
      }
    }

    // Obtener el nombre del usuario
    if (session?.user?.name) {
      setUserName(session.user.name);
    } else {
      const usernameMatch = document.cookie.match(/(^| )username=([^;]+)/);
      const cookieUsername = usernameMatch?.[2];
      if (cookieUsername) {
        setUserName(decodeURIComponent(cookieUsername));
      }
    }
  }, [session]);

  const fetchDashboardData = async () => {
    try {
      // Citas de hoy
      const resCitasHoy = await fetch("/api/dashboard?tipo=citas-hoy");
      if (resCitasHoy.ok) {
        const data = await resCitasHoy.json();
        
        setNumCitasHoy(data.count);
      }

      // Pacientes totales
      const resPacientes = await fetch("/api/dashboard?tipo=pacientes-total");
      if (resPacientes.ok) {
        const data = await resPacientes.json();
        setNumPacientes(data.count);
      }

      // Consultas del mes
      const resConsultas = await fetch("/api/dashboard?tipo=consultas-mes");
      if (resConsultas.ok) {
        const data = await resConsultas.json();
        setNumConsultasMes(data.count);
      }

      // Calificación
      const resCalificacion = await fetch("/api/dashboard?tipo=calificacion");
      if (resCalificacion.ok) {
        const data = await resCalificacion.json();
        setCalificacion(data.calificacion);
      }

      // Citas próximas de hoy
      const resCitasProximas = await fetch("/api/dashboard?tipo=citas-proximas");
      if (resCitasProximas.ok) {
        const data = await resCitasProximas.json();
        const formattedData = data.map((cita: any) => ({
          id: cita.intCita,
          patient: cita.paciente,
          time: cita.intHora,
          type: cita.strMotivo,
          status: cita.strEstatuscita === 'CONFIRMADA' ? 'confirmed' : 'pending'
        }));
        console.log("Citas próximas formateadas:", formattedData);
        setUpcomingAppointments(formattedData);
      }

      // Notificaciones en tiempo real
      const resNotificaciones = await fetch("/api/dashboard?tipo=notificaciones");
      if (resNotificaciones.ok) {
        const data = await resNotificaciones.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Error al obtener datos del dashboard:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Actualizar datos cada 30 segundos para efecto en tiempo real
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);
  // Datos de ejemplo - Estos vendrían de tu API
  const stats = [
    { 
      label: "Citas Hoy", 
      value: numCitasHoy.toString(), 
      //change: "+12%", 
      icon: <Calendar className="text-blue-500" size={24} />,
      bgColor: "bg-blue-50"
    },
    { 
      label: "Pacientes Totales", 
      value: numPacientes.toString(), 
      //change: "+8%", 
      icon: <Users className="text-green-500" size={24} />,
      bgColor: "bg-green-50"
    },
    { 
      label: "Consultas Mes", 
      value: numConsultasMes.toString(), 
      //change: "+23%", 
      icon: <Activity className="text-purple-500" size={24} />,
      bgColor: "bg-purple-50"
    },
    { 
      label: "Calificación", 
      value: calificacion.toString(), 
      change: "⭐", 
      icon: <Star className="text-amber-500" size={24} />,
      bgColor: "bg-amber-50"
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Bienvenido, {userName?.toUpperCase()}
              </h1>
              
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700">
                Hoy: {new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-slate-600 text-sm font-medium mb-2">{stat.label}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-green-600 font-medium">{stat.change}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Citas Próximas - Ocupa 2 columnas */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100">
            <div className="p-5 sm:p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Calendar className="text-blue-500" size={20} />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">Citas de Hoy</h2>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1" onClick={() => router.push('/citas')}>
                  Ver todas
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div className="p-5 sm:p-6">
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-3">
                  {upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors gap-3"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                          {appointment.patient.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 truncate">{appointment.patient}</p>
                          <p className="text-sm text-slate-600">{appointment.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 sm:flex-shrink-0">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Clock size={16} />
                          <span className="text-sm font-medium">{appointment.time}</span>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            appointment.status === 'confirmed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {appointment.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="mx-auto text-slate-300 mb-3" size={48} />
                  <p className="text-slate-500 text-sm">No tienes citas programadas para hoy</p>
                </div>
              )}
            </div>
          </div>

          {/* Notificaciones */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100">
            <div className="p-5 sm:p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <Bell className="text-amber-500" size={20} />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Notificaciones</h2>
              </div>
            </div>
            <div className="p-5 sm:p-6">
              {notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-1.5 rounded-full ${
                            notification.type === 'info'
                              ? 'bg-blue-100'
                              : notification.type === 'warning'
                              ? 'bg-amber-100'
                              : 'bg-red-100'
                          }`}
                        >
                          <AlertCircle
                            size={14}
                            className={
                              notification.type === 'info'
                                ? 'text-blue-600'
                                : notification.type === 'warning'
                                ? 'text-amber-600'
                                : 'text-red-600'
                            }
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-900 leading-relaxed">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bell className="mx-auto text-slate-300 mb-3" size={48} />
                  <p className="text-slate-500 text-sm">No hay notificaciones nuevas</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Segunda Fila */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Días Inhábiles */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100">
            <div className="p-5 sm:p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 rounded-lg">
                  <AlertCircle className="text-red-500" size={20} />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Días Inhábiles</h2>
              </div>
            </div>
            <div className="p-5 sm:p-6">
              <div className="text-center py-12">
                <Calendar className="mx-auto text-slate-300 mb-3" size={48} />
                <p className="text-slate-500 text-sm">No hay días bloqueados</p>
                <button className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
                  Bloquear fechas
                </button>
              </div>
            </div>
          </div>

          {/* Reseñas */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100">
            <div className="p-5 sm:p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <Star className="text-amber-500" size={20} />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Reseñas Recientes</h2>
              </div>
            </div>
            <div className="p-5 sm:p-6">
              <div className="text-center py-12">
                <Star className="mx-auto text-slate-300 mb-3" size={48} />
                <p className="text-slate-500 text-sm">Aún no tienes reseñas</p>
                <p className="text-xs text-slate-400 mt-2">Las reseñas de tus pacientes aparecerán aquí</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <FloatingChat /> */}
    </div>
  );
};

export default Dashboard;