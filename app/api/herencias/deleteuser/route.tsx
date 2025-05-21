// /api/herencias/deleteuser/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(req: NextRequest) {
  try {
    const { id_usuario, id } = await req.json(); // ← aquí debe ser wallet

    if (!id_usuario || !id) {
      return NextResponse.json(
        { error: "Se requiere id_usuario y wallet." },
        { status: 400 }
      );
    }

   
    // Eliminar la herencia
    const { error: deleteError } = await supabase
      .from("herencias")
      .delete()
      .eq("id_usuario", id_usuario)
      .eq("id", id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Herencia eliminada correctamente.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Error interno del servidor." },
      { status: 500 }
    );
  }
}
