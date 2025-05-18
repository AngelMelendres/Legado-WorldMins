"use client"

import type { ReactNode } from "react"
import { Home, FileText, Users, Settings } from "lucide-react"
import AnimatedBackground from "@/components/animated-background"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import MobileHeader from "./mobile-header"

export default function MobileLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  if (!mounted) {
    return (
      <div className="mobile-app">
        <div className="status-bar">
          <span>9:41</span>
          <span>WLegacy</span>
          <span>100%</span>
        </div>
        <main className="mobile-content">
          <AnimatedBackground />
          {children}
        </main>
      </div>
    )
  }

  return (
    <div className="mobile-app">
   
      <main className="mobile-content">
        <AnimatedBackground />
        {children}
      </main>

      <nav className="mobile-nav">
        <Link href="/dashboard" className={`nav-item ${isActive("/dashboard") ? "active" : ""}`}>
          <Home className="h-5 w-5" />
          <span>Inicio</span>
        </Link>

        <Link href="/herencias" className={`nav-item ${isActive("/herencias") ? "active" : ""}`}>
          <Users className="h-5 w-5" />
          <span>Herencias</span>
        </Link>

        <Link href="/testamento" className={`nav-item ${isActive("/testamento") ? "active" : ""}`}>
          <FileText className="h-5 w-5" />
          <span>Testamento</span>
        </Link>

        <Link href="/configuracion" className={`nav-item ${isActive("/configuracion") ? "active" : ""}`}>
          <Settings className="h-5 w-5" />
          <span>Ajustes</span>
        </Link>
      </nav>
    </div>
  )
}
