import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Code, FileText, Server, Store } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PricingSection() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Modelo Freemium</CardTitle>
          <CardDescription>Para usuarios individuales</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Gratuito: Registro básico</p>
                <p className="text-sm text-muted-foreground">Hasta 1MB, texto plano</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Premium mensual o por uso</p>
                <p className="text-sm text-muted-foreground">Subida de archivos (PDFs, imágenes, prototipos)</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Funciones avanzadas</p>
                <p className="text-sm text-muted-foreground">
                  Registro privado, historial de ideas, certificados en PDF
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Comenzar gratis</Button>
        </CardFooter>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Certificados Marca Blanca</CardTitle>
          <CardDescription>Para empresas e instituciones</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <Store className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Certificados personalizados</p>
                <p className="text-sm text-muted-foreground">Con logo de empresa/universidad y timestamp</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Ideal para organizaciones</p>
                <p className="text-sm text-muted-foreground">Agencias, startups, incubadoras, universidades</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Facturación flexible</p>
                <p className="text-sm text-muted-foreground">Por unidad o suscripción institucional</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant="outline">
            Contactar ventas
          </Button>
        </CardFooter>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>API Comercial</CardTitle>
          <CardDescription>Para integradores</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <Code className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">API para plataformas</p>
                <p className="text-sm text-muted-foreground">Diseño, hackatones, incubadoras</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Server className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Cobro por volumen</p>
                <p className="text-sm text-muted-foreground">Escalable según necesidades</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Automatización</p>
                <p className="text-sm text-muted-foreground">Para MVPs o ideas en pruebas de concepto</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant="outline">
            Documentación API
          </Button>
        </CardFooter>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Alianzas Legales</CardTitle>
          <CardDescription>Para profesionales del derecho</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Partners con notarías</p>
                <p className="text-sm text-muted-foreground">Digitales y estudios jurídicos</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Validación legal</p>
                <p className="text-sm text-muted-foreground">Con descuentos especiales</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Comisión por referidos</p>
                <p className="text-sm text-muted-foreground">Por cada usuario nuevo</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant="outline">
            Programa de partners
          </Button>
        </CardFooter>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>NFTs Opcionales</CardTitle>
          <CardDescription>Fase avanzada</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Registro en blockchain</p>
                <p className="text-sm text-muted-foreground">Como NFT verificable</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Exposición en marketplaces</p>
                <p className="text-sm text-muted-foreground">OpenSea y otros</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Ingresos adicionales</p>
                <p className="text-sm text-muted-foreground">Por emisión y royalties</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant="outline">
            Próximamente
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
