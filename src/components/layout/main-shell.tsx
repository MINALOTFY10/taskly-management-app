"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { setUser } from "@/store/user/user-slice"
import { useAppDispatch } from "@/store/hooks"
import { SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { MainNavbar } from "./nav-bar/main-navbar"

export function MainShell({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()

  // Keep Redux in sync with Supabase session changes (registers the listener)
  useEffect(() => {
    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setUser(session?.user ?? null))
    })
    return () => subscription.unsubscribe()
  }, [dispatch])

  return (
    <>
      <AppSidebar />
      <SidebarInset className="relative bg-transparent text-foreground">
        <MainNavbar />
        <main className="flex flex-1 flex-col pb-14 sm:pb-0">{children}</main>
      </SidebarInset>
    </>
  )
}
