"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function AuthPage() {
  const router = useRouter()

  // Simulamos el proceso de autenticación con World ID
  useEffect(() => {
    // En una implementación real, aquí verificaríamos la autenticación con World ID
    const timer = setTimeout(() => {
      // Redirigimos al dashboard después de la autenticación exitosa
      router.push("/dashboard")
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center space-y-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto" />
        <h1 className="text-xl font-semibold">Verificando identidad</h1>
        <p className="text-sm text-muted-foreground">
          Estamos verificando tu identidad con World ID. Serás redirigido automáticamente...
        </p>
      </div>
    </div>
  )
}
