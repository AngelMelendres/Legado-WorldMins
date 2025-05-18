"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Upload,
  Save,
  Film,
  ImageIcon,
  Lock,
  MessageCircle,
  Clock,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MobileLayout from "@/components/mobile-layout";
import { Badge } from "@/components/ui/badge";

export default function TestamentoPage() {
  const router = useRouter();
  const [fadeIn, setFadeIn] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [testamento, setTestamento] = useState("");
  const [archivos, setArchivos] = useState<string[]>([]);

  useEffect(() => {
    setFadeIn(true);
    // Simulación de carga de datos
    setTestamento(
      "Yo, Edison, en pleno uso de mis facultades mentales, declaro que este es mi testamento digital. Deseo que mis activos digitales sean distribuidos según los porcentajes asignados a cada heredero en esta plataforma..."
    );
  }, []);

  const handleSave = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };

  const handleFileUpload = () => {
    // Simulación de carga de archivo
    setArchivos([...archivos, "Documento_legal.pdf"]);
  };

  return (
    <MobileLayout>
      <div
        className={`space-y-6 transition-opacity duration-700 ${
          fadeIn ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight  text-white">
            Mi Testamento
          </h1>
          <p className="text-muted-foreground  text-gray-400">
            Redacta y adjunta documentos que expresen tu voluntad
          </p>
        </div>

        <div className="flex items-center justify-between  p-3 rounded-lg">
          <div className="flex items-center backdrop:blur-sm">
            <Clock className="w-5 h-5 mr-2 text-primary" />
            <span className="font-medium text-white">Última actualización</span>
          </div>
          <Badge
            variant="outline"
            className="flex items-center bg-primary/10 text-primary border-primary/30"
          >
            <Calendar className="w-3 h-3 mr-1" />
            15/04/2025
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
              <FileText className="w-5 h-5 mr-2 text-primary text-white" />
              Documento de voluntad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="texto" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4  bg-gray-900">
                <TabsTrigger
                  value="texto"
                  className="flex items-center text-xs "
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Texto
                </TabsTrigger>
                <TabsTrigger
                  value="archivos"
                  className="flex items-center text-xs"
                >
                  <FileText className="w-3 h-3 mr-1" />
                  Archivo
                </TabsTrigger>
              </TabsList>

              <TabsContent value="texto" className="space-y-4">
                <Textarea
                  placeholder="Escribe aquí tu testamento..."
                  value={testamento}
                  onChange={(e) => setTestamento(e.target.value)}
                  className="min-h-[200px] bg-transparent text-white font-light border-none"
                  style={{ fontFamily: "Georgia, serif" }}
                />

                <p className="text-xs text-muted-foreground  text-gray-400">
                  Este texto será considerado como parte de tu voluntad legal.
                  Asegúrate de ser claro y específico.
                </p>
              </TabsContent>

              <TabsContent value="archivos" className="space-y-4">
                <div className="border-2 border-dashed border-primary/20 rounded-lg p-6 text-center space-y-4">
                  <div className="flex flex-col items-center">
                    <Upload className="h-10 w-10 text-muted-foreground mb-2 text-white" />
                    <h3 className="font-medium text-white">
                      Sube tu documento
                    </h3>
                    <p className="text-sm text-muted-foreground text-white">
                      Arrastra y suelta archivo PDF o documento escaneados
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    onClick={handleFileUpload}
                    className="mt-2"
                  >
                    Seleccionar archivo
                  </Button>
                </div>

                {archivos.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <h4 className="text-sm font-medium">Archivo subido</h4>
                    <ul className="space-y-2">
                      {archivos.map((archivo, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between p-2 bg-primary/5 rounded-md"
                        >
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-primary" />
                            <span className="text-sm">{archivo}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            PDF
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </TabsContent>

            </Tabs>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Save className="mr-2 h-4 w-4" />
              Guardar testamento
            </Button>
          </CardFooter>
        </Card>

        <div className="mt-4">
          <Button
            onClick={() => router.push("/testamento/detalle")}
            className="w-full bg-black text-white hover:bg-black/90 border-none"
          >
            Ver testamento completo
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
