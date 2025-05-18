import type { ReactNode } from "react"

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return <div className="flex flex-col min-h-screen max-w-md mx-auto bg-background">{children}</div>
}
