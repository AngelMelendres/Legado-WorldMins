"use client";

import AnimatedBackground from "@/components/animated-background";

export default function Loading() {
  return (
    <div className="mobile-app ">
      <main className="mobile-content flex items-center justify-center relative overflow-hidden min-h-screen">
        <AnimatedBackground />
        <div className="z-10 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
        </div>
      </main>
    </div>
  );
}
