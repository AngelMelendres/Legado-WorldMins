import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { payload, nonce, user } = await req.json();

    if (!payload || payload.status !== "success" || !payload.address) {
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }

    const walletAddress = payload.address.toLowerCase();
    const clientIp = req.headers.get("x-forwarded-for") || null;
    const userAgent = req.headers.get("user-agent") || null;

    const { username, profilePictureUrl, status } = user || {};
    const worldName = username;
    const picture = profilePictureUrl;
    const estado = status ?? "activo";

    let dbUser;

    // Buscar si ya existe
    const { data: existingUser, error: fetchError } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id", walletAddress)
      .single();

    if (fetchError) {
      // Insertar nuevo usuario
      const { data: newUser, error: insertError } = await supabase
        .from("usuarios")
        .insert([
          {
            id: walletAddress,
            wallet_address: walletAddress,
            world_name: worldName,
            picture,
            estado,
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error("❌ Error insertando usuario:", insertError);
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
          error: "No se pudo crear usuario",
        });
      }

      dbUser = newUser;
    } else {
      // Actualizar usuario existente
      const { data: updatedUser, error: updateError } = await supabase
        .from("usuarios")
        .update({
          wallet_address: walletAddress,
          world_name: worldName,
          picture,
          estado,
        })
        .eq("id", walletAddress)
        .select()
        .single();

      if (updateError) {
        console.error("❌ Error actualizando usuario:", updateError);
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
          error: "No se pudo actualizar usuario",
        });
      }

      dbUser = updatedUser;
    }

    // Log de sesión exitosa
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
      user: {
        id: dbUser.id,
        username: dbUser.world_name,
        profilePictureUrl: dbUser.picture,
        status: dbUser.estado,
      },
    });
  } catch (error: any) {
    console.error("❌ Error inesperado en login:", error);
    await supabase.from("sesiones_log").insert([
      {
        wallet_address: "desconocido",
        world_name: "desconocido",
        resultado: "fallo",
        mensaje: error.message,
        ip: req.headers.get("x-forwarded-for") || null,
        user_agent: req.headers.get("user-agent") || null,
      },
    ]);

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
