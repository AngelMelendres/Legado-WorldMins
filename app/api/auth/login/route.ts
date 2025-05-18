import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  MiniAppWalletAuthSuccessPayload,
  verifySiweMessage,
} from "@worldcoin/minikit-js";
import { SignJWT } from "jose";
import { nanoid } from "nanoid";

interface IRequestPayload {
  payload: MiniAppWalletAuthSuccessPayload;
  nonce: string;
  user: {
    walletAddress: string;
    username: string | null;
    profilePictureUrl: string | null;
  };
}

export const POST = async (req: NextRequest) => {
  const { payload, nonce, user } = (await req.json()) as IRequestPayload;
  const cookieStore = cookies();
  const siwe = cookieStore.get("siwe");

  const clientIp = req.headers.get("x-forwarded-for") || null;
  const userAgent = req.headers.get("user-agent") || null;
  const walletAddress = payload.address?.toLowerCase() || null;

  // Validar nonce
  if (nonce !== siwe?.value) {
    await supabase.from("sesiones_log").insert([
      {
        wallet_address: walletAddress,
        world_name: user?.username,
        resultado: "fallo",
        mensaje: "Nonce inválido",
        ip: clientIp,
        user_agent: userAgent,
      },
    ]);

    return NextResponse.json({ status: "error", isValid: false });
  }

  try {
    const validMessage = await verifySiweMessage(payload, nonce);

    if (!validMessage.isValid) {
      await supabase.from("sesiones_log").insert([
        {
          wallet_address: walletAddress,
          world_name: user?.username,
          resultado: "fallo",
          mensaje: "SIWE inválido",
          ip: clientIp,
          user_agent: userAgent,
        },
      ]);

      return NextResponse.json({ status: "error", isValid: false });
    }

    const worldName = user.username;
    const picture = user.profilePictureUrl;

    // Buscar usuario en Supabase
    const { data: existingUser, error: fetchError } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id", walletAddress)
      .single();

    let dbUser;

    if (fetchError) {
      const { data: newUser, error: insertError } = await supabase
        .from("usuarios")
        .insert([
          {
            id: walletAddress,
            wallet_address: walletAddress,
            world_name: worldName,
            picture: picture,
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error("Error insertando usuario:", insertError);

        await supabase.from("sesiones_log").insert([
          {
            wallet_address: walletAddress,
            world_name: worldName,
            resultado: "fallo",
            mensaje: insertError.message,
            ip: clientIp,
            user_agent: userAgent,
          },
        ]);

        return NextResponse.json({
          status: "error",
          message: "No se pudo crear usuario",
        });
      }

      dbUser = newUser;
    } else {
      const { data: updatedUser, error: updateError } = await supabase
        .from("usuarios")
        .update({
          wallet_address: walletAddress,
          world_name: worldName,
          picture: picture,
        })
        .eq("id", walletAddress)
        .select()
        .single();

      if (updateError) {
        console.error("Error actualizando usuario:", updateError);

        await supabase.from("sesiones_log").insert([
          {
            wallet_address: walletAddress,
            world_name: worldName,
            resultado: "fallo",
            mensaje: updateError.message,
            ip: clientIp,
            user_agent: userAgent,
          },
        ]);

        return NextResponse.json({
          status: "error",
          message: "No se pudo actualizar usuario",
        });
      }

      dbUser = updatedUser;
    }

    // Crear JWT
    const token = await new SignJWT({
      userId: dbUser.id,
      walletAddress,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .setJti(nanoid())
      .sign(
        new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret")
      );

    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    // 🔐 Log de sesión exitosa
    await supabase.from("sesiones_log").insert([
      {
        wallet_address: walletAddress,
        world_name: worldName,
        resultado: "exito",
        mensaje: null,
        ip: clientIp,
        user_agent: userAgent,
      },
    ]);

    return NextResponse.json({
      status: "success",
      isValid: true,
      user: dbUser,
    });
  } catch (error: any) {
    console.error("Login error:", error);

    await supabase.from("sesiones_log").insert([
      {
        wallet_address: walletAddress,
        world_name: user?.username,
        resultado: "fallo",
        mensaje: error.message,
        ip: clientIp,
        user_agent: userAgent,
      },
    ]);

    return NextResponse.json({ status: "error", message: error.message });
  }
};
