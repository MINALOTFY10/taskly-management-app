import type { SupabaseUser } from "./main-shell.types"

export function getDisplayName(user: SupabaseUser | null) {
  if (!user) return "User"

  const metadataName =
    user.user_metadata?.name?.trim() || user.user_metadata?.full_name?.trim()

  if (metadataName) return metadataName
  if (!user.email) return "User"

  return user.email.split("@")[0]
}

export function getJobTitle(user: SupabaseUser | null) {
  const title = user?.user_metadata?.job_title?.trim()
  return title?.length ? title : "Project Member"
}

export function getInitials(name: string) {
  const chunks = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (chunks.length >= 2) {
    return `${chunks[0][0]}${chunks[1][0]}`.toUpperCase()
  }

  if (chunks.length === 1) {
    return chunks[0].slice(0, 2).toUpperCase()
  }

  return "US"
}