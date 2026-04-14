"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

export default function MainPage() {
  const router = useRouter()
  const supabase = createClient()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await supabase.auth.signOut()
      router.replace("/login")
      router.refresh()
    } catch {
      setIsLoggingOut(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-8">
      <section className="w-full max-w-xl rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome to Taskly
        </h1>
        <p className="my-3 text-muted-foreground">
          Your account is ready. Start creating projects, organizing tasks, and
          collaborating with your team.
        </p>

        <Button
          size="lg"
          className="h-11 text-base font-semibold"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </section>
    </main>
  )
}
