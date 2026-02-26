import { db } from "@/lib/db";
import { NextRequest } from "next/server";


export async function POST(req: NextRequest) {
 try {
         const { intDoctor, intEspecialidad, strCedulaProfesional, strCurpRFC, dblPrecioConsulta, strConsultorio, strDescripcionDoctor } = await req.json();
     // console.log("Datos recibidos en guardar-datos-profesionales:", { intDoctor, intEspecialidad, strCedulaProfesional, strCurpRFC, dblPrecioConsulta, strConsultorio, strDescripcionDoctor });
         if (!intDoctor) {
           return new Response(JSON.stringify({ success: false, message: "intDoctor es requerido" }), {
             status: 400,
             headers: { "Content-Type": "application/json" },
           });
         }

         const params = [intDoctor, intEspecialidad, strCedulaProfesional, strCurpRFC, dblPrecioConsulta, strConsultorio, strDescripcionDoctor];
     
         // Ejecutar el procedimiento almacenado
         const result: any = await db.query("CALL sp_tbDoctores_Datos_Profesionales_Save(?, ?, ?, ?, ?, ?, ?)", params);
 
         if(result) {
          return new Response(JSON.stringify({ success: true, message: "Datos profesionales guardados correctamente" }), {
             status: 200,
             headers: { "Content-Type": "application/json" },
          });
         }
     
         return new Response(JSON.stringify({ success: false, message: "No se pudo guardar los datos profesionales" }), {
           status: 500,
           headers: { "Content-Type": "application/json" },
         });
         
     } catch (error) {
         console.error("Error en guardar-datos-profesionales:", error);
         return new Response(JSON.stringify({ success: false, message: "Error interno del servidor" }), { 
           status: 500,
           headers: { "Content-Type": "application/json" },
         });
     }
}
