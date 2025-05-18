"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Edit,
  Download,
  Calendar,
  FileCheck,
  MessageCircle,
  ImageIcon,
  Film,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import MobileLayout from "@/components/mobile-layout";

export default function TestamentoDetallePage() {
  const router = useRouter();
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

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
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Detalle del Testamento
          </h1>
        </div>

        <Card className="glassmorphism border-primary/20">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center text-white">
                <FileText className="w-5 h-5 mr-2 text-primary text-white" />
                Documento de voluntad
              </CardTitle>
              <div className="flex items-center space-x-2">
                <div className="flex flex-col space-y-2">
                  <Badge
                    variant="outline"
                    className="flex items-center text-white"
                  >
                    <Calendar className="w-3 h-3 mr-1" />
                    15/04/2025
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-green-500/20 text-green-400 border-green-500/30"
                  >
                    <FileCheck className="w-3 h-3 mr-1" />
                    Verificado
                  </Badge>
                </div>
              </div>
            </div>
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
                  Archivos
                </TabsTrigger>
              </TabsList>

              <TabsContent value="texto" className="space-y-4">
                <div className="bg-transparent p-4 rounded-md min-h-[200px] border-none">
                  <p
                    className="font-light text-white"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    Yo, Edison, en pleno uso de mis facultades mentales, declaro
                    que este es mi testamento digital. Deseo que mis activos
                    digitales sean distribuidos según los porcentajes asignados
                    a cada heredero en esta plataforma.
                  </p>
                  <p
                    className="font-light mt-4 text-white"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    Mis criptomonedas, NFTs y demás activos digitales deberán
                    ser transferidos a las wallets registradas de cada heredero
                    en la proporción establecida.
                  </p>
                  <p
                    className="font-light mt-4 text-white"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    Este documento tiene validez legal y representa mi última
                    voluntad respecto a mis bienes digitales.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="archivos" className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-white">
                    Archivos adjuntos
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-center justify-between p-3 bg-primary/5 rounded-md">
                      <div className="flex items-center text-white">
                        <FileText className="h-4 w-4 mr-2 text-primary text-white" />
                        <span>Documento_legal.pdf</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                    </li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="fotos" className="space-y-4">
                <div className="bg-transparent p-8 rounded-md text-center space-y-2 border-none">
                  <p className="text-white">
                    No hay fotos adjuntas a este testamento
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="video" className="space-y-4">
                <div className="bg-transparent p-8 rounded-md text-center space-y-2 border-none">
                  <p className="text-white">
                    No hay videos adjuntos a este testamento
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => router.push("/testamento")}
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
            <Button
              variant="default"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Download className="mr-2 h-4 w-4" />
              Descargar
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MobileLayout>
  );
}
