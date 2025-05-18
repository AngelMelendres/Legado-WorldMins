import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { walletAddress } = await req.json();

  if (!walletAddress) {
    return NextResponse.json({ error: "Falta walletAddress" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("id", walletAddress)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function PATCH(req: Request) {
  const { walletAddress, updates } = await req.json();

  if (!walletAddress || !updates) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  const { error } = await supabase
    .from("usuarios")
    .update(updates)
    .eq("id", walletAddress);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
