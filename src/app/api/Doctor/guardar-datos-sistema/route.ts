import { db } from "@/lib/db";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { intDoctor, strUsuario, strPassword, strRol, strEstadoUsuario } = await req.json();

    // Validar que se recibió el ID del doctor
    if (!intDoctor) {
      return new Response(
        JSON.stringify({ success: false, message: "ID del doctor es requerido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validar campos obligatorios
    if (!strUsuario || !strPassword || !strRol || !strEstadoUsuario) {
      return new Response(
        JSON.stringify({ success: false, message: "Todos los campos son obligatorios" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(strPassword, 10);

    const params = [intDoctor, strUsuario, hashedPassword, strRol, strEstadoUsuario];

    // Ejecutar el procedimiento almacenado
    const result: any = await db.query(
      "CALL sp_tbDoctores_Usuario_Save(?, ?, ?, ?, ?)",
      params
    );

    if (result) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Usuario creado correctamente",
          intDoctor 
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  } catch (error: any) {
    console.error("Error en guardar-datos-sistema:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Error interno del servidor", 
        error: error.message 
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
