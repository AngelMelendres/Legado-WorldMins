"use client";

import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { MiniKit, WalletAuthInput } from "@worldcoin/minikit-js";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import { signIn } from "next-auth/react";

import MobileHeader from "@/components/mobile-header";
import MobileNavbar from "@/components/mobile-navbar";

const walletAuthInput = (nonce: string): WalletAuthInput => {
  return {
    nonce,
    requestId: "0",
    expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    notBefore: new Date(Date.now() - 60 * 60 * 1000),
    statement: "Inicia sesión con CertiMind usando tu World ID",
  };
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    setUserId(null);

    try {
      // Paso 1: Obtener nonce
      const res = await fetch("/api/nonce");
      const { nonce } = await res.json();

      // Paso 2: World ID
      const { finalPayload } = await MiniKit.commandsAsync.walletAuth(
        walletAuthInput(nonce)
      );

      if (!finalPayload || finalPayload.status !== "success") {
        setError("Fallo en autenticación con World ID.");
        return;
      }

      // Paso 3: Validar con backend
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload: finalPayload, nonce }),
      });

      const loginData = await loginRes.json();
      if (!loginRes.ok) {
        setError(loginData.error || "Fallo validando con el servidor.");
        return;
      }

      const userWalletId = loginData.user?.id;
      console.log("🔐 Usuario recibido del backend:", userWalletId);

      if (!userWalletId) {
        setError("El backend no devolvió el ID del usuario.");
        return;
      }

      // Paso 4: Iniciar sesión con NextAuth
      const result = await signIn("credentials", {
        redirect: false,
        walletAddress: userWalletId,
      });

      if (result?.ok) {
        setUserId(userWalletId);
        console.log("✅ Sesión iniciada con ID:", userWalletId);
      } else {
        setError("No se pudo iniciar sesión con NextAuth.");
        console.error("❌ Falló signIn:", result);
      }
    } catch (err: any) {
      setError("Error inesperado: " + err.message);
      console.error("❌ Error en login:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-background">
      <MobileHeader title="CertiMind" />

      <main className="flex-1 px-4 pb-16">
        <section className="py-10">
          <div className="space-y-6 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/30 to-primary/10 shadow-inner flex items-center justify-center">
              <ShieldCheck className="h-9 w-9 text-primary" />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-foreground">
              CertiMind
            </h1>
            <p className="text-base font-semibold text-muted-foreground leading-snug">
              Registra tu creatividad. Protege tu identidad. Demuestra tu
              autoría.
            </p>
            <div className="text-sm text-muted-foreground max-w-xs mx-auto space-y-1 leading-relaxed">
              <p>
                CertiMind te permite registrar ideas, diseños o prototipos con
                verificación humana y certificado digital inmediato.
              </p>
              <p>
                Puedes usar un seudónimo o activar el modo legal si necesitas
                mayor validez jurídica. Todo en menos de un minuto.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center pt-4 space-y-2">
              <Button onClick={handleLogin} disabled={loading}>
                {loading ? "Conectando..." : "Iniciar sesión con World ID"}
              </Button>

              {userId && (
                <p className="text-green-600 text-sm">
                  ✅ Sesión iniciada. ID: {userId}
                </p>
              )}

              {error && <p className="text-red-500 text-sm">❌ {error}</p>}
            </div>
          </div>
        </section>
      </main>

      <MobileNavbar />
    </div>
  );
}
