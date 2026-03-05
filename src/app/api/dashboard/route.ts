import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth-helper";

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get("tipo");

    // Fecha actual
    const today = new Date().toISOString().split('T')[0];

    if (tipo === "citas-hoy") {
      let query = `
        SELECT COUNT(*) as count
        FROM tbcitas
        WHERE DATE(datFecha) = ?
      `;
      const params: any[] = [today];

      // Si es doctor, filtrar solo sus citas
      if (user.rol === "Doctor" && user.intDoctor) {
        query += ` AND intDoctor = ?`;
        params.push(user.intDoctor);
      }

      const [result]: any = await db.query(query, params);
      return NextResponse.json({ count: result[0].count });
    }

    if (tipo === "pacientes-total") {
      let query = `
        SELECT COUNT(DISTINCT intPaciente) as count
        FROM tbcitas
        WHERE 1=1
      `;
      const params: any[] = [];

      // Si es doctor, contar solo sus pacientes
      if (user.rol === "Doctor" && user.intDoctor) {
        query += ` AND intDoctor = ?`;
        params.push(user.intDoctor);
      }

      const [result]: any = await db.query(query, params);
      return NextResponse.json({ count: result[0].count });
    }

    if (tipo === "consultas-mes") {
      const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
      
      let query = `
        SELECT COUNT(*) as count
        FROM tbcitas
        WHERE datFecha >= ?
          AND strEstatuscita = 'FINALIZADA'
      `;
      const params: any[] = [firstDayOfMonth];

      // Si es doctor, filtrar solo sus consultas
      if (user.rol === "Doctor" && user.intDoctor) {
        query += ` AND intDoctor = ?`;
        params.push(user.intDoctor);
      }

      const [result]: any = await db.query(query, params);
      return NextResponse.json({ count: result[0].count });
    }

    if (tipo === "calificacion") {
      // TODO: Implementar sistema de calificaciones
      // Por ahora devolver un valor fijo
      return NextResponse.json({ calificacion: 4.8 });
    }

    if (tipo === "citas-proximas") {
      let query = `
        SELECT 
          c.intCita,
          c.intHora,
          c.strMotivo,
          c.strEstatuscita,
          CONCAT(p.strNombre) as paciente
        FROM tbcitas c
        INNER JOIN tbpacientes p ON c.intPaciente = p.intPaciente
        WHERE DATE(c.datFecha) = ?
          AND c.strEstatuscita IN ('PENDIENTE', 'CONFIRMADA', 'EN ESPERA')
      `;
      const params: any[] = [today];

      // Si es doctor, filtrar solo sus citas
      if (user.rol === "Doctor" && user.intDoctor) {
        query += ` AND c.intDoctor = ?`;
        params.push(user.intDoctor);
      }

      query += ` ORDER BY c.intHora ASC LIMIT 5`;

      const [citas]: any = await db.query(query, params);
      return NextResponse.json(citas);
    }

    if (tipo === "notificaciones") {
      const notifications: any[] = [];
      const params: any[] = [];
      
      // Notificación 1: Citas pendientes de confirmar
      let queryCitasPendientes = `
        SELECT COUNT(*) as count
        FROM tbcitas
        WHERE strEstatuscita = 'PENDIENTE'
          AND DATE(datFecha) >= CURDATE()
      `;
      
      if (user.rol === "Doctor" && user.intDoctor) {
        queryCitasPendientes += ` AND intDoctor = ?`;
        params.push(user.intDoctor);
      }

      const [pendientes]: any = await db.query(queryCitasPendientes, params);
      if (pendientes[0].count > 0) {
        notifications.push({
          id: `pending-${Date.now()}`,
          message: `Tienes ${pendientes[0].count} cita${pendientes[0].count > 1 ? 's' : ''} pendiente${pendientes[0].count > 1 ? 's' : ''} de confirmar`,
          time: "Ahora",
          type: "warning"
        });
      }

      // Notificación 2: Citas en las próximas 2 horas
      let queryCitasProximas = `
        SELECT COUNT(*) as count, MIN(intHora) as proximaHora
        FROM tbcitas
        WHERE DATE(datFecha) = CURDATE()
          AND strEstatuscita IN ('CONFIRMADA', 'PENDIENTE')
          AND intHora <= DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 2 HOUR), '%H:%i')
          AND intHora >= DATE_FORMAT(NOW(), '%H:%i')
      `;
      const params2: any[] = [];
      
      if (user.rol === "Doctor" && user.intDoctor) {
        queryCitasProximas += ` AND intDoctor = ?`;
        params2.push(user.intDoctor);
      }

      const [proximas]: any = await db.query(queryCitasProximas, params2);
      if (proximas[0].count > 0) {
        notifications.push({
          id: `upcoming-${Date.now()}`,
          message: `Tienes ${proximas[0].count} cita${proximas[0].count > 1 ? 's' : ''} en las próximas 2 horas`,
          time: `Próxima: ${proximas[0].proximaHora}`,
          type: "info"
        });
      }

      // Notificación 3: Citas canceladas en los últimos 3 días
      let queryCitasCanceladas = `
        SELECT COUNT(*) as count, MAX(datFecha) as ultimaFecha
        FROM tbcitas
        WHERE strEstatuscita = 'CANCELADA'
          AND datFecha >= DATE_SUB(CURDATE(), INTERVAL 3 DAY)
      `;
      const params3: any[] = [];
      
      if (user.rol === "Doctor" && user.intDoctor) {
        queryCitasCanceladas += ` AND intDoctor = ?`;
        params3.push(user.intDoctor);
      }

      const [canceladas]: any = await db.query(queryCitasCanceladas, params3);
      if (canceladas[0].count > 0) {
        const diasAtras = Math.floor((new Date().getTime() - new Date(canceladas[0].ultimaFecha).getTime()) / (1000 * 60 * 60 * 24));
        notifications.push({
          id: `cancelled-${Date.now()}`,
          message: `${canceladas[0].count} cita${canceladas[0].count > 1 ? 's' : ''} cancelada${canceladas[0].count > 1 ? 's' : ''} recientemente`,
          time: diasAtras === 0 ? "Hoy" : `Hace ${diasAtras} día${diasAtras > 1 ? 's' : ''}`,
          type: "alert"
        });
      }

      // Si no hay notificaciones, agregar mensaje de bienvenida
      if (notifications.length === 0) {
        notifications.push({
          id: `welcome-${Date.now()}`,
          message: "Todo está en orden. No hay notificaciones pendientes",
          time: "Ahora",
          type: "info"
        });
      }

      return NextResponse.json(notifications);
    }

    return NextResponse.json({ error: "Tipo no válido" }, { status: 400 });
  } catch (error: any) {
    console.error("Error en dashboard:", error);
    
    if (error.message.includes("Token") || error.message.includes("autenticado")) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    
    return NextResponse.json(
      { error: "Error al obtener datos del dashboard" },
      { status: 500 }
    );
  }
}
