import { NextResponse } from "next/server";
import { db } from '@/lib/db'; 

// PUT - Actualizar estatus de pago de una cita
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { strFolio, strEstatusPago } = body;

    if (!strFolio || !strEstatusPago) {
      return NextResponse.json(
        { error: "Faltan parámetros requeridos" },
        { status: 400 }
      );
    }

    // Actualizar el estatus de pago en la base de datos
    const [result]: any = await db.query(
      "UPDATE tbcitas SET strEstatusPago = ? WHERE strFolio = ?",
      [strEstatusPago, strFolio]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "No se encontró la cita" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Estatus de pago actualizado correctamente",
      strFolio,
      strEstatusPago,
    });
  } catch (error) {
    console.error("Error al actualizar estatus de pago:", error);
    return NextResponse.json(
      { error: "Error al actualizar el estatus de pago" },
      { status: 500 }
    );
  }
}
