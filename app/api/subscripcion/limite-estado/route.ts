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
    console.log("⛔️ id_usuario no proporcionado");
    return NextResponse.json({ error: "id_usuario requerido" }, { status: 400 });
  }

  console.log("🔑 id_usuario:", id_usuario);

  // 1. Obtener subscripción activa
  const { data: sub, error: subError } = await supabase
    .from("user_subscriptions")
    .select("id_plan")
    .eq("id_usuario", id_usuario)
    .eq("is_active", true)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (subError) {
    console.error("❌ Error al obtener subscripción:", subError.message);
    return NextResponse.json({ error: subError.message }, { status: 500 });
  }

  console.log("📦 Subscripción activa:", sub);

  let limite = 2; // Límite por defecto

  // 2. Obtener plan asociado si existe
  if (sub) {
    const { data: plan, error: planError } = await supabase
      .from("planes")
      .select("limite_herederos")
      .eq("id", sub.id_plan)
      .eq("is_active", true)
      .single();

    if (planError) {
      console.error("❌ Error al obtener plan:", planError.message);
      return NextResponse.json({ error: planError.message }, { status: 500 });
    }

    console.log("📊 Plan activo encontrado:", plan);
    limite = plan.limite_herederos;
  } else {
    console.log("ℹ️ No se encontró subscripción activa. Se usará límite por defecto.");
  }

  // 3. Contar herederos actuales
  const { count, error: countError } = await supabase
    .from("herencias")
    .select("*", { count: "exact", head: true })
    .eq("id_usuario", id_usuario);

  if (countError) {
    console.error("❌ Error al contar herederos:", countError.message);
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }

  console.log("🔢 Herederos actuales:", count);

  // 4. Devolver resultado final
  return NextResponse.json({
    limite_herederos: limite,
    herederos_actuales: count,
    puede_agregar: count < limite,
  });
}
