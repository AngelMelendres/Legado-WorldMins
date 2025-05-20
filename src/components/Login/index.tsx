"use client";

import { useState, useEffect, useCallback } from "react";
import { useMiniKit } from "@worldcoin/minikit-js/minikit-provider";
import { walletAuth } from "@/auth/wallet";
import { Button } from "@/components/ui/button";
import AnimatedBackground from "@/components/animated-background";
import Image from "next/image";

const Login = () => {
  const [isPending, setIsPending] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isInstalled } = useMiniKit();

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleLogin = useCallback(async () => {
    if (!isInstalled || isPending) return;

    setIsPending(true);
    setError(null);

    try {
      await walletAuth();
    } catch (err: any) {
      setError("Error al iniciar sesión: " + err.message);
    } finally {
      setIsPending(false);
    }
  }, [isInstalled, isPending]);

  return (
    <div className="mobile-app">
      <main className="mobile-content flex flex-col items-center justify-center relative overflow-hidden min-h-screen">
        <AnimatedBackground />

        <div
          className={`max-w-md w-full space-y-8 text-center transition-opacity duration-1000 ${
            fadeIn ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex justify-center">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/LogFinal.png"
                  alt="Logo CertiMind"
                  width={67}
                  height={67}
                  className="rounded-full"
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
              disabled={isPending}
              size="lg"
              className="w-full py-6 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg"
            >
              {isPending ? (
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

          {error && <p className="text-red-500 text-sm mt-4">❌ {error}</p>}
        </div>
      </main>
    </div>
  );
};

export default Login;
