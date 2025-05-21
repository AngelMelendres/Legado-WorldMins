"use client";

import type { ReactNode } from "react";
import { Home, FileText, Users, Settings } from "lucide-react";
import AnimatedBackground from "@/components/animated-background";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function MobileLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [hasSignedTestament, setHasSignedTestament] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);

    const userData = localStorage.getItem("certimind_user");
    if (userData) {
      const parsed = JSON.parse(userData);
      const id = parsed.id || parsed.username;
      setUserId(id);

      // ✅ Usar la API para verificar si ha firmado el testamento
      fetch("/api/verificar-testamento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: id }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.firmado) {
            setHasSignedTestament(true);
          }
        })
        .catch((err) => {
          console.error("❌ Error al verificar testamento:", err);
        });
    }
  }, []);

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

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
    );
  }

  return (
    <div className="mobile-app">
      <main className="mobile-content">
        <AnimatedBackground />
        {children}
      </main>

      <nav className="mobile-nav font-bold">
        <Link
          href="/inicio"
          className={`nav-item ${isActive("/inicio") ? "active" : ""}`}
        >
          <Home className="h-5 w-5" />
          <span className="font-bold text-white">Inicio</span>
        </Link>

        <Link
          title={
            !hasSignedTestament
              ? "Firma tu testamento para habilitar esta opción"
              : ""
          }
          href={hasSignedTestament ? "/legados" : "#"}
          className={`nav-item ${isActive("/legados") ? "active" : ""} ${
            !hasSignedTestament ? "opacity-30 pointer-events-none" : ""
          }`}
        >
          <Users className="h-5 w-5" />
          <span className="font-bold text-white">Herederos</span>
        </Link>

        <Link
          href="/testamento"
          className={`nav-item ${isActive("/testamento") ? "active" : ""}`}
        >
          <FileText className="h-5 w-5" />
          <span className="font-bold text-white">Testamento</span>
        </Link>

        <Link
          title={
            !hasSignedTestament
              ? "Firma tu testamento para habilitar esta opción"
              : ""
          }
          href={hasSignedTestament ? "/ajustes" : "#"}
          className={`nav-item ${isActive("/ajustes") ? "active" : ""} ${
            !hasSignedTestament ? "opacity-30 pointer-events-none" : ""
          }`}
        >
          <Settings className="h-5 w-5" />
          <span className="font-bold text-white">Ajustes</span>
        </Link>
      </nav>
    </div>
  );
}
