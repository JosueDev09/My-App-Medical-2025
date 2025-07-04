import { db } from "@/lib/db";
import { NextRequest } from "next/server";


export async function POST(req: NextRequest) {
    try {
        const { strNombre, strApellidos, datFechaNacimiento,strSexo,strEstado,strCiudad, strTelefono, strEmail, strDireccion } = await req.json();
    
        const params = [strNombre, strApellidos, datFechaNacimiento,strSexo,strEstado,strCiudad, strTelefono, strEmail, strDireccion];
    
        // Ejecutar el procedimiento almacenado
        const result: any = await db.query("CALL sp_tbDoctores_Save(?, ?, ?, ?, ?, ?, ?, ?, ?)", params);

         const intDoctor = result[0][0].intDoctor;

          if(result) {
         return new Response(JSON.stringify({success: true, intDoctor }), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
        });
    }
    
        
    } catch (error) {
        console.error("Error en guardar-doctor:", error);
        return new Response("Error interno del servidor", { status: 500 });
    }
    }