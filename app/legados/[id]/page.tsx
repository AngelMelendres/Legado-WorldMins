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
import { MiniKit } from "@worldcoin/minikit-js";
import PaymentABI from "@/abi/PaymentABI.json";
import { useWaitForTransactionReceipt } from "@worldcoin/minikit-react";
import { createPublicClient, http, parseUnits } from "viem";
import Swal from "sweetalert2";

const CONTRACT_ADDRESS = "0x7A90E10E9Efe5F796Be0A429aa846f457e15358D";
const TOKEN_ADDRESS = "0x163f8c2467924be0ae7b5347228cabf260318753";

const worldchain = {
  id: 88882,
  name: "World Chain",
  network: "worldchain",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://worldchain-mainnet.g.alchemy.com/public"],
    },
    public: {
      http: ["https://worldchain-mainnet.g.alchemy.com/public"],
    },
  },
  blockExplorers: {
    default: {
      name: "Worldchain Explorer",
      url: "https://worldchain-mainnet.explorer.alchemy.com",
    },
  },
} as const;

export default function HerederoDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const isNewHeredero = params.id === "nuevo";

  const [fadeIn, setFadeIn] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [wallet, setWallet] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [porcentaje, setPorcentaje] = useState(0);
  const [incluirMensaje, setIncluirMensaje] = useState(false);
  const [incluirArchivos, setIncluirArchivos] = useState(false);
  const [incluirFotos, setIncluirFotos] = useState(false);
  const [incluirVideo, setIncluirVideo] = useState(false);
  const [archivos, setArchivos] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(false);
  const [transactionId, setTransactionId] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [porcentajeTotalAsignado, setPorcentajeTotalAsignado] = useState(0);
  const [maxDisponible, setMaxDisponible] = useState(100);
  const [isLoadingHeredero, setIsLoadingHeredero] = useState(false);

  const client = createPublicClient({
    chain: worldchain,
    transport: http(),
  });

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    client,
    appConfig: {
      app_id: process.env.APP_ID!,
    },
    transactionId,
  });

useEffect(() => {
  setFadeIn(true);
  if (!isNewHeredero) {
    const fetchData = async () => {
      try {
        setIsLoadingHeredero(true);
        const res = await fetch(`/api/herencias/get?id=${params.id}`);
        const data = await res.json();

        console.log("Datos de la herencia:", data);
        setTitulo(data.titulo);
        setWallet(data.walletId);
        setPorcentaje(data.porcentaje_asignado);
        setMensaje(data.descripcion);
        setIncluirMensaje(data.tipo_media?.includes("mensaje"));
        setIncluirArchivos(data.tipo_media?.includes("archivos"));
        setIncluirFotos(data.tipo_media?.includes("fotos"));
        setIncluirVideo(data.tipo_media?.includes("video"));
      } catch (err) {
        console.error("Error al cargar la herencia:", err);
      } finally {
        setIsLoadingHeredero(false);
      }
    };

    fetchData();
  }

  fetchPorcentajeTotal();
}, [isNewHeredero, params.id]);


  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (wallet && wallet.startsWith("0x") && wallet.length === 42) {
        setIsVerifying(true);
        const valid = await validarWallet(wallet);
        setIsValid(valid);
        setIsVerifying(false);
      } else {
        setIsValid(false);
      }
    }, 500); // Delay para evitar validaciones en cada tecla

    return () => clearTimeout(timeout);
  }, [wallet]);

  const generarContrato = async () => {
    const releaseTime = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30 días
    const fechaFormateada = new Date(releaseTime * 1000).toLocaleDateString();

    const localUser = JSON.parse(
      localStorage.getItem("certimind_user") || "{}"
    );
    const id_usuario = localUser.id;
    const username = localUser.username || "usuario";

    if (!id_usuario || !wallet || porcentaje <= 0) {
      console.error("Faltan datos para generar el contrato.");
      return;
    }

    const mensaje = `
Yo ${username}, autorizo la creación de un contrato de herencia.
- Beneficiario: ${wallet}
- Porcentaje: ${porcentaje}%
- Fecha de liberación: ${fechaFormateada}
`.trim();

    try {
      const { finalPayload } = await MiniKit.commandsAsync.signMessage({
        message: mensaje,
      });

      if (finalPayload.status !== "success") {
        console.warn("Firma rechazada o fallida.");
        return;
      }

      const { signature, address } = finalPayload;

      const payload = {
        id_usuario,
        wallet,
        porcentaje,
        releaseTime,
        mensaje,
        firma: signature,
        address,
      };

      console.log("📝 Enviando payload firmado:", payload);

      const res = await fetch("/api/creacerContrato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Error al guardar contrato:", data.error);
        Swal.fire({
          title: "Error al generar contrato",
          text: data.error || "No se pudo generar el contrato.",
          icon: "error",
          confirmButtonColor: "#d33",
          background: "#0f0c1f",
          color: "#ffffff",
        });
        return;
      }

      Swal.fire({
        title: "Contrato generado",
        text: "El contrato inteligente ha sido firmado y guardado exitosamente.",
        icon: "success",
        confirmButtonColor: "#4ade80",
        background: "#0f0c1f",
        color: "#ffffff",
      }).then(() => {
        router.push("/legados");
      });
    } catch (error) {
      console.error("Error durante la firma o el envío:", error);
      Swal.fire({
        icon: "error",
        title: "Error inesperado",
        text: "Ocurrió un error al firmar o guardar el contrato.",
        confirmButtonColor: "#d33",
        background: "#0f0c1f",
        color: "#ffffff",
      });
    }
  };

  const validarWallet = async (address: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/verify-wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      const data = await res.json();
      return data.valid;
    } catch (error) {
      console.error("Error al validar la wallet:", error);
      return false;
    }
  };
  const fetchPorcentajeTotal = async () => {
    console.log("fetchPorcentajeTotal");
    try {
      const localUser = JSON.parse(
        localStorage.getItem("certimind_user") || "{}"
      );
      if (!localUser.id) return;

      const res = await fetch("/api/herencias/porcentaje-total", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_usuario: localUser.id }),
      });

      const data = await res.json();
      if (!res.ok || typeof data.porcentaje_total !== "number") {
        console.warn("Respuesta inválida al obtener porcentaje total:", data);
        return;
      }

      let total = data.porcentaje_total;

      // Si estás editando un heredero existente, réstale su valor actual
      if (!isNewHeredero) {
        const resHeredero = await fetch(`/api/herencias/get?id=${params.id}`);
        const actual = await resHeredero.json();
        const actualValue = actual?.porcentaje_asignado ?? 0;
        total -= Number(actualValue);
      }

      const disponible = Math.max(0, 100 - total);

      setPorcentajeTotalAsignado(total);
      setMaxDisponible(disponible);
    } catch (err) {
      console.error("Error al calcular porcentaje total:", err);
      setMaxDisponible(100); // fallback
    }
  };

  const handleSave = async () => {
    const localUser = JSON.parse(
      localStorage.getItem("certimind_user") || "{}"
    );

    const payload = {
      ...(isNewHeredero ? {} : { id: parseInt(params.id) }),
      titulo,
      walletId: wallet,
      porcentaje_asignado: porcentaje,
      descripcion: mensaje,
      tipo_media: [
        incluirMensaje && "mensaje",
        incluirArchivos && "archivos",
        incluirFotos && "fotos",
        incluirVideo && "video",
      ]
        .filter(Boolean)
        .join(","),
      incluye_media:
        incluirMensaje || incluirArchivos || incluirFotos || incluirVideo,
      id_usuario: localUser.id,
    };

    console.log("Payload enviado al API:", payload);

    const res = await fetch("/api/herencias/post_put", {
      method: isNewHeredero ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Error guardando herencia:", data.error);
      Swal.fire({
        title: "Error al guardar",
        text: data.error || "No se pudo guardar el legado.",
        icon: "error",
        confirmButtonColor: "#d33",
        background: "#0f0c1f",
        color: "#ffffff",
      });
      return;
    }

    Swal.fire({
      title: "Guardado exitoso",
      text: "Los cambios se han guardado correctamente.",
      icon: "success",
      confirmButtonColor: "#4ade80",
      background: "#0f0c1f",
      color: "#ffffff",
    }).then(() => {
      router.push("/legados");
    });
  };

  const handleFileUpload = () => {
    setArchivos([...archivos, "Documento_legal.pdf"]);
  };

  const puedeGuardar =
    titulo.trim().length > 0 &&
    wallet.trim().length === 42 &&
    wallet.startsWith("0x") &&
    porcentaje > 0 &&
    isValid &&
    (!incluirMensaje || (incluirMensaje && mensaje.trim().length > 0)) &&
    !isVerifying;

  const puedeGenerarContrato = puedeGuardar;

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
            {isNewHeredero ? "Nuevo Legado" : "Editar Legado"}
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

        {isLoadingHeredero ? (
          <Card className="glassmorphism border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center text-secondary">
                <User className="w-5 h-5 mr-2 text-primary" /> Información de
                legado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 animate-pulse">
              <div className="flex justify-center mb-4">
                <div className="h-20 w-20 rounded-full bg-gray-700" />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="h-4 w-1/3 bg-gray-700 rounded" />
                  <div className="h-10 w-full bg-gray-800 rounded" />
                </div>

                <div className="space-y-2">
                  <div className="h-4 w-1/2 bg-gray-700 rounded" />
                  <div className="h-10 w-full bg-gray-800 rounded" />
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-1/4 bg-gray-700 rounded" />
                    <div className="h-6 w-12 bg-gray-700 rounded" />
                  </div>
                  <div className="h-6 w-full bg-gray-800 rounded" />
                  <div className="h-4 w-2/3 bg-gray-700 rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="glassmorphism border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center text-secondary">
                <User className="w-5 h-5 mr-2 text-primary" /> Información de
                legado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center mb-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="https://static.vecteezy.com/system/resources/thumbnails/021/468/808/small_2x/happy-friends-posing-together-png.png" />
                  <AvatarFallback className="bg-primary/20 text-xl">
                    {titulo ? titulo.charAt(0).toUpperCase() : "?"}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo" className="text-white">
                    Titulo del legado
                  </Label>
                  <Input
                    id="titulo"
                    placeholder="Titulo de la herencia"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="bg-gray-900/80 border-none text-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="wallet"
                    className="flex items-center text-white"
                  >
                    <Wallet className="w-4 h-4 mr-2 text-white" /> Dirección de
                    wallet
                  </Label>
                  <Input
                    id="wallet"
                    placeholder="0x..."
                    value={wallet}
                    onChange={(e) => setWallet(e.target.value)}
                    className="bg-gray-900/80 border-none text-gray-300 text-sm"
                  />

                  {wallet && (
                    <>
                      {isVerifying && (
                        <p className="text-xs mt-1 text-yellow-400">
                          Verificando wallet...
                        </p>
                      )}
                      {!isVerifying && isValid && (
                        <p className="text-xs mt-1 text-green-400">
                          ✅ Wallet válida
                        </p>
                      )}
                      {!isVerifying && !isValid && (
                        <p className="text-xs mt-1 text-red-400">
                          ❌ Wallet inválida. Asegúrate de que sea una dirección
                          válida.
                        </p>
                      )}
                    </>
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
                    max={isNaN(maxDisponible) ? 100 : maxDisponible}
                    step={1}
                    onValueChange={(value) => setPorcentaje(value[0])}
                    className="py-4"
                  />
                  {maxDisponible === 0 ? (
                    <p className="text-xs text-red-400">
                      Ya has asignado el 100%. Elimina o ajusta otro legado para
                      continuar.
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground text-gray-400">
                      Puedes asignar hasta {maxDisponible}%
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground text-gray-400">
                    Recuerda que la suma total de porcentajes entre todos los
                    herederos debe ser 100%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="glassmorphism border-primary/20 mt-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-secondary">
              <FileText className="w-5 h-5 mr-2 text-primary" /> Testamento para
              este legado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-white mb-4">
              <Label htmlFor="incluir-mensaje" className="flex items-center">
                Incluir mensaje personal
              </Label>
              <Switch
                id="incluir-mensaje"
                checked={incluirMensaje}
                onCheckedChange={setIncluirMensaje}
              />
            </div>
            <Tabs defaultValue="mensaje" className="w-full">
              <TabsList className="grid grid-cols-4 mb-4 rounded-lg bg-gray-900">
                <TabsTrigger value="mensaje" className="text-xs">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Mensaje
                </TabsTrigger>
                <TabsTrigger value="archivos" className="text-xs">
                  <FileText className="w-3 h-3 mr-1" />
                  Archivos
                </TabsTrigger>
                <TabsTrigger value="fotos" className="text-xs">
                  <ImageIcon className="w-3 h-3 mr-1" />
                  Fotos
                </TabsTrigger>
                <TabsTrigger value="video" className="text-xs">
                  <Video className="w-3 h-3 mr-1" />
                  Video
                </TabsTrigger>
              </TabsList>

              <TabsContent value="mensaje" className="space-y-4">
                {incluirMensaje && (
                  <>
                    <Textarea
                      placeholder="Escribe un mensaje personal..."
                      value={mensaje}
                      onChange={(e) => setMensaje(e.target.value)}
                      className="min-h-[150px] border-none bg-black/50 font-light text-white"
                      style={{ fontFamily: "Georgia, serif" }}
                    />
                    <p className="text-xs text-muted-foreground text-secundary">
                      Este mensaje será entregado al heredero cuando se active
                      tu legado.
                    </p>
                  </>
                )}
              </TabsContent>

              <TabsContent value="archivos" className="space-y-4">
                <div className="flex items-center justify-between text-white">
                  <Label htmlFor="incluir-archivos">Incluir archivos</Label>
                  <Switch
                    id="incluir-archivos"
                    checked={incluirArchivos}
                    onCheckedChange={setIncluirArchivos}
                  />
                </div>
                {incluirArchivos && (
                  <>
                    <div className="border-2 border-dashed border-primary/20 rounded-lg p-4 text-center space-y-2">
                      <FileText className="h-8 w-8 text-white mb-2" />
                      <p className="text-sm text-white">
                        Sube documentos para este legado
                      </p>
                      <Button
                        onClick={handleFileUpload}
                        size="sm"
                        className="mt-2 bg-black text-white hover:bg-black/90"
                      >
                        Seleccionar archivo
                      </Button>
                    </div>
                    {archivos.length > 0 && (
                      <ul className="space-y-2 mt-2">
                        {archivos.map((archivo, index) => (
                          <li
                            key={index}
                            className="flex justify-between items-center bg-primary/5 p-2 rounded-md"
                          >
                            <span className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-primary" />
                              {archivo}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              PDF
                            </Badge>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </TabsContent>

              <TabsContent value="fotos" className="space-y-4">
                <div className="flex items-center justify-between text-white">
                  <Label htmlFor="incluir-fotos">Incluir fotografías</Label>
                  <Switch
                    id="incluir-fotos"
                    checked={incluirFotos}
                    onCheckedChange={setIncluirFotos}
                  />
                </div>
                {incluirFotos && (
                  <div className="border-2 border-dashed border-primary/20 rounded-lg p-4 text-center">
                    <ImageIcon className="h-8 w-8 text-white mb-2" />
                    <p className="text-sm text-white">
                      Sube fotos para este heredero
                    </p>
                    <Button
                      size="sm"
                      className="mt-2 bg-black text-white hover:bg-black/90"
                    >
                      Seleccionar fotos
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="video" className="space-y-4">
                <div className="flex items-center justify-between text-white">
                  <Label htmlFor="incluir-video">Incluir video personal</Label>
                  <Switch
                    id="incluir-video"
                    checked={incluirVideo}
                    onCheckedChange={setIncluirVideo}
                  />
                </div>
                {incluirVideo && (
                  <div className="border-2 border-dashed border-primary/20 rounded-lg p-4 text-center">
                    <Lock className="h-8 w-8 text-white mb-2" />
                    <h3 className="font-medium text-white">Función Premium</h3>
                    <p className="text-xs text-white">
                      Activa Premium para añadir un video personal.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white hover:from-yellow-600 hover:to-amber-600"
                    >
                      Activar Premium
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleSave}
              disabled={!puedeGuardar}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Save className="mr-2 h-4 w-4" /> Guardar cambios
            </Button>
          </CardFooter>
        </Card>

        <div className="pt-6 text-center">
          <Button
            onClick={generarContrato}
            disabled={!puedeGenerarContrato}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Generar Contrato Inteligente
          </Button>
        </div>

        {isLoading && (
          <p className="text-sm text-yellow-400 text-center">
            ⏳ Confirmando transacción...
          </p>
        )}
        {isSuccess && (
          <p className="text-sm text-green-400 text-center">
            ✅ ¡Contrato inteligente generado!
          </p>
        )}
      </div>
    </MobileLayout>
  );
}
