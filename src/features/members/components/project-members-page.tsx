"use client"

import { useState } from "react"
import { UserPlus } from "lucide-react"

import { BreadcrumbNav } from "@/components/shared/breadcrumb-nav"
import { Button } from "@/components/ui/button"
import InviteMemberForm from "@/features/members/components/invite-member-form"
import LeaveProjectDialog from "@/features/members/components/leave-project-dialog"
import MemberOptionsMenu from "@/features/members/components/member-options-menu"
import ProjectMemberAvatar from "@/features/members/components/project-member-avatar"
import { formatProjectDate } from "@/features/projects/utils/date"
import {
  formatProjectMemberRole,
  PROJECT_MEMBER_ROLE_BADGE_CLASS_NAME,
} from "@/features/members/utils/member"
import type { ProjectMemberRole, ProjectMemberRow } from "@/features/members/types"

type ProjectMembersPageProps = {
  projectId: string
  projectName: string
  members: ProjectMemberRow[]
  currentUserId: string | null
  currentUserRole: ProjectMemberRole | null
}

export default function ProjectMembersPage({
  projectId,
  projectName,
  members,
  currentUserId,
  currentUserRole,
}: ProjectMembersPageProps) {
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [isLeaveOpen, setIsLeaveOpen] = useState(false)

  const canManageMembers = currentUserRole === "owner" || currentUserRole === "admin"
  const canInviteMembers = canManageMembers
  const canLeaveProject = currentUserRole !== null && currentUserRole !== "owner"
  const canShowActionsColumn = canManageMembers
  const canShowMemberOptions = (member: ProjectMemberRow) =>
    canShowActionsColumn && member.role !== "owner" && canManageMembers && member.userId !== currentUserId
  const desktopGridColumns = canShowActionsColumn
    ? "grid-cols-[minmax(0,1.5fr)_minmax(110px,0.7fr)_minmax(120px,0.7fr)_40px]"
    : "grid-cols-[minmax(0,1.5fr)_minmax(110px,0.7fr)_minmax(120px,0.7fr)]"

  return (
    <section className="app-page-shell">
      <div className="app-page-frame">
        <div className="flex items-start justify-between gap-3">
          <div>
            <BreadcrumbNav
              items={[
                { label: "Projects", href: "/project" },
                {
                  label: projectName,
                  href: `/project/${projectId}/details`,
                },
                { label: "Members", current: true },
              ]}
            />
            <h1 className="mt-1.5 text-[2rem] leading-none font-semibold tracking-tight text-foreground">
              Project Members
            </h1>
          </div>

          {canInviteMembers ? (
            <Button
              type="button"
              size="lg"
              className="mt-auto hidden h-10 gap-2 rounded-lg px-3.5 text-[13px] font-semibold shadow-sm sm:inline-flex"
              onClick={() => setIsInviteOpen(true)}
            >
              <UserPlus className="size-3.5" /> Invite Members
            </Button>
          ) : null}
        </div>

        {members.length === 0 ? (
          <div className="mt-5 rounded-lg border border-border/60 bg-card px-4 py-6 text-center shadow-sm sm:mt-6">
            <p className="text-sm text-muted-foreground">No project members found.</p>
          </div>
        ) : (
          <>
            <div className="mt-5 hidden overflow-hidden rounded-lg border border-border/60 bg-card shadow-sm sm:mt-6 md:block">
              <div className={`grid ${desktopGridColumns} gap-3 border-b border-border/60 ps-3 pe-8 py-3`}>
                <span className="text-[0.64rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                  Member
                </span>
                <span className="text-[0.64rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                  Role
                </span>
                <span className="text-[0.64rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                  Joined At
                </span>
                {canShowActionsColumn ? (
                  <span className="text-[0.64rem] text-right font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                    Actions
                  </span>
                ) : null}
              </div>

              <div role="list" className="divide-y divide-border/60">
                {members.map((member) => (
                  <div
                    key={member.id}
                    role="listitem"
                    className={`grid ${desktopGridColumns} items-center gap-3 ps-3 pe-8 py-3`}
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

                    {canShowActionsColumn ? (
                      <div className="ml-auto inline-flex size-8 items-center justify-center">
                        {canShowMemberOptions(member) ? (
                          <MemberOptionsMenu
                            member={member}
                            projectId={projectId}
                            projectName={projectName}
                            currentUserRole={currentUserRole!}
                          />
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div role="list" className="mt-6 space-y-3 md:hidden">
              {members.map((member) => (
                <div
                  key={member.id}
                  role="listitem"
                  className="rounded-lg border border-border/60 bg-card px-3 py-2.5 shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <ProjectMemberAvatar name={member.name} />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[0.95rem] font-semibold text-foreground">
                        {member.name}
                      </p>
                      <p className="truncate text-[0.8rem] text-muted-foreground">
                        {member.email}
                      </p>
                    </div>

                    <span
                      className={`inline-flex rounded-md px-2 py-1 text-[0.63rem] font-semibold tracking-[0.08em] uppercase ${PROJECT_MEMBER_ROLE_BADGE_CLASS_NAME[member.role]}`}
                    >
                      {formatProjectMemberRole(member.role)}
                    </span>

                    {canShowActionsColumn ? (
                      <div className="inline-flex size-8 items-center justify-center">
                        {canShowMemberOptions(member) ? (
                          <MemberOptionsMenu
                            member={member}
                            projectId={projectId}
                            projectName={projectName}
                            currentUserRole={currentUserRole!}
                          />
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>

            {canLeaveProject ? (
              <div className="mt-5 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-3 sm:px-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Leave project</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      You will lose access to this project&apos;s tasks, epics, and comments.
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    className="h-9 shrink-0 px-3 text-sm font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                    onClick={() => setIsLeaveOpen(true)}
                  >
                    Leave Project
                  </Button>
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>

      {canInviteMembers ? (
        <Button
          type="button"
          size="icon-lg"
          className="fixed right-4 bottom-4 z-20 rounded-xl p-6 shadow-[0_10px_20px_rgba(0,50,184,0.22)] sm:hidden"
          aria-label="Invite members"
          onClick={() => setIsInviteOpen(true)}
        >
          <UserPlus className="size-5" />
        </Button>
      ) : null}

      <InviteMemberForm
        projectId={projectId}
        projectName={projectName}
        open={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      />

      <LeaveProjectDialog
        open={isLeaveOpen}
        onClose={() => setIsLeaveOpen(false)}
        projectName={projectName}
        projectId={projectId}
      />
    </section>
  )
}
