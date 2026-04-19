"use client"

import { useEffect } from "react"

import { createClient } from "@/lib/supabase/client"
import { clearUser, setUser } from "@/store/user/user-slice"
import { useAppDispatch } from "@/store/hooks"
import { SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { MainNavbar } from "./main-navbar"

export function MainShell({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()

  // Keep Redux in sync with Supabase session changes (registers the listener)
  useEffect(() => {
    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // This callback runs WHENEVER Supabase detects an auth change
      // - token expired & other tab logs out & OAuth completes→ fires
      dispatch(setUser(session?.user ?? null))
    })
    return () => subscription.unsubscribe()
  }, [dispatch])

  const handleLogout = async () => {
    dispatch(clearUser())
  }

  return (
    <>
      <AppSidebar handleLogout={handleLogout} />
      <SidebarInset className="bg-background text-foreground">
        <MainNavbar />
        <main className="flex flex-1 flex-col pb-14 sm:pb-0">{children}</main>
      </SidebarInset>
    </>
  )
}
