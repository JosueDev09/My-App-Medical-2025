import { NextRequest, NextResponse } from "next/server";
import { validateUser } from "@/lib/auth/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const user = await validateUser(email, password);

  if (!user) {
    return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 });
  }

  // Aquí puedes generar token, guardar cookie o redirigir
  return NextResponse.json({ message: "Autenticado con éxito" }, { status: 200 });
}
