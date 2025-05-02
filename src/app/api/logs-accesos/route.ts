import { headers } from "next/headers";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const strIp = headersList.get("x-forwarded-for") ?? "desconocida";
    const strUbicacion = "desconocida"; // Puedes usar IP API si lo deseas
    const { strCorreo, strNombre, strTipo } = await request.json();

    const params =  [strCorreo, strNombre, strTipo,strIp, strUbicacion];

    await db.query("CALL sp_tbLogs_Accesos_Save(?, ?, ?, ?, ?)",params );

    return new Response("Log guardado", { status: 200 });
  } catch (error) {
    console.error("Error en log-acceso:", error);
    return new Response("Error interno", { status: 500 });
  }
}
