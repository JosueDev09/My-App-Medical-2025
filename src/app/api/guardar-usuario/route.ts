// ✅ API para guardar usuario (registro o login)
// Archivo: app/api/guardar-usuario/route.ts

import { NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { strCorreo, strNombre } = await req.json();

    const params = [strCorreo, strNombre];

    // console.log("strCorreo", strCorreo);
    // console.log("strNombre", strNombre);

    // Ejecutar el procedimiento y obtener si fue registro o login
    await db.query("CALL sp_tbUsuarios_Login(?, ?, @estatus)", params);

    const [rows]: any = await db.query("SELECT @estatus AS estatus");
    const estatus = rows[0]?.estatus;
    
    if (estatus === "NO_EXISTE") {
      
      return new Response(
        JSON.stringify({ success: false, message: "El usuario no está registrado. Regístrate primero." }),
        { status: 401 }
      );
    }

    const [userRows]: any = await db.query(
      "SELECT id, strTipo_Accion AS tipo, intRol FROM tbUsuarios WHERE strCorreo = ?",
      [strCorreo]
    );

    const user = userRows[0];

    if (!user) {
      return new Response("Usuario no encontrado", { status: 404 });
    }

    return Response.json({
      success: true,
      tipo: user.tipo || "LOGIN",
      rol: mapRol(user.intRol), // ← para que te dé 'doctor', 'admin', etc.
      id: user.id,
    });
  } catch (error) {
    console.error("Error en guardar-usuario:");
    return new Response("Error interno", { status: 500 });
  }
}

// Mapea el número a un texto entendible
function mapRol(intRol: number): string {
  switch (intRol) {
    case 1: return "Super Administrador";
    case 2: return "Administrador";
    case 3: return "Paciente";
    case 4: return "Doctor";
    default: return "Paciente";
  }
}