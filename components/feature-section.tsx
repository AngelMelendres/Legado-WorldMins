import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Database, FileCheck, Globe, Shield, UserCheck } from "lucide-react"

export default function FeatureSection() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <UserCheck className="h-6 w-6 text-primary mb-2" />
          <CardTitle>World ID</CardTitle>
          <CardDescription>Identidad verificada</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Cero bots, cero fraudes. Garantizamos que solo humanos reales pueden registrar su propiedad intelectual.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <Database className="h-6 w-6 text-primary mb-2" />
          <CardTitle>Registro Descentralizado</CardTitle>
          <CardDescription>IPFS + hash</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Almacenamiento inalterable y global. Tu contenido permanece seguro y accesible en cualquier parte del mundo.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <Clock className="h-6 w-6 text-primary mb-2" />
          <CardTitle>UX Ultra Simple</CardTitle>
          <CardDescription>Rápido y sencillo</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Usable incluso sin conocimientos técnicos. Protege tus ideas en menos de un minuto.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <FileCheck className="h-6 w-6 text-primary mb-2" />
          <CardTitle>Certificados Listos</CardTitle>
          <CardDescription>Para compartir y validar</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Credibilidad inmediata. Comparte tus certificados con inversores, clientes o instituciones.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <Globe className="h-6 w-6 text-primary mb-2" />
          <CardTitle>Listo para Escalar</CardTitle>
          <CardDescription>APIs, NFTs, marca blanca</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Integra CertiMind en tu plataforma o servicio. Soluciones personalizadas para empresas y partners.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <Shield className="h-6 w-6 text-primary mb-2" />
          <CardTitle>Seguridad Avanzada</CardTitle>
          <CardDescription>Protección completa</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Encriptación de extremo a extremo y verificación criptográfica para la máxima seguridad de tus ideas.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
