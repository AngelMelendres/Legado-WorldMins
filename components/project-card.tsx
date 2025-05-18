import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

interface ProjectCardProps {
  title: string
  date: string
  type: string
  hash: string
}

export default function ProjectCard({ title, date, type, hash }: ProjectCardProps) {
  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <h3 className="font-medium text-sm">{title}</h3>
              <p className="text-xs text-muted-foreground">{date}</p>
              <p className="text-xs text-muted-foreground mt-1">Hash: {hash}</p>
            </div>
          </div>
          <div className="bg-primary/10 px-2 py-1 rounded text-xs font-medium text-primary">{type}</div>
        </div>
        <div className="flex gap-2 mt-3">
          <Button variant="outline" size="sm" className="text-xs h-8 flex-1">
            Certificado
          </Button>
          <Button variant="ghost" size="sm" className="text-xs h-8 flex-1">
            Detalles
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
