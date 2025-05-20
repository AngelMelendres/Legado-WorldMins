import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { address, message, signature } = await req.json();

    if (!address || !message || !signature) {
      return NextResponse.json(
        { error: "Datos incompletos para firmar el testamento." },
        { status: 400 }
      );
    }

    // Guarda el testamento firmado en Supabase
    const { data, error } = await supabase
      .from("testamentos_firmados")
      .insert([
        {
          wallet_address: address,
          mensaje: message,
          firma: signature,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("❌ Error insertando testamento:", error.message);
      return NextResponse.json(
        { error: "No se pudo guardar el testamento." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("❌ Error inesperado:", err.message);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
