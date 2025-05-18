import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                CertiMind
              </h1>
              <p className="text-xl text-muted-foreground">
                Tu idea. Tu identidad. Tu prueba. En un clic, sin abogados.
              </p>
            </div>
            <div className="space-y-6">
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Registra y protege tu propiedad intelectual de forma instantánea, segura y verificable con identidad
                humana (World ID), almacenamiento descentralizado (IPFS) y certificación digital.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <Button size="lg" className="gap-2">
                    Comenzar ahora <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline">
                    Conoce más
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-[500px] aspect-video overflow-hidden rounded-xl border bg-background shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background flex items-center justify-center">
                <div className="text-center p-6">
                  <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Protección Instantánea</h3>
                  <p className="text-muted-foreground">
                    Sube tu proyecto, verifica tu identidad y obtén un certificado digital en menos de un minuto.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
