// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ISuccessResult } from "@worldcoin/minikit-js";

export async function POST(req: NextRequest) {
  const { payload, nonce } = await req.json();

  // Validar la prueba con Worldcoin si quieres aquí
  if (!payload || payload.status !== "success") {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  const walletAddress = payload.nullifier_hash; // o usa .walletAddress si estás pasando eso

  return NextResponse.json({
    success: true,
    user: {
      id: walletAddress,
      name: walletAddress,
    },
  });
}
