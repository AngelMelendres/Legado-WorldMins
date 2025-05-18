"use client";

import Link from "next/link";
import { FileText, Shield, User, LogOut, BookOpen } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MobileNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<null | { walletAddress: string }>(null);

  const loadUser = () => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.walletAddress) {
          setUser(parsed);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
    setUser(null);
    router.push("/");
  };

  useEffect(() => {
    loadUser();

    const handleStorageChange = () => loadUser();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (!user) return null; // ← si no hay usuario, no se muestra la barra

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 bg-background border-t max-w-md mx-auto">
      <div className="flex items-center justify-around h-16">
        {/* Solo se muestran estos si el usuario está logueado */}
        <Link
          href="/projects"
          className="flex flex-col items-center justify-center w-full"
        >
          <FileText
            className={`h-5 w-5 ${
              pathname.startsWith("/projects") ? "text-primary" : ""
            }`}
          />
          <span
            className={`text-xs mt-1 ${
              pathname.startsWith("/projects") ? "text-primary font-medium" : ""
            }`}
          >
            Proyectos
          </span>
        </Link>

        <Link
          href="/library"
          className="flex flex-col items-center justify-center w-full"
        >
          <BookOpen
            className={`h-5 w-5 ${
              pathname.startsWith("/library/") ? "text-primary" : ""
            }`}
          />
          <span
            className={`text-xs mt-1 ${
              pathname.startsWith("/library/") ? "text-primary font-medium" : ""
            }`}
          >
            Biblioteca
          </span>
        </Link>

        <Link
          href="/certificate/verify"
          className="flex flex-col items-center justify-center w-full"
        >
          <Shield
            className={`h-5 w-5 ${
              pathname.startsWith("/certificate/verify") ? "text-primary" : ""
            }`}
          />
          <span
            className={`text-xs mt-1 ${
              pathname.startsWith("/certificate/verify")
                ? "text-primary font-medium"
                : ""
            }`}
          >
            Verificar
          </span>
        </Link>

        <Link
          href="/profile"
          className="flex flex-col items-center justify-center w-full"
        >
          <User
            className={`h-5 w-5 ${
              pathname.startsWith("/profile") ? "text-primary" : ""
            }`}
          />
          <span
            className={`text-xs mt-1 ${
              pathname.startsWith("/profile") ? "text-primary font-medium" : ""
            }`}
          >
            Perfil
          </span>
        </Link>

        {/* <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center w-full text-red-500"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-xs mt-1 font-medium">Salir</span>
        </button> */}
      </div>
    </nav>
  );
}
