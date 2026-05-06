"use client"

import React from "react"
import { cn } from "@/lib/utils"
import AppLogo from "@/components/shared/app-logo"

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
    <main className="relative min-h-screen overflow-hidden bg-background px-3 py-4 sm:px-5 sm:py-5">
      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] w-full flex-col gap-6">
        <AppLogo />

        <section
          className={cn(`mx-auto w-full ${className ?? "max-w-xl"} rounded-lg border border-border/70 bg-card/95 p-3 shadow-sm sm:px-8 sm:py-8`)}
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
