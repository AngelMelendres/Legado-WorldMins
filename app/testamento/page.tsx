"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileText, Save, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MiniKit } from "@worldcoin/minikit-js";
import Swal from "sweetalert2";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import MobileLayout from "@/components/mobile-layout";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

export default function TestamentoPage() {
  const router = useRouter();
  const [fadeIn, setFadeIn] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [nombre, setNombre] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  useEffect(() => {
    setFadeIn(true);

    const userData = localStorage.getItem("certimind_user");
    if (userData) {
      const parsed = JSON.parse(userData);
      setUserId(parsed.username || null);
    }
  }, []);

  const handleSign = async () => {
    if (!aceptaTerminos || !userId) {
      Swal.fire({
        title: "Información incompleta",
        text: "Debes completar tu nombre y aceptar los términos para continuar.",
        confirmButtonColor: "#6366f1",
        background: "#0f0c1f",
        color: "#ffffff", // texto blanco
      });
      return;
    }

    setIsLoading(true); // 🟡 Inicia el estado de carga

    const mensaje = `
Yo ${userId}, en pleno uso de mis facultades mentales, declaro que este es mi testamento digital.
Autorizo a LEGADO a registrar esta voluntad mediante contrato inteligente y World ID.
`.trim();

    try {
      const { finalPayload } = await MiniKit.commandsAsync.signMessage({
        message: mensaje,
      });

      if (finalPayload.status !== "success") {
        setIsLoading(false);
        Swal.fire({
          title: "Firma fallida",
          text: "No se pudo firmar el mensaje con World ID.",
          confirmButtonColor: "#d33",
          background: "#0f0c1f",
          color: "#ffffff", // texto blanco
        });
        return;
      }

      const { signature, address } = finalPayload;

      const res = await fetch("/api/firmar-testamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, message: mensaje, signature }),
      });

      const data = await res.json();

      if (!res.ok) {
        setIsLoading(false);
        Swal.fire({
          title: "Error al guardar",
          text: data.error || "No se pudo guardar el testamento.",
          confirmButtonColor: "#d33",
          background: "#0f0c1f",
          color: "#ffffff", // texto blanco
        });
        return;
      }

      // Éxito
      Swal.fire({
        title: "Testamento firmado",
        text: "Tu voluntad digital ha sido firmada y registrada exitosamente.",
        confirmButtonColor: "#4ade80",
        background: "#0f0c1f",
        color: "#ffffff", // texto blanco
      });

      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        router.push("/ajustes"); // ✅ Redirigir después de mostrar confetti
      }, 3000);
    } catch (error: any) {
      console.error("❌ Error al firmar o enviar:", error);
      Swal.fire({
        icon: "error",
        title: "Error inesperado",
        text: error.message || "Ocurrió un error inesperado.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsLoading(false); // 🟢 Siempre apagar el estado de carga
    }
  };

  return (
    <MobileLayout>
      <div
        className={`space-y-6 transition-opacity duration-700 ${
          fadeIn ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Mi Legado Digital
          </h1>
          <p className="text-gray-400 text-sm">
            Declara tu voluntad de forma segura en la blockchain
          </p>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg gap-1">
          <div className="flex items-center backdrop:blur-sm">
            <Clock className="w-5 h-5 mr-2 text-primary" />
            <span className="font-medium text-white text-sm">
              Última actualización
            </span>
          </div>
          <Badge
            variant="outline"
            className="flex items-center bg-primary/10 text-primary border-primary/30"
          >
            <Calendar className="w-3 h-3 mr-1" />
            {new Date().toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </Badge>
        </div>

        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  backgroundColor: `hsl(${45 + Math.random() * 30}, ${
                    70 + Math.random() * 30
                  }%, ${70 + Math.random() * 20}%)`,
                  width: `${5 + Math.random() * 10}px`,
                  height: `${5 + Math.random() * 10}px`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        )}

        <Card className="glassmorphism border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-white">
              <FileText className="w-5 h-5 mr-2 text-primary" />
              Documento de voluntad
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-white text-sm leading-relaxed">
            <p>
              Yo <span className="font-semibold text-primary">{userId}</span>,
              en pleno uso de mis facultades mentales, declaro que este es mi
              testamento digital.
            </p>

            <p>
              Deseo que mis activos digitales sean distribuidos según los
              porcentajes asignados a mis herederos dentro de esta plataforma.
            </p>

            <p>
              Esta aplicación utiliza identidad verificada mediante World ID y
              deja constancia legal de este documento a través de contratos
              inteligentes en la red Worldchain.
            </p>

            <p>
              Al aceptar, autorizo el uso de esta plataforma, consiento el
              registro de mi voluntad digital, y reconozco que este documento
              tiene validez legal bajo el sistema digital adoptado por LEGADO.
            </p>

            <div className="flex items-center space-x-2 mt-4">
              <Checkbox
                id="aceptar"
                checked={aceptaTerminos}
                onCheckedChange={(val) => setAceptaTerminos(!!val)}
              />
              <label
                htmlFor="aceptar"
                className="text-sm text-gray-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Acepto los términos, condiciones y el uso de la aplicación
                LEGADO.
              </label>
            </div>
          </CardContent>

          <CardFooter>
            <Button
              onClick={handleSign}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isLoading ? (
                "Cargando..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Firmar con World
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MobileLayout>
  );
}
