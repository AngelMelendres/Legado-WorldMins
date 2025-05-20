"use client";
import { Button, LiveFeedback } from "@worldcoin/mini-apps-ui-kit-react";
import { useMiniKit } from "@worldcoin/minikit-js/minikit-provider";
import { useCallback, useState } from "react";
import { walletAuth } from "@/auth/wallet"; // Asegúrate de tener esta función correctamente definida

export const AuthButton = () => {
  const [isPending, setIsPending] = useState(false);
  const { isInstalled } = useMiniKit();

  const handleLogin = useCallback(async () => {
    if (!isInstalled || isPending) return;

    setIsPending(true);
    try {
      await walletAuth(); // Aquí puedes manejar login y guardar sesión si lo necesitas
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsPending(false);
    }
  }, [isInstalled, isPending]);

  return (
    <LiveFeedback
      label={{
        failed: "Falló el inicio de sesión",
        pending: "Iniciando sesión...",
        success: "Sesión iniciada",
      }}
      state={isPending ? "pending" : undefined}
    >
      <Button
        onClick={handleLogin}
        disabled={isPending}
        size="lg"
        variant="primary"
        className="w-full"
      >
        INICIAR SESIÓN
      </Button>
    </LiveFeedback>
  );
};
