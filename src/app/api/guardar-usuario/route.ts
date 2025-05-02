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

    const [rows1]: any = await db.query(
      "SELECT strTipo_Accion AS tipo FROM tbUsuarios WHERE strCorreo = ?",
      [strCorreo]
    );
    const tipo = rows1[0]?.tipo || "LOGIN";


    return Response.json({ success: true, tipo });
  } catch (error) {
    console.error("Error en guardar-usuario:");
    return new Response("Error interno", { status: 500 });
  }
}