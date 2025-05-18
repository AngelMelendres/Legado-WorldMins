import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BookOpen, Briefcase, FileText, GraduationCap, Upload, UserCheck } from "lucide-react"

export default function UserJourneys() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Estudiante Creativo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <div className="mt-1 bg-primary/10 p-1 rounded-full">
                <UserCheck className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm">Se registra con World ID</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-1 bg-primary/10 p-1 rounded-full">
                <Upload className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm">Sube su proyecto final</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-1 bg-primary/10 p-1 rounded-full">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm">Obtiene certificado con sello de su universidad</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-1 bg-primary/10 p-1 rounded-full">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm">Lo incluye en su portafolio profesional</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Briefcase className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Startup Early-Stage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <div className="mt-1 bg-primary/10 p-1 rounded-full">
                <Upload className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm">Sube su MVP en PDF</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-1 bg-primary/10 p-1 rounded-full">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm">Obtiene hash + registro</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-1 bg-primary/10 p-1 rounded-full">
                <ArrowRight className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm">Envía certificado a un inversor como prueba de autoría</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Estudio Legal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <div className="mt-1 bg-primary/10 p-1 rounded-full">
                <ArrowRight className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm">Integra CertiMind en su flujo</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-1 bg-primary/10 p-1 rounded-full">
                <UserCheck className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm">Recomienda a clientes</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-1 bg-primary/10 p-1 rounded-full">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm">Gana comisiones por cada nuevo registro</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
