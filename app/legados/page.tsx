"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  Plus,
  Trash2,
  Edit,
  User,
  DollarSign,
  FileText,
  MessageCircle,
  ImageIcon,
  Video,
  HandCoins,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import MobileLayout from "@/components/mobile-layout";
import ProgressCircle from "@/components/progress-circle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import SkeletonHeredero from "@/components/skeleton-heredero";

// API call will be made from Next.js /api route

export default function HerenciasPage() {
  const router = useRouter();
  const [fadeIn, setFadeIn] = useState(false);
  const [swipedId, setSwipedId] = useState<number | null>(null);
  const [herederos, setHerederos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [puedeAgregar, setPuedeAgregar] = useState(true);
  const [porcentajeTotal, setPorcentajeTotal] = useState(0);
  const [maxDisponible, setMaxDisponible] = useState(100);

  useEffect(() => {
    setFadeIn(true);

    const loadData = async () => {
      await fetchHerencias();
      await fetchPorcentajeTotal();
      await validarLimiteDeHerederos(); // nuevo
    };

    loadData();
  }, []);
  const fetchPorcentajeTotal = async () => {
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
      const total = data.porcentaje_total ?? 0;
      setPorcentajeTotal(total);
      setMaxDisponible(Math.max(0, 100 - total));
    } catch (error) {
      console.error("Error al calcular porcentaje total:", error);
      setPorcentajeTotal(0);
      setMaxDisponible(100);
    }
  };

  const fetchHerencias = async () => {
    try {
      setLoading(true);

      const localUser = JSON.parse(
        localStorage.getItem("certimind_user") || "{}"
      );

      if (!localUser.id) {
        console.warn("Usuario no encontrado en localStorage");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/herencias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_usuario: localUser.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error cargando legados:", data.error);
        return;
      }

      setHerederos(data);
    } catch (error) {
      console.error("Fallo al cargar herencias:", error);
    } finally {
      setLoading(false);
    }
  };

  const validarLimiteDeHerederos = async () => {
    const localUser = JSON.parse(
      localStorage.getItem("certimind_user") || "{}"
    );
    if (!localUser.id) return;

    const res = await fetch("/api/subscripcion/limite-estado", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_usuario: localUser.id }),
    });

    const data = await res.json();

    setPuedeAgregar(data.puede_agregar ?? false);
  };

  const handleAddHeredero = () => {
    router.push("/legados/nuevo");
  };

  const handleEditHeredero = (id: number) => {
    router.push(`/legados/${id}`);
  };

  const handleDeleteHeredero = (id: number) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Este heredero será eliminado de forma permanente.",
      showCancelButton: true,
      background: "#0f0c1f",
      color: "#ffffff",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch("/api/herencias/deleteuser", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }), // 👈 Solo se envía el ID
          });

          const data = await res.json();

          if (res.ok) {
            setHerederos((prev) => prev.filter((h) => h.id !== id));
            Swal.fire({
              title: "Eliminado",
              text: "El heredero ha sido eliminado.",
              icon: "success",
              background: "#0f0c1f",
              color: "#ffffff",
              confirmButtonColor: "#d33",
            });
          } else {
            Swal.fire({
              title: "Error",
              text: data.error || "No se pudo eliminar.",
              icon: "error",
              background: "#0f0c1f",
              color: "#ffffff",
              confirmButtonColor: "#d33",
            });
          }
        } catch (err) {
          console.error(err);
          Swal.fire("Error", "Error de red o servidor.", "error");
        }
      }
    });
  };

  const handleSwipe = (id: number) => {
    setSwipedId(swipedId === id ? null : id);
  };
  const totalPorcentaje = porcentajeTotal;

  return (
    <MobileLayout>
      <div
        className={`space-y-6 transition-opacity duration-700 ${
          fadeIn ? "opacity-100" : "opacity-0"
        }`}
      >
        <h1 className="text-2xl text-white font-bold tracking-tight text-center mx-auto">
          Tus Legados
        </h1>
        <div className="grid grid-cols-2 items-center gap-4">
          <div>
            <p className="text-sm text-gray-400 text-center">
              Gestiona quiénes recibirán tu legado digital
            </p>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleAddHeredero}
              disabled={!puedeAgregar}
              className="..."
            >
              <Plus className="mr-1 h-4" />
              Nuevo Heredero
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between  p-3 rounded-lg">
          <div className="flex items-center">
            <HandCoins className="w-5 h-5 mr-2 text-primary font-bold" />
            <span className=" text-white font-bold">Porcentaje asignado</span>
          </div>
          <div className="flex items-center">
            <span
              className={`font-bold ${
                totalPorcentaje > 100 ? "text-red-400" : "text-green-400"
              }`}
            >
              {totalPorcentaje}%
            </span>
            <span className="text-muted-foreground ml-1">/ 100%</span>
          </div>
        </div>

        <div className="grid gap-4">
          {loading ? (
            <>
              <SkeletonHeredero />
              <SkeletonHeredero />
              <SkeletonHeredero />
            </>
          ) : (
            herederos.map((heredero) => (
              <div
                key={heredero.id}
                className={`swipe-container ${
                  swipedId === heredero.id ? "swiped" : ""
                }`}
                onClick={() => handleSwipe(heredero.id)}
              >
                <Card className="swipe-content glassmorphism border-primary/20 hover:bg-primary/5 transition-all">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage
                            src={
                              heredero.avatar ||
                              "https://cdn-icons-png.flaticon.com/512/147/147144.png"
                            }
                          />
                          <AvatarFallback className="bg-primary/20">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium text-white">
                            {heredero.nombre}
                          </h3>
                          <p className="text-xs text-gray-400 text-muted-foreground truncate max-w-[150px]">
                            ID: {heredero.wallet.substring(0, 6)}...
                            {heredero.wallet.substring(
                              heredero.wallet.length - 4
                            )}
                          </p>
                          <p className="text-xs text-gray-400 text-muted-foreground truncate max-w-[150px]">
                            🪙 12.0 WRC ($32.23)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex items-center text-white justify-center w-12 h-12">
                          <ProgressCircle percentage={heredero.porcentaje} />
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-2">
                      {heredero.mensaje && (
                        <Badge
                          variant="outline"
                          className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-xs"
                        >
                          <MessageCircle className="h-3 w-3 mr-1" /> Mensaje
                        </Badge>
                      )}
                      {heredero.archivos && (
                        <Badge
                          variant="outline"
                          className="bg-green-500/10 text-green-400 border-green-500/30 text-xs"
                        >
                          <FileText className="h-3 w-3 mr-1" /> Archivos
                        </Badge>
                      )}
                      {heredero.fotos && (
                        <Badge
                          variant="outline"
                          className="bg-purple-500/10 text-purple-400 border-purple-500/30 text-xs"
                        >
                          <ImageIcon className="h-3 w-3 mr-1" /> Fotos
                        </Badge>
                      )}
                      {heredero.video && (
                        <Badge
                          variant="outline"
                          className="bg-red-500/10 text-red-400 border-red-500/30 text-xs"
                        >
                          <Video className="h-3 w-3 mr-1" /> Video
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>

                <div className="swipe-actions">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditHeredero(heredero.id);
                    }}
                    className="h-full aspect-square bg-primary/20 text-primary rounded-none"
                  >
                    <Edit className="h-5 w-5 text-white font-bold" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteHeredero(heredero.id);
                    }}
                    className="h-full aspect-square bg-destructive/20 text-destructive rounded-none"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {!puedeAgregar && (
          <div className="text-center mt-4 space-y-2">
            <p className="text-sm text-red-400">
              Has alcanzado el límite de herederos de tu plan actual.
            </p>
            <Button
              onClick={() => router.push("/ajustes/pagePlan")}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold"
            >
              Mejorar Plan
            </Button>
          </div>
        )}

        <p className="text-xs text-center text-gray-400 text-muted-foreground mt-4">
          Desliza una tarjeta para ver las opciones o toca para expandir
        </p>
      </div>
    </MobileLayout>
  );
}
