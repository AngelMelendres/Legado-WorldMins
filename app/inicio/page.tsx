"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  Activity,
  AlertCircle,
  HandCoins,
  Settings,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MobileLayout from "@/components/mobile-layout";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

const WLD_CONTRACT = "0x163f8c2467924be0ae7b5347228cabf260318753";

const getWLDPriceInUSD = async (): Promise<number> => {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=worldcoin-wld&vs_currencies=usd"
  );
  const data = await res.json();
  return data["worldcoin-wld"].usd;
};

const getWLDBalance = async (walletAddress: string): Promise<number> => {
  const client = createPublicClient({
    chain: mainnet,
    transport: http(),
  });

  const balance = await client.readContract({
    address: WLD_CONTRACT,
    abi: [
      {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function",
      },
    ],
    functionName: "balanceOf",
    args: [walletAddress],
  });

  return Number(balance) / 1e18;
};

export default function Legados() {
  const router = useRouter();
  const [fadeIn, setFadeIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [legacyProgress, setLegacyProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  const [balance, setBalance] = useState(0);
  const [balanceUSD, setBalanceUSD] = useState(0);

  useEffect(() => {
    setMounted(true);
    setFadeIn(true);

    const userData = localStorage.getItem("certimind_user");
    if (userData) {
      const parsed = JSON.parse(userData);
      setUsername(parsed.username || null);

      const fetchData = async () => {
        try {
          const wldBalance = await getWLDBalance(parsed.walletAddress);
          const usdPrice = await getWLDPriceInUSD();
          setBalance(wldBalance);
          setBalanceUSD(wldBalance * usdPrice);
        } catch (err) {
          console.error("Error al obtener balance o precio:", err);
        }
      };

      const fetchLegacyPercentage = async () => {
        try {
          const res = await fetch("/api/herencias", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_usuario: parsed.id }),
          });

          const data = await res.json();
          if (Array.isArray(data)) {
            const total = data.reduce(
              (sum, item) => sum + (item.porcentaje || 0),
              0
            );
            setLegacyProgress(total);
          } else {
            console.warn("La respuesta no es un arreglo:", data);
          }
        } catch (error) {
          console.error("Error al obtener porcentaje legado:", error);
        }
      };

      fetchData();
      fetchLegacyPercentage();
    }
  }, []);

  if (!mounted) return null;

  return (
    <MobileLayout>
      <div
        className={`space-y-6 transition-opacity duration-700 ${
          fadeIn ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="space-y-2">
          <h1 className="text-2xl text-white font-bold tracking-tight">
            Hola, {username ?? "usuario"} 👋
          </h1>
          <p className="text-muted-foreground text-gray-400">
            Tu legado está en buenas manos.
          </p>
        </div>

        <Card className="glassmorphism border-primary/20 text-center py-6 px-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl font-bold text-white">
              🪙 {balance.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-sm text-muted-foreground text-gray-400">
              Actualmente tienes (WLD)
            </p>
            <p className="text-xs text-muted-foreground text-gray-500 mt-4">
              Equivale a {balanceUSD.toFixed(2)} $ USD
            </p>
          </CardContent>
        </Card>

        <Card className="glassmorphism border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-white flex items-center ">
              <Activity className="w-5 h-5 mr-2 text-primary" />
              Estado de tu legado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 text-yellow-500" />
                <span className="text-sm text-white">Última conexión</span>
              </div>
              <span className="text-sm text-white">Hace 2 días</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                <span className="text-sm text-white">Estado</span>
              </div>
              <span className="text-sm bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full ">
                Verificado
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <HandCoins className="w-4 h-4 mr-2 text-yellow-500" />
                <span className="text-sm text-white">Porcentaje legado</span>
              </div>
              <span className="text-sm text-white">{legacyProgress}%</span>
            </div>

            <div className="w-full bg-secondary rounded-full h-2 mt-2">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: `${legacyProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground text-center text-gray-400">
              {legacyProgress}% de tu patrimonio ha sido legado
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <Card
            className="glassmorphism hover:bg-primary/5 transition-all cursor-pointer border-primary/20"
            onClick={() => router.push("/legados")}
          >
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                <HandCoins className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-medium text-white">Mis legados</h3>
            </CardContent>
          </Card>

          <Card
            className="glassmorphism hover:bg-primary/5 transition-all cursor-pointer border-primary/20"
            onClick={() => router.push("/configuracion")}
          >
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                <Settings className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-medium text-white">Ajustes</h3>
            </CardContent>
          </Card>
        </div>
      </div>
    </MobileLayout>
  );
}
