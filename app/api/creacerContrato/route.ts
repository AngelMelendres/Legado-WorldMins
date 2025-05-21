import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const {
      id_usuario,
      wallet,
      porcentaje,
      releaseTime,
      mensaje,
      firma,
      address,
    } = await req.json();

    // Validación de campos requeridos
    if (
      !id_usuario ||
      !wallet ||
      !porcentaje ||
      !releaseTime ||
      !firma ||
      !address
    ) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios para registrar el contrato." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("contratos_herencia")
      .insert([
        {
          id_usuario,
          wallet,
          porcentaje,
          release_time: new Date(releaseTime * 1000), // convertir de timestamp unix
          mensaje,
          firma,
          address,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("❌ Error al insertar contrato:", error.message);
      return NextResponse.json(
        { error: "No se pudo guardar el contrato." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("❌ Error inesperado en crearContrato:", err.message);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
