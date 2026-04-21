export type ProjectRow = {
  id: string
  name: string
  description: string | null
  created_at: string
}

export type ProjectMemberRole = "owner" | "admin" | "member" | "viewer"

export type ProjectMemberRow = {
  id: string
  userId: string
  projectId: string
  name: string
  email: string
  role: ProjectMemberRole
  avatarUrl: string | null
  joinedAt: string | null
}