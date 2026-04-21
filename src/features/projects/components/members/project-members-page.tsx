import { MoreVertical, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import ProjectMemberAvatar from "@/features/projects/components/members/project-member-avatar"
import { formatProjectDate } from "@/features/projects/utils/date"
import {
  formatProjectMemberRole,
  PROJECT_MEMBER_ROLE_BADGE_CLASS_NAME,
} from "@/features/projects/utils/member"
import type { ProjectMemberRow } from "@/features/projects/types"

type ProjectMembersPageProps = {
  projectName: string
  members: ProjectMemberRow[]
}

export default function ProjectMembersPage({
  projectName,
  members,
}: ProjectMembersPageProps) {
  return (
    <section className="px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
      <div className="mx-auto w-full max-w-350">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.68rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              Projects &gt; {projectName} &gt; Members
            </p>
            <h1 className="mt-2 text-[2.2rem] leading-none font-semibold tracking-tight text-foreground">
              Project Members
            </h1>
          </div>

          <Button
            type="button"
            size="lg"
            className="mt-auto hidden h-12 gap-2 rounded-md px-4 text-[14px] font-semibold shadow-[0_10px_18px_rgba(0,50,184,0.15)] sm:inline-flex"
          >
            <UserPlus className="size-4" /> Invite Members
          </Button>
        </div>

        {members.length === 0 ? (
          <div className="mt-7 rounded-xl border border-border/45 bg-card px-5 py-8 text-center sm:mt-8">
            <p className="text-sm text-muted-foreground">No project members found.</p>
          </div>
        ) : (
          <>
            <div className="mt-7 hidden overflow-hidden rounded-xl border border-border/45 bg-card sm:mt-8 md:block">
              <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(110px,0.7fr)_minmax(120px,0.7fr)_40px] gap-4 border-b border-border/60 ps-4 pe-10 py-4">
                <span className="text-[0.68rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  Member
                </span>
                <span className="text-[0.68rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  Role
                </span>
                <span className="text-[0.68rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  Joined At
                </span>
                <span className="text-[0.68rem] text-right font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  Actions
                </span>
              </div>

              <div role="list" className="divide-y divide-border/60">
                {members.map((member) => (
                  <div
                    key={member.id}
                    role="listitem"
                    className="grid grid-cols-[minmax(0,1.5fr)_minmax(110px,0.7fr)_minmax(120px,0.7fr)_40px] items-center gap-4 ps-4 pe-10 py-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                        <ProjectMemberAvatar name={member.name} />

                      <div className="min-w-0">
                        <p className="truncate text-[0.95rem] font-semibold text-foreground">
                          {member.name}
                        </p>
                        <p className="truncate text-[0.82rem] text-muted-foreground">
                          {member.email}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[0.63rem] font-semibold tracking-[0.08em] uppercase ${PROJECT_MEMBER_ROLE_BADGE_CLASS_NAME[member.role]}`}
                    >
                      {formatProjectMemberRole(member.role)}
                    </span>

                    <p className="text-[0.82rem] text-muted-foreground">
                      {formatProjectDate(member.joinedAt)}
                    </p>

                    <button
                      type="button"
                      className="ml-auto inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label={`More options for ${member.name}`}
                    >
                      <MoreVertical className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div role="list" className="mt-6 space-y-3 md:hidden">
              {members.map((member) => (
                <div
                  key={member.id}
                  role="listitem"
                  className="rounded-xl border border-border/45 bg-card px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <ProjectMemberAvatar name={member.name} />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[1.01rem] font-semibold text-foreground">
                        {member.name}
                      </p>
                      <p className="truncate text-[0.84rem] text-muted-foreground">
                        {member.email}
                      </p>
                    </div>

                    <span
                      className={`inline-flex rounded-md px-2 py-1 text-[0.63rem] font-semibold tracking-[0.08em] uppercase ${PROJECT_MEMBER_ROLE_BADGE_CLASS_NAME[member.role]}`}
                    >
                      {formatProjectMemberRole(member.role)}
                    </span>

                    <button
                      type="button"
                      className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label={`More options for ${member.name}`}
                    >
                      <MoreVertical className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Button
        type="button"
        size="icon-lg"
        className="fixed right-4 bottom-4 z-20 rounded-xl p-6 shadow-[0_10px_20px_rgba(0,50,184,0.22)] sm:hidden"
        aria-label="Invite members"
      >
        <UserPlus className="size-5" />
      </Button>
    </section>
  )
}
