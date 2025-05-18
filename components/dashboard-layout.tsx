import type { ReactNode } from "react"
import { Home, FileText, Users, Settings, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import AnimatedBackground from "@/components/animated-background"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar className="hidden md:flex">
          <SidebarHeader className="flex items-center justify-center py-4">
            <h1 className="text-2xl font-bold text-primary">WLegacy</h1>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard">
                    <Home className="mr-2 h-5 w-5" />
                    <span>Inicio</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/herencias">
                    <Users className="mr-2 h-5 w-5" />
                    <span>Mis Herencias</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/testamento">
                    <FileText className="mr-2 h-5 w-5" />
                    <span>Mi Testamento</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/configuracion">
                    <Settings className="mr-2 h-5 w-5" />
                    <span>Configuración</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <Button variant="outline" className="w-full justify-start">
              <LogOut className="mr-2 h-5 w-5" />
              <span>Cerrar sesión</span>
            </Button>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col min-h-screen">
          <header className="h-14 border-b flex items-center px-4 md:px-6 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
            <div className="flex items-center md:hidden">
              <SidebarTrigger>
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
              <h1 className="text-xl font-bold ml-2 text-primary">WLegacy</h1>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6 relative">
            <AnimatedBackground />
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
