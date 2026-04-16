"use client"

import Image from "next/image"
import Icon from "@/../public/assets/icon.png"
import React from "react"
import { cn } from "@/lib/utils"

interface AuthLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  className?: string
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  className,
}: AuthLayoutProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-4 py-6 sm:px-8 sm:py-7">
      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] w-full flex-col gap-6">
        <header className="flex items-center gap-2 text-foreground">
          <Image src={Icon} alt="Taskly Logo" className="h-5.5 w-5" />
          <span className="text-xl font-bold tracking-tight">TASKLY</span>
        </header>

        <section
          className={cn(`mx-auto w-full ${className ?? "max-w-xl"} rounded-xl bg-card p-4 sm:px-10 sm:py-10 sm:shadow-[0_10px_25px_rgba(0,0,0,0.05),0_20px_40px_rgba(0,0,0,0.08)]`)}
        >
          {(title || subtitle) && (
            <div className="mt-4 mb-8 space-y-2 text-center">
              {title && (
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="mx-6 mt-1 text-[14px] text-muted-foreground sm:mx-0">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {children}
        </section>
      </div>
    </main>
  )
}
