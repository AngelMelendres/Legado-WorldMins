"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import clsx from "clsx";
import PaymentButton from "@/app/ajustes/payment/PaymentButton";

const planes = [
  {
    nombre: "Free",
    precioWLD: 0,
    descripcion: "Funciones básicas para comenzar.",
    beneficios: ["Acceso limitado", "Soporte estándar"],
  },
  {
    nombre: "Estándar",
    precioWLD: 0.3,
    descripcion: "Hasta 5 delegados y funciones adicionales.",
    beneficios: ["5 delegados", "Soporte estándar", "Actualizaciones menores"],
  },
  {
    nombre: "Premium",
    precioWLD: 0.5,
    descripcion: "Todas las funciones desbloqueadas y soporte prioritario.",
    beneficios: [
      "Velocidad de respuesta rápida",
      "Accesible siempre",
      "Acceso prioritario a funciones nuevas",
      "Soporte al cliente prioritario",
    ],
  },
];

export default function PagePlan() {
  const [usdRate, setUsdRate] = useState<number | null>(null);
  const [planComprado, setPlanComprado] = useState<string | null>(null); // ✅ estado

  useEffect(() => {
    const fetchUSD = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=worldcoin-wld&vs_currencies=usd"
        );
        const data = await res.json();
        setUsdRate(data["worldcoin-wld"].usd);
      } catch (error) {
        console.error("Error al obtener la tasa WLD/USD:", error);
      }
    };

    fetchUSD();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white text-center">Planes disponibles</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {planes.map((plan) => (
          <Card
            key={plan.nombre}
            className={clsx(
              "glassmorphism border-primary/20 transition-all",
              planComprado === plan.nombre && "border-green-500 bg-green-500/10"
            )}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white">{plan.nombre}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {plan.descripcion}
                  </CardDescription>

                  {plan.precioWLD > 0 && usdRate && (
                    <p className="text-sm text-gray-300 pt-2">
                      <strong>{plan.precioWLD} WLD</strong> —{" "}
                      <strong>${(plan.precioWLD * usdRate).toFixed(2)} USD</strong>
                    </p>
                  )}

                  {plan.precioWLD === 0 && (
                    <p className="text-lg text-white pt-2 font-semibold">Gratis</p>
                  )}
                </div>

                {plan.precioWLD > 0 && (
                  <div className="ml-4">
                    <PaymentButton
                      amountWLD={plan.precioWLD}
                      description={`Activación del plan ${plan.nombre} de Legado`}
                      onSuccess={() => setPlanComprado(plan.nombre)} // ✅ se pinta la tarjeta
                    />
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.beneficios.map((beneficio, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-400">{beneficio}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
