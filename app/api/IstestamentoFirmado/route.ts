import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { wallet } = await req.json();

    if (!wallet) {
      return NextResponse.json({ error: "Falta wallet" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("testamentos_firmados")
      .select("id")
      .eq("wallet_address", wallet);

    if (error) {
      console.error("Error verificando firma:", error.message);
      return NextResponse.json(
        { error: "Error al verificar firma" },
        { status: 500 }
      );
    }

    return NextResponse.json({ firmado: !!data });
  } catch (err: any) {
    console.error("Error en la API:", err.message);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
