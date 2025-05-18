"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Edit, User, DollarSign, FileText, MessageCircle, ImageIcon, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import MobileLayout from "@/components/mobile-layout"
import ProgressCircle from "@/components/progress-circle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

type Heredero = {
  id: number
  nombre: string
  porcentaje: number
  avatar?: string
  wallet: string
  mensaje: boolean
  archivos: boolean
  fotos: boolean
  video: boolean
}

export default function HerenciasPage() {
  const router = useRouter()
  const [fadeIn, setFadeIn] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [swipedId, setSwipedId] = useState<number | null>(null)

  const [herederos, setHerederos] = useState<Heredero[]>([
    {
      id: 1,
      nombre: "María García",
      porcentaje: 40,
      wallet: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      mensaje: true,
      archivos: true,
      fotos: false,
      video: false,
    },
    {
      id: 2,
      nombre: "Juan Pérez",
      porcentaje: 35,
      wallet: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
      mensaje: true,
      archivos: false,
      fotos: true,
      video: false,
    },
    {
      id: 3,
      nombre: "Ana López",
      porcentaje: 25,
      wallet: "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E",
      mensaje: true,
      archivos: false,
      fotos: false,
      video: false,
    },
  ])

  useEffect(() => {
    setFadeIn(true)
  }, [])

  const handleAddHeredero = () => {
    router.push("/herencias/nuevo")
  }

  const handleEditHeredero = (id: number) => {
    router.push(`/herencias/${id}`)
  }

  const triggerConfetti = () => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }

  const handleSwipe = (id: number) => {
    if (swipedId === id) {
      setSwipedId(null)
    } else {
      setSwipedId(id)
    }
  }

  const totalPorcentaje = herederos.reduce((sum, heredero) => sum + heredero.porcentaje, 0)

  return (
    <MobileLayout>
      <div className={`space-y-6 transition-opacity duration-700 ${fadeIn ? "opacity-100" : "opacity-0"}`}>
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-2xl text-white font-bold tracking-tight ">Tus Herencias</h1>
            <p className="text-muted-foreground text-gray-400">Gestiona quiénes recibirán tu legado digital</p>
          </div>
          <Button
            onClick={() => {
              handleAddHeredero()
              triggerConfetti()
            }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            size="sm"
          >
            <Plus className="mr-1 h-4 w-4" />
            Nuevo
          </Button>
        </div>

        <div className="flex items-center justify-between bg-gray-700/30 p-3 rounded-lg">
          <div className="flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-primary" />
            <span className="font-medium text-white">Porcentaje asignado</span>
          </div>
          <div className="flex items-center">
            <span className={`font-bold ${totalPorcentaje > 100 ? "text-red-400" : "text-green-400"}`}>
              {totalPorcentaje}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">/ 100%</span>
          </div>
        </div>

        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  backgroundColor: `hsl(${240 + Math.random() * 60}, ${70 + Math.random() * 30}%, ${70 + Math.random() * 20}%)`,
                  width: `${5 + Math.random() * 10}px`,
                  height: `${5 + Math.random() * 10}px`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        )}

        <div className="grid gap-4">
          {herederos.map((heredero) => (
            <div
              key={heredero.id}
              className={`swipe-container ${swipedId === heredero.id ? "swiped" : ""}`}
              onClick={() => handleSwipe(heredero.id)}
            >
              <Card className="swipe-content glassmorphism border-primary/20 hover:bg-primary/5 transition-all">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={heredero.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-primary/20">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-white">{heredero.nombre}</h3>
                        <p className="text-xs text-gray-400 text-muted-foreground truncate max-w-[150px]">
                          {heredero.wallet.substring(0, 6)}...{heredero.wallet.substring(heredero.wallet.length - 4)}
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
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-xs">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Mensaje
                      </Badge>
                    )}
                    {heredero.archivos && (
                      <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30 text-xs">
                        <FileText className="h-3 w-3 mr-1" />
                        Archivos
                      </Badge>
                    )}
                    {heredero.fotos && (
                      <Badge
                        variant="outline"
                        className="bg-purple-500/10 text-purple-400 border-purple-500/30 text-xs"
                      >
                        <ImageIcon className="h-3 w-3 mr-1" />
                        Fotos
                      </Badge>
                    )}
                    {heredero.video && (
                      <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30 text-xs">
                        <Video className="h-3 w-3 mr-1" />
                        Video
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
                    e.stopPropagation()
                    handleEditHeredero(heredero.id)
                  }}
                  className="h-full aspect-square bg-primary/20 text-primary rounded-none"
                >
                  <Edit className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => e.stopPropagation()}
                  className="h-full aspect-square bg-destructive/20 text-destructive rounded-none"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-center text-gray-400 text-muted-foreground mt-4">
          Desliza una tarjeta para ver las opciones o toca para expandir
        </p>
      </div>
    </MobileLayout>
  )
}
