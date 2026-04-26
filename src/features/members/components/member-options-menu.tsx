"use client"

import { useState } from "react"
import { MoreVertical, Repeat, UserCog, UserMinus } from "lucide-react"
import { useRouter } from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ChangeRoleDialog from "@/features/members/components/change-role-dialog"
import RemoveMemberDialog from "@/features/members/components/remove-member-dialog"
import TransferOwnershipDialog from "@/features/members/components/transfer-ownership-dialog"
import type { ProjectMemberRole, ProjectMemberRow } from "@/features/members/types"

type MemberOptionsMenuProps = {
  member: ProjectMemberRow
  projectId: string
  projectName: string
  currentUserRole: ProjectMemberRole
}

export default function MemberOptionsMenu({
  member,
  projectId,
  projectName,
  currentUserRole,
}: MemberOptionsMenuProps) {
  const router = useRouter()

  const [isChangeRoleOpen, setIsChangeRoleOpen] = useState(false)
  const [isRemoveOpen, setIsRemoveOpen] = useState(false)
  const [isTransferOpen, setIsTransferOpen] = useState(false)

  const canTransferOwnership = currentUserRole === "owner"

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={`More options for ${member.name}`}
          >
            <MoreVertical className="size-4" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-46">
          <DropdownMenuItem
            onSelect={() => {
              setIsChangeRoleOpen(true)
            }}
          >
            <UserCog className="mr-2 size-4" />
            Change Role
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onSelect={() => {
              setIsRemoveOpen(true)
            }}
          >
            <UserMinus className="mr-2 size-4" />
            Remove Member
          </DropdownMenuItem>

          {canTransferOwnership ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => {
                  setIsTransferOpen(true)
                }}
              >
                <Repeat className="mr-2 size-4" />
                Transfer Ownership
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      <ChangeRoleDialog
        open={isChangeRoleOpen}
        onClose={() => setIsChangeRoleOpen(false)}
        member={member}
        projectName={projectName}
        projectId={projectId}
        onSuccess={() => router.refresh()}
      />

      <RemoveMemberDialog
        open={isRemoveOpen}
        onClose={() => setIsRemoveOpen(false)}
        member={member}
        projectName={projectName}
        projectId={projectId}
        onSuccess={() => router.refresh()}
      />

      <TransferOwnershipDialog
        open={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        member={member}
        projectName={projectName}
        projectId={projectId}
        onSuccess={() => router.refresh()}
      />
    </>
  )
}
