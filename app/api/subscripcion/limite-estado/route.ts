// /api/subscripcion/limite-estado.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { id_usuario } = await req.json();

  if (!id_usuario) {
    return NextResponse.json({ error: "id_usuario requerido" }, { status: 400 });
  }

  // Obtener límite del plan activo
  const { data: sub, error: subError } = await supabase
    .from("user_subscriptions")
    .select("id_plan")
    .eq("id_usuario", id_usuario)
    .eq("is_active", true)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (subError) return NextResponse.json({ error: subError.message }, { status: 500 });

  let limite = 1; // Por defecto

  if (sub) {
    const { data: plan, error: planError } = await supabase
      .from("planes")
      .select("limite_herederos")
      .eq("id", sub.id_plan)
      .eq("is_active", true)
      .single();

    if (planError) return NextResponse.json({ error: planError.message }, { status: 500 });
    limite = plan.limite_herederos;
  }

  // Contar herederos existentes
  const { count, error: countError } = await supabase
    .from("herencias")
    .select("*", { count: "exact", head: true })
    .eq("id_usuario", id_usuario);

  if (countError) return NextResponse.json({ error: countError.message }, { status: 500 });

  return NextResponse.json({
    limite_herederos: limite,
    herederos_actuales: count,
    puede_agregar: count < limite,
  });
}
