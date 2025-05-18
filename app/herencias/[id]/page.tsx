"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  User,
  Wallet,
  MessageCircle,
  FileText,
  ImageIcon,
  Video,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import MobileLayout from "@/components/mobile-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function HerederoDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [fadeIn, setFadeIn] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [porcentaje, setPorcentaje] = useState(25);
  const [nombre, setNombre] = useState("");
  const [wallet, setWallet] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [incluirMensaje, setIncluirMensaje] = useState(false);
  const [incluirArchivos, setIncluirArchivos] = useState(false);
  const [incluirFotos, setIncluirFotos] = useState(false);
  const [incluirVideo, setIncluirVideo] = useState(false);
  const [archivos, setArchivos] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(false);

  const isNewHeredero = params.id === "nuevo";

  useEffect(() => {
    setFadeIn(true);

    // Si no es un nuevo heredero, cargar datos
    if (!isNewHeredero) {
      // Simulación de carga de datos
      setNombre("María García");
      setWallet("0x71C7656EC7ab88b098defB751B7401B5f6d8976F");
      setPorcentaje(40);
      setIncluirMensaje(true);
      setIncluirArchivos(true);
      setMensaje(
        "Querida María, este es mi legado para ti. Espero que lo utilices sabiamente y recuerdes siempre los buenos momentos que compartimos."
      );
    }
  }, [isNewHeredero]);

  useEffect(() => {
    // Validación simple
    setIsValid(nombre.length > 0 && wallet.length > 0);
  }, [nombre, wallet]);

  const handleSave = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      router.push("/herencias");
    }, 2000);
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
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4 text-white" />
          </Button>
          <h1 className="text-xl font-bold tracking-tight text-white">
            {isNewHeredero ? "Nuevo heredero" : "Editar heredero"}
          </h1>
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
            <CardTitle className="text-lg flex items-center text-secondary ">
              <User className="w-5 h-5 mr-2 text-primary" />
              Información del heredero
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center mb-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-primary/20 text-xl">
                  {nombre ? nombre.charAt(0).toUpperCase() : "?"}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-white">
                  Nombre completo
                </Label>
                <Input
                  id="nombre"
                  placeholder="Nombre del heredero"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="bg-gray-900/80 border-none text-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="wallet"
                  className="flex items-center text-white"
                >
                  <Wallet className="w-4 h-4 mr-2 text-white" />
                  Dirección de wallet
                </Label>
                <Input
                  id="wallet"
                  placeholder="0x..."
                  value={wallet}
                  onChange={(e) => setWallet(e.target.value)}
                  className="bg-gray-900/80 border-none text-gray-300 text-sm"
                />
                {wallet && (
                  <p className="text-xs text-muted-foreground mt-1 text-gray-400">
                    La wallet debe ser compatible con World App
                  </p>
                )}
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center">
                  <Label className="text-white">Porcentaje asignado</Label>
                  <span className="text-2xl font-bold text-primary">
                    {porcentaje}%
                  </span>
                </div>
                <Slider
                  value={[porcentaje]}
                  min={1}
                  max={100}
                  step={1}
                  onValueChange={(value) => setPorcentaje(value[0])}
                  className="py-4"
                />
                <p className="text-xs text-muted-foreground text-gray-400">
                  Recuerda que la suma total de porcentajes entre todos los
                  herederos debe ser 100%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism border-primary/20 mt-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-secondary">
              <FileText className="w-5 h-5 mr-2 text-primary" />
              Testamento para este heredero
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="mensaje" className="w-full bg">
              <TabsList className="grid grid-cols-4 mb-4  rounded-lg bg-gray-900">
                <TabsTrigger
                  value="mensaje"
                  className="flex items-center text-xs "
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Mensaje
                </TabsTrigger>
                <TabsTrigger
                  value="archivos"
                  className="fl`ex items-center text-xs"
                >
                  <FileText className="w-3 h-3 mr-1" />
                  Archivos
                </TabsTrigger>
                <TabsTrigger
                  value="fotos"
                  className="flex items-center text-xs"
                >
                  <ImageIcon className="w-3 h-3 mr-1" />
                  Fotos
                </TabsTrigger>
                <TabsTrigger
                  value="video"
                  className="flex items-center text-xs"
                >
                  <Video className="w-3 h-3 mr-1" />
                  Video
                </TabsTrigger>
              </TabsList>

              <TabsContent value="mensaje" className="space-y-4">
                <div className="flex items-center text-secondary justify-between">
                  <Label
                    htmlFor="incluir-mensaje"
                    className="flex items-center"
                  >
                    Incluir mensaje personal
                  </Label>
                  <Switch
                    id="incluir-mensaje"
                    checked={incluirMensaje}
                    onCheckedChange={setIncluirMensaje}
                  />
                </div>

                {incluirMensaje && (
                  <>
                    <Textarea
                      placeholder="Escribe un mensaje personal para este heredero..."
                      value={mensaje}
                      onChange={(e) => setMensaje(e.target.value)}
                      className="min-h-[150px] border-none bg-black/50 font-light"
                      style={{
                        fontFamily: "Georgia, serif",
                        color: "white",
                        // Esto afecta al placeholder solo si usas Tailwind/Next UI personalizado o globales CSS
                      }}
                    />

                    <p className="text-xs text-muted-foreground text-secundary">
                      Este mensaje será entregado al heredero cuando se active
                      tu legado.
                    </p>
                  </>
                )}
              </TabsContent>

              <TabsContent value="archivos" className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="incluir-archivos"
                    className="flex items-center  text-white"
                  >
                    Incluir archivos
                  </Label>
                  <Switch
                    id="incluir-archivos"
                    checked={incluirArchivos}
                    onCheckedChange={setIncluirArchivos}
                  />
                </div>

                {incluirArchivos && (
                  <>
                    <div className="border-2 border-dashed border-primary/20 rounded-lg p-4 text-center space-y-2">
                      <div className="flex flex-col items-center">
                        <FileText className="h-8 w-8 text-muted-foreground mb-2  text-white" />
                        <p className="text-sm  text-white">
                          Sube documentos para este heredero
                        </p>
                      </div>

                      <Button
                        onClick={handleFileUpload}
                        size="sm"
                        className="mt-2 bg-black text-white hover:bg-black/90 border-none"
                      >
                        Seleccionar archivo
                      </Button>
                    </div>

                    {archivos.length > 0 && (
                      <div className="space-y-2 mt-2">
                        <h4 className="text-sm font-medium">
                          Archivos subidos
                        </h4>
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
                  </>
                )}
              </TabsContent>

              <TabsContent value="fotos" className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="incluir-fotos" className="flex items-center  text-white">
                    Incluir fotografías
                  </Label>
                  <Switch
                    id="incluir-fotos"
                    checked={incluirFotos}
                    onCheckedChange={setIncluirFotos}
                  />
                </div>

                {incluirFotos && (
                  <div className="border-2 border-dashed border-primary/20 rounded-lg p-4 text-center space-y-2">
                    <div className="flex flex-col items-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground mb-2  text-white" />
                      <p className="text-sm  text-white">
                        Sube fotografías para este heredero
                      </p>
                    </div>

                    <Button
                      size="sm"
                      className="mt-2 bg-black text-white hover:bg-black/90 border-none"
                    >
                      Seleccionar fotos
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="video" className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="incluir-video" className="flex items-center  text-white">
                    Incluir video personal
                  </Label>
                  <Switch
                    id="incluir-video"
                    checked={incluirVideo}
                    onCheckedChange={setIncluirVideo}
                  />
                </div>

                {incluirVideo ? (
                  <div className="border-2 border-dashed border-primary/20 rounded-lg p-4 text-center space-y-2">
                    <div className="flex flex-col items-center">
                      <Lock className="h-8 w-8 text-muted-foreground mb-2  text-white" />
                      <h3 className="font-medium  text-white">Función Premium</h3>
                      <p className="text-xs text-muted-foreground  text-white">
                        Activa WLegacy Premium para añadir un video personal
                        para este heredero.
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white hover:from-yellow-600 hover:to-amber-600 border-none"
                    >
                      Activar Premium
                    </Button>
                  </div>
                ) : null}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleSave}
              disabled={!isValid}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Save className="mr-2 h-4 w-4" />
              Guardar cambios
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MobileLayout>
  );
}
