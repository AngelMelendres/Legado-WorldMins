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

export default function ConfiguracionPage() {
  const [fadeIn, setFadeIn] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [tiempoVerificacion, setTiempoVerificacion] = useState("30");
  const [notificacionesActivas, setNotificacionesActivas] = useState(true);
  const [autenticacionDoble, setAutenticacionDoble] = useState(false);
  const [idiomaSeleccionado, setIdiomaSeleccionado] = useState("es");
  const [nivelSeguridad, setNivelSeguridad] = useState(75);
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
        className={`space-y-6 transition-opacity duration-700 ${
          fadeIn ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Configuración
          </h1>
          <p className="text-muted-foreground">
            Personaliza tu experiencia en WLegacy
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
                  backgroundColor: `hsl(${240 + Math.random() * 60}, ${
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
              <Clock className="w-5 h-5 mr-2 text-primary text-white" />
              Tiempo de verificación
            </CardTitle>
            <CardDescription>
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
                  <SelectItem value="7">7 días</SelectItem>
                  <SelectItem value="15">15 días</SelectItem>
                  <SelectItem value="30">30 días</SelectItem>
                  <SelectItem value="60">60 días</SelectItem>
                  <SelectItem value="90">90 días</SelectItem>
                  <SelectItem value="180">180 días</SelectItem>
                  <SelectItem value="365">365 días</SelectItem>
                </SelectContent>
              </Select>

              <p className="text-xs text-muted-foreground">
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
              <p className="text-xs text-muted-foreground">
                Recibirás notificaciones antes de que se active tu legado para
                confirmar tu actividad.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism border-primary/20 mt-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-white">
              <Shield className="w-5 h-5 mr-2 text-primary text-white" />
              Seguridad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="autenticacion-doble" className="text-white">
                  Autenticación de dos factores
                </Label>
                <Switch
                  id="autenticacion-doble"
                  checked={autenticacionDoble}
                  onCheckedChange={setAutenticacionDoble}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Añade una capa adicional de seguridad a tu cuenta.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-white">
                <Label>Nivel de seguridad</Label>
                <Badge
                  variant="outline"
                  className={`
                    ${
                      nivelSeguridad < 40
                        ? "bg-red-500/20 text-red-400 border-red-500/30"
                        : nivelSeguridad < 70
                        ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        : "bg-green-500/20 text-green-400 border-green-500/30"
                    }
                  `}
                >
                  {nivelSeguridad < 40
                    ? "Bajo"
                    : nivelSeguridad < 70
                    ? "Medio"
                    : "Alto"}
                </Badge>
              </div>
              <Slider
                value={[nivelSeguridad]}
                min={0}
                max={100}
                step={1}
                disabled
                className="py-4"
              />

              {!autenticacionDoble && (
                <div className="flex items-start space-x-2 p-2 bg-yellow-500/10 rounded-md">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-yellow-400">
                    Activa la autenticación de dos factores para aumentar tu
                    nivel de seguridad.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism border-primary/20 mt-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-white">
              <Smartphone className="w-5 h-5 mr-2 text-primary" />
              Preferencias
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-cente text-white">
                <Label htmlFor="tema-oscuro" className="flex items-center">
                  {theme === "dark" ? (
                    <Moon className="w-4 h-4 mr-2" />
                  ) : (
                    <Sun className="w-4 h-4 mr-2" />
                  )}
                  {theme === "dark" ? "Tema oscuro" : "Tema claro"}
                </Label>
                <Switch
                  id="tema-oscuro"
                  checked={theme === "dark"}
                  onCheckedChange={toggleTheme}
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Label htmlFor="idioma" className="flex items-center text-white">
                <Languages className="w-4 h-4 mr-2 text-white" />
                Idioma
              </Label>
              <Select
                value={idiomaSeleccionado}
                onValueChange={setIdiomaSeleccionado}
              >
                <SelectTrigger className="w-full bg-black text-white border-none">
                  <SelectValue placeholder="Selecciona un idioma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
