"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  Shield,
  Save,
  ChevronRight,
  Moon,
  Smartphone,
  Languages,
  HelpCircle,
  AlertTriangle,
  Sun,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import MobileLayout from "@/components/mobile-layout";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

export default function ConfiguracionPage() {
  const router = useRouter();
  const [fadeIn, setFadeIn] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [tiempoVerificacion, setTiempoVerificacion] = useState("30");
  const [notificacionesActivas, setNotificacionesActivas] = useState(true);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setFadeIn(true);
  }, []);

  const handleSave = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };
  const handleVerPlanes = () => {
    router.push("/ajustes/pagePlan");
  };

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  if (!mounted) return null;

  return (
    <MobileLayout>
      <div
        className={`space-y-6 transition-opacity duration-700 ${fadeIn ? "opacity-100" : "opacity-0"
          }`}
      >
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Configuración
          </h1>
          <p className="text-muted-foreground text-gray-400">
            Personaliza tu experiencia en Legado
          </p>
        </div>

        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  backgroundColor: `hsl(${240 + Math.random() * 60}, ${70 + Math.random() * 30
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
              <Clock className="w-5 h-5 mr-2 text-primary text-white" />
              Tiempo de verificación
            </CardTitle>
            <CardDescription className="text-gray-400">
              Establece el tiempo de inactividad antes de activar tu legado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="tiempo-verificacion" className="text-white">
                  Período de inactividad
                </Label>
                <Badge
                  variant="outline"
                  className="bg-black text-white border-none"
                >
                  {tiempoVerificacion} días
                </Badge>
              </div>

              <Select
                value={tiempoVerificacion}
                onValueChange={setTiempoVerificacion}
              >
                <SelectTrigger className="w-full bg-black text-white border-none">
                  <SelectValue placeholder="Selecciona un período" />
                </SelectTrigger>
                <SelectContent className="bg-black text-white">
                  <SelectItem value="30">30 días</SelectItem>
                  <SelectItem value="60">60 días</SelectItem>
                  <SelectItem value="90">90 días</SelectItem>
                  <SelectItem value="180">180 días</SelectItem>
                  <SelectItem value="365">365 días</SelectItem>
                </SelectContent>
              </Select>

              <p className="text-xs text-muted-foreground text-gray-400">
                Si no hay actividad en tu cuenta durante este período, se
                comenzará el proceso de notificación.
              </p>
            </div>

            <div className="pt-2 space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="tiempo-verificacion" className="text-white">
                  Notificaciones de verificación
                </Label>
                <Switch
                  id="notificaciones"
                  checked={notificacionesActivas}
                  onCheckedChange={setNotificacionesActivas}
                />
              </div>
              <p className="text-xs text-muted-foreground text-gray-400">
                Recibirás notificaciones antes de que se active tu legado para
                confirmar tu actividad.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="glassmorphism border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-white">
              <Shield className="w-5 h-5 mr-2 text-primary" />
              Plan de suscripción
            </CardTitle>
            <CardDescription className="text-gray-400">
              Conoce los planes disponibles y elige el que mejor se adapte a tus necesidades.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-md"
              onClick={handleVerPlanes} // ✅ MISMA estructura que `handleAddHeredero`
            >
              Ver planes
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4 mt-6">
          <Button
            variant="outline"
            className="w-full flex items-center justify-between  bg-black text-white border-none"
            size="lg"
          >
            <div className="flex items-center w-full bg-black text-white border-none">
              <HelpCircle className="w-4 h-4 mr-2w-full" />
              <span>Centro de ayuda</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </Button>

          <Button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            size="lg"
          >
            <Save className="mr-2 h-4 w-4" />
            Guardar cambios
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
