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

export type InvitationDetails = {
  projectId: string
  projectName: string
  inviterId: string | null
  inviterName: string
  inviterRole: string
  status: string | null
  expiresAt: string | null
}