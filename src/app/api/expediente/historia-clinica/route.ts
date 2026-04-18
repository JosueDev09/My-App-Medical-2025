import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Obtener historia clínica de un paciente
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const intPaciente = searchParams.get("intPaciente");

    if (!intPaciente) {
      return NextResponse.json(
        { error: "ID de paciente requerido" },
        { status: 400 }
      );
    }

    const query = `
      SELECT * FROM tbHistoriaClinica
      WHERE intPaciente = ?
    `;

    const [rows]: any = await db.query(query, [parseInt(intPaciente)]);

    return NextResponse.json({
      success: true,
      historia: rows.length > 0 ? rows[0] : null,
    });
  } catch (error: any) {
    console.error("Error al obtener historia clínica:", error);
    return NextResponse.json(
      { error: "Error al obtener historia clínica" },
      { status: 500 }
    );
  }
}

// POST - Crear historia clínica
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const query = `
      INSERT INTO tbHistoriaClinica (
        intPaciente,
        strDiabetes,
        strHipertension,
        strCancer,
        strCardiopatias,
        strEnfermedadesRenales,
        txtDetallesHeredo,
        txtCirugiasPrevias,
        txtHospitalizaciones,
        txtTransfusiones,
        txtFracturas,
        txtAlergiasMedicamentos,
        txtEnfermedadesCronicas,
        strTabaquismo,
        intCigarrillosDia,
        intAniosFumando,
        strAlcoholismo,
        strFrecuenciaAlcohol,
        strDrogas,
        txtTipoDrogas,
        strActividadFisica,
        txtAlimentacion,
        intMenarca,
        datFechaUltimaMenstruacion,
        intGestas,
        intPartos,
        intCesareas,
        intAbortos,
        txtMetodoAnticonceptivo,
        txtComplicacionesObstetricas,
        isCompleto
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result]: any = await db.query(query, [
      data.intPaciente,
      data.strDiabetes || "NO_SABE",
      data.strHipertension || "NO_SABE",
      data.strCancer || "NO_SABE",
      data.strCardiopatias || "NO_SABE",
      data.strEnfermedadesRenales || "NO_SABE",
      data.txtDetallesHeredo || null,
      data.txtCirugiasPrevias || null,
      data.txtHospitalizaciones || null,
      data.txtTransfusiones || null,
      data.txtFracturas || null,
      data.txtAlergiasMedicamentos || null,
      data.txtEnfermedadesCronicas || null,
      data.strTabaquismo || "NO",
      data.intCigarrillosDia || 0,
      data.intAniosFumando || 0,
      data.strAlcoholismo || "NO",
      data.strFrecuenciaAlcohol || null,
      data.strDrogas || "NO",
      data.txtTipoDrogas || null,
      data.strActividadFisica || null,
      data.txtAlimentacion || null,
      data.intMenarca || null,
      data.datFechaUltimaMenstruacion || null,
      data.intGestas || 0,
      data.intPartos || 0,
      data.intCesareas || 0,
      data.intAbortos || 0,
      data.txtMetodoAnticonceptivo || null,
      data.txtComplicacionesObstetricas || null,
      data.isCompleto ? 1 : 0,
    ]);

    // Obtener el registro creado
    const [created]: any = await db.query(
      "SELECT * FROM tbHistoriaClinica WHERE intHistoriaClinica = ?",
      [result.insertId]
    );

    return NextResponse.json({
      success: true,
      message: "Historia clínica creada exitosamente",
      historia: created[0],
    });
  } catch (error: any) {
    console.error("Error al crear historia clínica:", error);
    return NextResponse.json(
      { error: "Error al crear historia clínica", details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Actualizar historia clínica
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();

    const query = `
      UPDATE tbHistoriaClinica SET
        strDiabetes = ?,
        strHipertension = ?,
        strCancer = ?,
        strCardiopatias = ?,
        strEnfermedadesRenales = ?,
        txtDetallesHeredo = ?,
        txtCirugiasPrevias = ?,
        txtHospitalizaciones = ?,
        txtTransfusiones = ?,
        txtFracturas = ?,
        txtAlergiasMedicamentos = ?,
        txtEnfermedadesCronicas = ?,
        strTabaquismo = ?,
        intCigarrillosDia = ?,
        intAniosFumando = ?,
        strAlcoholismo = ?,
        strFrecuenciaAlcohol = ?,
        strDrogas = ?,
        txtTipoDrogas = ?,
        strActividadFisica = ?,
        txtAlimentacion = ?,
        intMenarca = ?,
        datFechaUltimaMenstruacion = ?,
        intGestas = ?,
        intPartos = ?,
        intCesareas = ?,
        intAbortos = ?,
        txtMetodoAnticonceptivo = ?,
        txtComplicacionesObstetricas = ?,
        isCompleto = ?
      WHERE intPaciente = ?
    `;

    await db.query(query, [
      data.strDiabetes || "NO_SABE",
      data.strHipertension || "NO_SABE",
      data.strCancer || "NO_SABE",
      data.strCardiopatias || "NO_SABE",
      data.strEnfermedadesRenales || "NO_SABE",
      data.txtDetallesHeredo || null,
      data.txtCirugiasPrevias || null,
      data.txtHospitalizaciones || null,
      data.txtTransfusiones || null,
      data.txtFracturas || null,
      data.txtAlergiasMedicamentos || null,
      data.txtEnfermedadesCronicas || null,
      data.strTabaquismo || "NO",
      data.intCigarrillosDia || 0,
      data.intAniosFumando || 0,
      data.strAlcoholismo || "NO",
      data.strFrecuenciaAlcohol || null,
      data.strDrogas || "NO",
      data.txtTipoDrogas || null,
      data.strActividadFisica || null,
      data.txtAlimentacion || null,
      data.intMenarca || null,
      data.datFechaUltimaMenstruacion || null,
      data.intGestas || 0,
      data.intPartos || 0,
      data.intCesareas || 0,
      data.intAbortos || 0,
      data.txtMetodoAnticonceptivo || null,
      data.txtComplicacionesObstetricas || null,
      data.isCompleto ? 1 : 0,
      data.intPaciente,
    ]);

    // Obtener el registro actualizado
    const [updated]: any = await db.query(
      "SELECT * FROM tbHistoriaClinica WHERE intPaciente = ?",
      [data.intPaciente]
    );

    return NextResponse.json({
      success: true,
      message: "Historia clínica actualizada exitosamente",
      historia: updated[0],
    });
  } catch (error: any) {
    console.error("Error al actualizar historia clínica:", error);
    return NextResponse.json(
      { error: "Error al actualizar historia clínica", details: error.message },
      { status: 500 }
    );
  }
}
