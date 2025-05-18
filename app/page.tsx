"use client";
import { ShieldCheck } from "lucide-react";
import { Login } from "@/components/Login";
import MobileHeader from "@/components/mobile-header";
import MobileNavbar from "@/components/mobile-navbar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-background">
      <MobileHeader title="CertiMind" />

      <main className="flex-1 px-4 pb-16">
        {/* Hero Section */}
        <section className="py-10">
          <div className="space-y-6 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/30 to-primary/10 shadow-inner flex items-center justify-center">
              <ShieldCheck className="h-9 w-9 text-primary" />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-foreground">
              CertiMind
            </h1>
            <p className="text-base font-semibold text-muted-foreground leading-snug">
              Registra tu creatividad. Protege tu identidad. Demuestra tu autoría.
            </p>
            <div className="text-sm text-muted-foreground max-w-xs mx-auto space-y-1 leading-relaxed">
              <p>
                CertiMind te permite registrar ideas, diseños o prototipos con verificación humana y certificado digital inmediato.
              </p>
              <p>
                Puedes usar un seudónimo o activar el modo legal si necesitas mayor validez jurídica. Todo en menos de un minuto.
              </p>
            </div>
            <div className="pt-4">
              <Login />
            </div>
          </div>
        </section>
      </main>

      <MobileNavbar />
    </div>
  );
}