import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id_usuario = body.id_usuario;

    if (!id_usuario) {
      return NextResponse.json(
        { error: "id_usuario requerido" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("herencias")
      .select("porcentaje_asignado")
      .eq("id_usuario", id_usuario);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const total = data.reduce(
      (acc, h) => acc + (h.porcentaje_asignado ?? 0),
      0
    );

    return NextResponse.json({ porcentaje_total: total });
  } catch (err) {
    console.error("Error al calcular porcentaje total:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
