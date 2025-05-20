"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import clsx from "clsx";

export default function PagePlan() {
  const planes = [
    {
      nombre: "Free",
      precio: "Gratis",
      descripcion: "Funciones básicas para comenzar.",
      beneficios: ["Acceso limitado", "Soporte estándar"],
    },
    {
      nombre: "Estándar",
      precio: "$5 / año",
      descripcion: "Hasta 5 delegados y funciones adicionales.",
      beneficios: ["5 delegados", "Soporte estándar", "Actualizaciones menores"],
    },
    {
      nombre: "Premium",
      precio: "$12 / año",
      descripcion: "Todas las funciones desbloqueadas y soporte prioritario.",
      beneficios: [
        "Velocidad de respuesta rápida",
        "Accesible siempre",
        "Acceso prioritario a funciones nuevas",
        "Soporte al cliente prioritario",
      ],
    },
  ];

  const [activado, setActivado] = useState(
    planes.reduce((acc, plan) => ({ ...acc, [plan.nombre]: false }), {})
  );

  const activarPlan = (nombre: string) => {
    setActivado((prev) => ({ ...prev, [nombre]: true }));
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Planes disponibles</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {planes.map((plan) => (
          <Card key={plan.nombre} className="glassmorphism border-primary/20">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white">{plan.nombre}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <CardDescription className="text-gray-400">{plan.descripcion}</CardDescription>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => activarPlan(plan.nombre)}
                >
                  Pagar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-lg text-white">{plan.precio}</div>
              
              <ul className="space-y-2 pt-2">
                {plan.beneficios.map((beneficio, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckCircle
                      className={clsx(
                        "w-5 h-5",
                        activado[plan.nombre] ? "text-green-500" : "text-gray-500"
                      )}
                    />
                    <span
                      className={clsx(
                        "text-sm",
                        activado[plan.nombre] ? "text-white" : "text-gray-400"
                      )}
                    >
                      {beneficio}
                    </span>
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
