import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { user_id } = await req.json();

    if (!user_id) {
      return NextResponse.json({ error: "Falta el user_id" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("testamentos_firmados")
      .select("id")
      .eq("wallet_address", user_id) // O ajusta a `user_id` si ese es el campo real
      .limit(1);

    if (error) {
      return NextResponse.json(
        { error: "Error al verificar testamento" },
        { status: 500 }
      );
    }

    const firmado = data.length > 0;

    return NextResponse.json({ firmado });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
