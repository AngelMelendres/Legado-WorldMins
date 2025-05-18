import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// GET ?id=... → Obtener proyecto por ID
// POST { walletAddress } → Obtener todos del usuario
// POST { proyecto } → Crear nuevo
// PATCH { id, updates } → Actualizar proyecto

export async function POST(req: NextRequest) {
  const body = await req.json();

  // 🔍 Si viene walletAddress, devolver todos los proyectos del usuario
  if (body.walletAddress) {
    const { data, error } = await supabase
      .from("proyectos")
      .select("*")
      .eq("id_usuario", body.walletAddress);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  }

  // 🔧 Si viene proyecto, crear uno nuevo
  const { proyecto, archivos } = body;

  if (
    !proyecto?.titulo ||
    !proyecto?.descripcion ||
    !proyecto?.modo_auditoria ||
    !proyecto?.id_categoria ||
    !proyecto?.id_usuario
  ) {
    return NextResponse.json(
      { error: "Faltan campos obligatorios del proyecto" },
      { status: 400 }
    );
  }

  const { data: proyectoCreado, error: errorProyecto } = await supabase
    .from("proyectos")
    .insert([proyecto])
    .select("id")
    .single();

  if (errorProyecto) {
    return NextResponse.json(
      { error: errorProyecto.message },
      { status: 500 }
    );
  }

  const id_proyecto = proyectoCreado.id;

  if (Array.isArray(archivos) && archivos.length > 0) {
    const archivosInsert = archivos.map((a) => ({
      ruta: a.nombre,
      peso: a.peso,
      tipo: a.tipo,
      id_proyecto,
    }));

    const { error: errorArchivos } = await supabase
      .from("archivos")
      .insert(archivosInsert);

    if (errorArchivos) {
      return NextResponse.json(
        { error: errorArchivos.message },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ success: true, id_proyecto });
}


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Falta parámetro 'id'" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("proyectos")
    .select(`
      *,
      categorias(nombre),
      archivos(id, ruta, peso, tipo, created_at)
    `)
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}


export async function PATCH(req: NextRequest) {
  const { id, updates } = await req.json();

  if (!id || !updates) {
    return NextResponse.json(
      { error: "Faltan 'id' o 'updates'" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("proyectos")
    .update(updates)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
