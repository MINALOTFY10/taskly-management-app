import type { LucideIcon } from "lucide-react"
import type { User } from "@supabase/supabase-js"

export type { User as SupabaseUser }

export type NavKey = "projects" | "epics" | "tasks" | "members" | "details"

export type NavItem = {
  key: NavKey
  label: string
  icon: LucideIcon
  href?: string
}