import type { ProjectMemberRole } from "@/features/members/types"

export const PROJECT_MEMBER_ROLE_BADGE_CLASS_NAME: Record<ProjectMemberRole, string> = {
  owner: "bg-primary text-primary-foreground",
  admin: "bg-surface-highest text-primary",
  member: "bg-muted text-muted-foreground",
  viewer: "bg-surface-high text-muted-foreground",
}

export function formatProjectMemberRole(role: ProjectMemberRole): string {
  return role.charAt(0).toUpperCase() + role.slice(1)
}