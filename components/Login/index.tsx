"use client";
import { MiniKit, WalletAuthInput } from "@worldcoin/minikit-js";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const walletAuthInput = (nonce: string): WalletAuthInput => {
  return {
    nonce,
    requestId: "0",
    expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
    notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
    statement:
      "This is my statement and here is a link https://worldcoin.com/apps",
  };
};

type User = {
  walletAddress: string;
  username: string | null;
  profilePictureUrl: string | null;
};

export const Login = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 🧼 Limpiar localStorage y estado al montar
  useEffect(() => {
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/nonce`);
      const { nonce } = await res.json();
      document.cookie = `siwe=${nonce}; path=/; secure`;

      // Asegurar que MiniKit esté instalado
      while (!MiniKit.isInstalled) {
        await new Promise((r) => setTimeout(r, 100));
      }

      const { finalPayload } = await MiniKit.commandsAsync.walletAuth(
        walletAuthInput(nonce)
      );

      if (finalPayload.status === "error") {
        console.error("Falló walletAuth:", finalPayload);
        setLoading(false);
        return;
      }

      const miniUser = MiniKit.user;

      if (!miniUser) {
        console.error("MiniKit.user es null");
        alert(
          "No se pudo obtener el usuario. Asegúrate de estar en la World App."
        );
        setLoading(false);
        return;
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payload: finalPayload,
          nonce,
          user: {
            walletAddress: miniUser.walletAddress,
            username: miniUser.username,
            profilePictureUrl: miniUser.profilePictureUrl,
          },
        }),
      });

      if (response.status === 200) {
        setUser(miniUser);
        localStorage.setItem("user", JSON.stringify(miniUser));
        window.dispatchEvent(new Event("storage"));
        router.push("/projects");
      }

      setLoading(false);
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {!user ? (
        <Button onClick={handleLogin} disabled={loading}>
          {loading ? "Conectando..." : "Iniciar Sesión"}
        </Button>
      ) : (
        <div className="flex flex-col items-center space-y-2">
          <div className="text-green-600 font-medium">✓ Conectado</div>
          <div className="flex items-center space-x-2">
            {user?.profilePictureUrl && (
              <img
                src={user.profilePictureUrl}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="font-medium">
              {user?.username ||
                user?.walletAddress.slice(0, 6) +
                  "..." +
                  user?.walletAddress.slice(-4)}
            </span>
          </div>
          <Button
            onClick={handleLogout}
            variant="secondary"
            size="md"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Cerrar Sesión"}
          </Button>
        </div>
      )}
    </div>
  );
};
