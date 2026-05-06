import Link from "next/link"
import { UserRoundPlus, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ROLE_CONFIG } from "@/features/projects/utils/status"
import type { ProjectMemberRow } from "@/features/members/types"
import { cn } from "@/lib/utils"

// ─── Avatar ───────────────────────────────────────────────────────────────────

function MemberAvatar({
  name,
  avatarUrl,
}: {
  name: string
  avatarUrl: string | null
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={`${name} avatar`}
        className="size-8 shrink-0 rounded-full object-cover ring-2 ring-border/40"
      />
    )
  }

  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 ring-2 ring-border/40">
      <span className="text-[0.6rem] font-bold text-primary">{initials}</span>
    </div>
  )
}

// ─── Single row ───────────────────────────────────────────────────────────────

function MemberItem({ member }: { member: ProjectMemberRow }) {
  const roleConfig = ROLE_CONFIG[member.role] ?? ROLE_CONFIG.member

  return (
    <li className="flex items-center gap-2 py-2 first:pt-0 last:pb-0">
      <MemberAvatar name={member.name} avatarUrl={member.avatarUrl} />

      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.8rem] font-semibold text-foreground">
          {member.name}
        </p>
        <p className="truncate text-[0.65rem] text-muted-foreground">
          {member.email}
        </p>
      </div>

      <span
        className={cn(
          "shrink-0 rounded-sm px-1.5 py-0.5 text-[0.55rem] font-bold tracking-wide uppercase",
          roleConfig.className
        )}
      >
        {roleConfig.label}
      </span>
    </li>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

type MembersSectionProps = {
  members: ProjectMemberRow[]
  projectId: string
  error: string | null
}

export default function MembersSection({
  members,
  projectId,
  error,
}: MembersSectionProps) {
  return (
    <div className="app-surface-card">
      <div className="app-surface-header">
        <div className="flex items-center gap-2.5">
          <div className="app-surface-icon">
            <Users className="size-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Members</h2>
            <p className="text-[0.72rem] text-muted-foreground">
              {members.length} {members.length === 1 ? "person" : "people"}
            </p>
          </div>
        </div>

        <Button
          asChild
          size="sm"
          variant="outline"
          className="h-9 gap-1.5 px-3 text-[0.75rem] font-semibold"
        >
          <Link href={`/project/${projectId}/invite`}>
            <UserRoundPlus className="size-3.5" />
            Invite
          </Link>
        </Button>
      </div>

      {/* Body */}
      <div className="app-surface-body px-4 py-3">
        {error ? (
          <p className="py-4 text-center text-sm text-destructive">
            {error}
          </p>
        ) : members.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No members yet.
          </p>
        ) : (
          <ul className="divide-y divide-border/40">
            {members.map((member) => (
              <MemberItem key={member.id} member={member} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}