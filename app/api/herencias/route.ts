import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { id_usuario } = await req.json();

    if (!id_usuario) {
      return NextResponse.json(
        { error: "ID de usuario requerido" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("herencias")
      .select("*")
      .eq("id_usuario", id_usuario);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const resultado = data.map((item) => ({
      id: item.id,
      nombre: item.titulo,
      porcentaje: item.porcentaje_asignado,
      wallet: item.walletId,
      mensaje: item.tipo_media?.includes("mensaje") || false,
      archivos: item.tipo_media?.includes("archivos") || false,
      fotos: item.tipo_media?.includes("fotos") || false,
      video: item.tipo_media?.includes("video") || false,
    }));

    return NextResponse.json(resultado);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Error interno" },
      { status: 500 }
    );
  }
}
