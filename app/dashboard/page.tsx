"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  CheckCircle,
  Activity,
  TrendingUp,
  DollarSign,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MobileLayout from "@/components/mobile-layout";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";

export default function Dashboard() {
  const router = useRouter();
  const [fadeIn, setFadeIn] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [tooltipData, setTooltipData] = useState({
    x: 0,
    y: 0,
    value: 0,
    date: "",
  });
  const [priceHistory, setPriceHistory] = useState<[number, number][]>([]);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [wrcGlobal, setWrcGlobal] = useState<{
    price: number;
    marketCap: number;
    supply: number;
    change24h: number;
  } | null>(null);
  useEffect(() => {
    setMounted(true);
    setFadeIn(true);

    const userData = localStorage.getItem("certimind_user");
    if (userData) {
      const parsed = JSON.parse(userData);
      setUsername(parsed.username || null);
    }

    // Simulación de interacción con el gráfico
    const handleChartInteraction = (e: MouseEvent) => {
      if (!chartRef.current) return;

      const rect = chartRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Solo mostrar tooltip si el cursor está dentro del área del gráfico
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        const value = 2.5 + Math.sin(x / 30) * 0.5;
        const date = new Date(
          Date.now() - (rect.width - x) * 24 * 60 * 60 * 1000
        ).toLocaleDateString();

        setTooltipData({
          x: x + rect.left,
          y: y + rect.top - 40,
          value: Number.parseFloat(value.toFixed(2)),
          date,
        });
        setTooltipVisible(true);
      } else {
        setTooltipVisible(false);
      }
    };

    const chartElement = chartRef.current;
    if (chartElement) {
      chartElement.addEventListener("mousemove", handleChartInteraction);
      chartElement.addEventListener("touchmove", handleChartInteraction as any);
      chartElement.addEventListener("mouseleave", () =>
        setTooltipVisible(false)
      );
    }

    return () => {
      if (chartElement) {
        chartElement.removeEventListener("mousemove", handleChartInteraction);
        chartElement.removeEventListener(
          "touchmove",
          handleChartInteraction as any
        );
        chartElement.removeEventListener("mouseleave", () =>
          setTooltipVisible(false)
        );
      }
    };
  }, []);

  useEffect(() => {
    const fetchWRCGlobalData = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/worldcoin"
        );
        const data = await res.json();
        setWrcGlobal({
          price: data.market_data.current_price.usd,
          marketCap: data.market_data.market_cap.usd,
          supply: data.market_data.circulating_supply,
          change24h: data.market_data.price_change_percentage_24h,
        });
      } catch (error) {
        console.error("Error al obtener datos de Worldcoin:", error);
      }
    };

    fetchWRCGlobalData();
  }, []);

  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/worldcoin/market_chart?vs_currency=usd&days=30"
        );
        const data = await res.json();
        setPriceHistory(data.prices); // [timestamp, price]
      } catch (err) {
        console.error("Error al obtener precios históricos:", err);
      }
    };

    fetchPriceHistory();
  }, []);

  function generatePath(
    data: [number, number][],
    width: number,
    height: number,
    isFill = false
  ): string {
    const maxPrice = Math.max(...data.map(([_, price]) => price));
    const minPrice = Math.min(...data.map(([_, price]) => price));
    const priceRange = maxPrice - minPrice || 1;

    const stepX = width / (data.length - 1);

    const path = data
      .map(([_, price], i) => {
        const x = i * stepX;
        const y = height - ((price - minPrice) / priceRange) * height;
        return `${i === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");

    if (isFill) {
      return `${path} L${width},${height} L0,${height} Z`;
    }

    return path;
  }

  if (!mounted) return null;

  return (
    <MobileLayout>
      <div
        className={`space-y-6 transition-opacity duration-700 ${
          fadeIn ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="space-y-2">
          <h1 className="text-2xl  text-white font-bold tracking-tight">
            Hola, {username ?? "usuario"} 👋
          </h1>
          <p className="text-muted-foreground text-gray-400">
            Tu legado está en buenas manos.
          </p>
        </div>

        {wrcGlobal && (
          <Card className="glassmorphism border-primary/20 text-center py-6 px-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold text-white">
                ${wrcGlobal.price.toFixed(2)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-sm text-muted-foreground text-gray-400">
                Precio actual de Worldcoin (WRC)
              </p>
              <p className="text-xs text-muted-foreground text-gray-500">
                Equivale a {wrcGlobal.price.toFixed(2)} USDT
              </p>
            </CardContent>
          </Card>
        )}

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
                <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="text-sm text-white">
                  Tiempo de verificación
                </span>
              </div>
              <span className="text-sm text-white">30 días</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 text-yellow-500" />
                <span className="text-sm text-white">Ultima conexión</span>
              </div>
              <span className="text-sm text-white">Hace 2 días</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                <span className="text-sm text-white">Estado</span>
              </div>
              <span className="text-sm bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full ">
                Activo
              </span>
            </div>

            <div className="w-full bg-secondary rounded-full h-2 mt-2">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: "50%" }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground text-center text-gray-400">
              50% del tiempo de verificación transcurrido
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <Card
            className="glassmorphism hover:bg-primary/5 transition-all cursor-pointer border-primary/20"
            onClick={() => router.push("/herencias")}
          >
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-medium text-white">Mis Herencias</h3>
              <p className="text-xs text-muted-foreground mt-1 text-gray-400">
                3 herederos
              </p>
            </CardContent>
          </Card>

          <Card
            className="glassmorphism hover:bg-primary/5 transition-all cursor-pointer border-primary/20"
            onClick={() => router.push("/configuracion")}
          >
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-medium text-white">Configuración</h3>
              <p className="text-xs text-muted-foreground mt-1 text-gray-400">
                Ajustes de tiempo
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MobileLayout>
  );
}
