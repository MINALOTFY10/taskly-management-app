"use server"

import { cache } from "react"
import { createSupabaseServerClient } from "./supabase/server"

export const requireUser = cache(async () => {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) throw new Error("Unauthorized")

  return user
})
