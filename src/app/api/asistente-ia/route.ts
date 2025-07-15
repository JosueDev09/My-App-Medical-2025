
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
 // ajusta según tu estructura


export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
    const body = await req.json();
   const { mensaje, rol, chatId: chatIdFromClient } = body;

    const session = await auth();
     const sessionUser = session?.user;

    console.log('mensaje recibido:', mensaje);
    console.log('rol del usuario:', rol);
    console.log('usuario de la sesión:', session?.user);

    const chatId =
      chatIdFromClient ||
      sessionUser?.email ||
      sessionUser?.id ||
      `anon-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const respuesta = await fetch("http://localhost:5678/webhook/5ccf162d-817b-4717-8885-6b1a378061e3/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mensaje,
        chatInput: mensaje,
        chatId,
        sessionId: chatId,
        rol,
        usuario: sessionUser || null,

      }),
    });

      const data = await respuesta.json();

     console.log('🤖 respuesta del asistente:', data);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error en /api/asistente-ia:", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}


// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

//   const session = await getServerSession(req, res, authOptions);

//   if (!session) {
//     return res.status(401).json({ error: "No autenticado" });
//   }

//   const pacienteId = session.user.id; // Cambia esto si usas otro campo
//   const { mensaje } = req.body;

//   if (!mensaje) {
//     return res.status(400).json({ error: "Mensaje requerido" });
//   }

//   try {
//     const respuesta = await fetch("http://localhost:5678/webhook/asistente", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         mensaje,
//         pacienteId,
//       }),
//     });

//     const data = await respuesta.json();

//     return res.status(200).json({ respuesta: data });
//   } catch (error) {
//     console.error("Error al comunicarse con n8n:", error);
//     return res.status(500).json({ error: "Error interno del servidor" });
//   }
// }
