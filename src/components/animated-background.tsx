"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

export default function AnimatedBackground() {
  const [particles, setParticles] = useState<Array<{ id: number; size: number; x: number; y: number; delay: number }>>(
    [],
  )
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const particleCount = 15
    const newParticles = []

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        size: 2 + Math.random() * 4,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5,
      })
    }

    setParticles(newParticles)
  }, [])

  if (!mounted) return null

  return (
    <div className="particles-container">
      <div
        className={`absolute inset-0 ${
          theme === "light"
            ? "bg-gradient-to-br from-[#f8f5f0] via-[#f0ebff] to-[#f5f0ff]"
            : "bg-gradient-to-br from-[#0f0b1e] via-[#1a1333] to-[#0d0d1d]"
        } z-[-2]`}
      />

      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            boxShadow:
              theme === "light" ? "0 0 10px 2px rgba(130, 87, 255, 0.3)" : "0 0 10px 2px rgba(130, 87, 255, 0.7)",
            background: theme === "light" ? "rgba(130, 87, 255, 0.2)" : "rgba(255, 255, 255, 0.5)",
          }}
        />
      ))}
    </div>
  )
}
