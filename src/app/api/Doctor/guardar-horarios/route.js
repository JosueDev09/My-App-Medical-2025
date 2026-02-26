import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export async function POST(req) {
  try {
    const { intDoctor, horarioInicio, horarioFin, diasDisponibles } = await req.json();

    // Validar que se recibió el ID del doctor
    if (!intDoctor) {
      return new Response(
        JSON.stringify({ success: false, message: "ID del doctor es requerido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Convertir el array de días a string separado por comas
    const diasString = diasDisponibles.join(",");

    const params = [intDoctor, horarioInicio, horarioFin, diasString];

    // Ejecutar el procedimiento almacenado
    const result = await db.query(
      "CALL sp_tbDoctores_Horarios_Save(?, ?, ?, ?)",
      params
    );

    if (result) {
      return new Response(
        JSON.stringify({ success: true, message: "Horarios guardados correctamente" }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  } catch (error) {
    console.error("Error en guardar-horarios:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error interno del servidor", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
