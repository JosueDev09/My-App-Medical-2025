export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

import jwt from "jsonwebtoken";
import { db } from "@/lib/db";



const JWT_SECRET = process.env.AUTH_SECRET!;

export async function POST(req: NextRequest) {
  const { strUsuario, strContra } = await req.json();
  console.log("strUsuario", strUsuario," password", strContra);
  // Buscar usuario con SP
  const [spRows]: any = await db.query("CALL sp_ValidarLoginUsuario (?)", [strUsuario]);
  const user = spRows[0]?.[0];

  console.log("user", user);
  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  // const isValid = await bcryptjs.compare(strContra, user.strContra);
  // console.log("isValid", isValid);
  // if (!isValid) {
  //   return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  // }

  // Generar JWT manual
  const token = jwt.sign(
    {
      id: user.id,
      rol: user.intRol,
      username: user.strUsuario,
      email: user.strCorreo,
    },
    JWT_SECRET,
    { expiresIn: "2h" }
  );

  // // Puedes guardarlo en cookie (opcional)
  const response = NextResponse.json({ success: true, token });
  console.log('🧠 Runtime:', process.env.NEXT_RUNTIME);

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/dashboard",
  });

  return response;
}
