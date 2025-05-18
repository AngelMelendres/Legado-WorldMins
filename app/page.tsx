"use client";

import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { MiniKit, WalletAuthInput } from "@worldcoin/minikit-js";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
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
  const [username, setUsername] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    setUserId(null);
    setUsername(null);
    setStatus(null);
    setProfilePicture(null);

    try {
      const res = await fetch("/api/nonce");
      const { nonce } = await res.json();

      const { finalPayload } = await MiniKit.commandsAsync.walletAuth(
        walletAuthInput(nonce)
      );

      if (!finalPayload || finalPayload.status !== "success") {
        setError("Fallo en autenticación con World ID.");
        return;
      }

      const worldcoinUser = MiniKit.user;

      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payload: finalPayload,
          nonce,
          user: {
            walletAddress: worldcoinUser?.walletAddress,
            username: worldcoinUser?.username,
            profilePictureUrl: worldcoinUser?.profilePictureUrl,
            status: worldcoinUser?.status,
          },
        }),
      });

      const loginData = await loginRes.json();
      if (!loginRes.ok || !loginData.user?.id) {
        setError(loginData.error || "Fallo validando con el servidor.");
        return;
      }

      const result = await signIn("credentials", {
        redirect: false,
        walletAddress: loginData.user.id,
      });

      if (result?.ok) {
        const { id, username, status, profilePictureUrl } = loginData.user;

        setUserId(id);
        setUsername(username);
        setStatus(status);
        setProfilePicture(profilePictureUrl);

        const storedUser = {
          id,
          username,
          status,
          profilePictureUrl,
        };

        localStorage.setItem("certimind_user", JSON.stringify(storedUser));
        router.push("/pagos"); // redirección después del login
      } else {
        setError("No se pudo iniciar sesión con NextAuth.");
      }
    } catch (err: any) {
      setError("Error inesperado: " + err.message);
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
                <div className="text-green-600 text-sm mt-2 space-y-1">
                  <p>✅ Sesión iniciada</p>
                  <p>ID: {userId}</p>
                  {username && <p>Usuario: {username}</p>}
                  {status && <p>Estado: {status}</p>}
                  {profilePicture && (
                    <img
                      src={profilePicture}
                      alt="Foto de perfil"
                      className="w-12 h-12 rounded-full mx-auto mt-2"
                    />
                  )}
                </div>
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
