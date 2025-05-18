import { Button } from "@/components/ui/button"
import { UserCheck } from "lucide-react"
import Link from "next/link"

export default function WorldIDButton() {
  return (
    <Link href="/auth" className="w-full">
      <Button variant="outline" className="w-full gap-2 h-12">
        <UserCheck className="h-5 w-5" />
        <span>Verificar con World ID</span>
      </Button>
    </Link>
  )
}
