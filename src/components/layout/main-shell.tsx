"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { createClient } from "@/lib/supabase/client"
import { SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { MainNavbar } from "./main-navbar"
import type { NavKey } from "./main-shell.types"

type MainShellProps = {
  displayName: string
  initials: string
  jobTitle: string
  children: React.ReactNode
}

export function MainShell({
  displayName,
  initials,
  jobTitle,
  children,
}: MainShellProps) {
  const router = useRouter()
  const [activeNav, setActiveNav] = useState<NavKey>("projects")

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace("/login")
  }

  return (
    <>
      <AppSidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        handleLogout={handleLogout}
      />

      <SidebarInset className="bg-background text-foreground">
        <MainNavbar
          displayName={displayName}
          jobTitle={jobTitle}
          initials={initials}
        />
        <main className="flex flex-1 flex-col pb-14 sm:pb-0">{children}</main>
      </SidebarInset>
    </>
  )
}
