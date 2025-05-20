"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { MiniKit, WalletAuthInput } from "@worldcoin/minikit-js";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import AnimatedBackground from "@/components/animated-background";
import MobileNavbar from "@/components/mobile-navbar";
import Image from "next/image";
import localImage from './imagen.png'; // si estás en el mismo nivel

const walletAuthInput = (nonce: string): WalletAuthInput => ({
  nonce,
  requestId: "0",
  expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  notBefore: new Date(Date.now() - 60 * 60 * 1000),
  statement: "Inicia sesión con Legado usando tu World ID",
});

export default function Home() {
  const router = useRouter();
  const { setTheme } = useTheme();

  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFadeIn(true);
    setTheme("dark");
  }, [setTheme]);

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

        localStorage.setItem(
          "certimind_user",
          JSON.stringify({
            id,
            username,
            status,
            profilePictureUrl,
            walletAddress: worldcoinUser?.walletAddress, 
          })
        );

        router.push("/inicio");
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
    <div className="mobile-app">
      <main className="mobile-content flex flex-col items-center justify-center relative overflow-hidden min-h-screen">
        <AnimatedBackground />

        <div
          className={`max-w-md w-full space-y-8 text-center transition-opacity duration-1000 ${fadeIn ? "opacity-100" : "opacity-0"
            }`}
        >
          <div className="flex justify-center">
           <div className="relative w-32 h-24 mb-2">
            <div className="absolute inset-0 flex items-center justify-center">
             <Image
               src={localImage}
               alt="Logo CertiMind"
               width={150} // ajustado al contenedor
               height={170}
               className="rounded-full object-contain"
                />
                </div>
             </div>

          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Legado
          </h1>

          <div className="mt-6 space-y-6">
            <p className="text-xl text-white/90 font-light">
              Tu legado, protegido para quienes amas
            </p>
            <p className="text-sm text-white/70 italic">
              Porque hay cosas que no deberían perderse, ni siquiera en tu
              ausencia.
            </p>
          </div>

          <div className="mt-10">
            <Button
              onClick={handleLogin}
              disabled={loading}
              size="lg"
              className="w-full py-6 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
                  Conectando...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Ingresar con World ID
                </div>
              )}
            </Button>
          </div>

          {userId && (
            <div className="text-green-500 text-sm space-y-1 mt-4">
              <p>✅ Sesión iniciada</p>
              <p>ID: {userId}</p>
              {username && <p>Usuario: {username}</p>}
              {status && <p>Estado: {status}</p>}
              {profilePicture && (
                <Image
                  src={profilePicture}
                  alt="Foto de perfil"
                  width={40}
                  height={40}
                  className="rounded-full mx-auto mt-2"
                />
              )}
            </div>
          )}

          {error && <p className="text-red-500 text-sm mt-2">❌ {error}</p>}
        </div>
      </main>

      <MobileNavbar />
    </div>
  );
}
