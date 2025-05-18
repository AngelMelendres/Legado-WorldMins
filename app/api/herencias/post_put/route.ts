import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { error, data } = await supabase
      .from("herencias")
      .insert([body])
      .select();

    if (error) {
      console.error("Error al crear herencia:", error.message); // log
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0]);
  } catch (err: any) {
    console.error("Error interno en POST:", err.message); // log
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    if (!body.id) {
      console.warn("ID faltante en actualización"); // log
      return NextResponse.json(
        { error: "Falta el ID para actualizar" },
        { status: 400 }
      );
    }

    const { error, data } = await supabase
      .from("herencias")
      .update(body)
      .eq("id", body.id)
      .select();

    if (error) {
      console.error("Error al actualizar herencia:", error.message); // log
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0]);
  } catch (err: any) {
    console.error("Error interno en PUT:", err.message); // log
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
