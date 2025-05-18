import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id_usuario = searchParams.get("id_usuario");

  if (!id_usuario) {
    return NextResponse.json({ error: "Falta el id_usuario" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("ajustes_herencia")
    .select("*")
    .eq("id_usuario", id_usuario)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { data, error } = await supabase
      .from("ajustes_herencia")
      .upsert(body, { onConflict: "id_usuario" }) // asegúrate de tener un UNIQUE constraint en id_usuario
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
