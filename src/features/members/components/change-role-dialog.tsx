"use client"

import { useState } from "react"
import { Loader2, UserCog } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAppToast } from "@/components/providers/toast-provider"
import { useMemberActions } from "@/features/members/hooks/use-member-actions"
import type {
  ProjectMemberRole,
  ProjectMemberRow,
} from "@/features/members/types"

type ChangeRoleDialogProps = {
  open: boolean
  onClose: () => void
  member: ProjectMemberRow
  projectName: string
  projectId: string
  onSuccess: () => void
}

const ROLE_OPTIONS: Array<{
  value: Exclude<ProjectMemberRole, "owner">
  label: string
}> = [
  { value: "admin", label: "Admin" },
  { value: "member", label: "Member" },
  { value: "viewer", label: "Viewer" },
]

export default function ChangeRoleDialog({
  open,
  onClose,
  member,
  projectName,
  projectId,
  onSuccess,
}: ChangeRoleDialogProps) {
  const currentRole: Exclude<ProjectMemberRole, "owner"> =
    member.role === "owner" ? "admin" : member.role

  const [draftRole, setDraftRole] = useState<Exclude<
    ProjectMemberRole,
    "owner"
  > | null>(null)
  const selectedRole = draftRole ?? currentRole

  const { showToast } = useAppToast()
  const { handleChangeRole, isLoading, error } = useMemberActions(projectId)

  const handleClose = () => {
    setDraftRole(null)
    onClose()
  }

  const handleConfirm = async () => {
    if (selectedRole === currentRole || isLoading) return

    const succeeded = await handleChangeRole(member.userId, selectedRole)

    if (!succeeded) {
      return
    }

    showToast({ variant: "success", message: "Role updated successfully" })
    onSuccess()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-170 rounded-xl border border-border/45 p-0 sm:w-160">
        <div className="px-6 py-6 sm:px-7 sm:py-7">
          <DialogHeader className="space-y-3">
            <div className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UserCog className="size-5" />
            </div>

            <div className="space-y-1">
              <DialogTitle className="mb-3 text-[2rem] leading-none font-semibold tracking-tight text-foreground sm:text-[2.15rem]">
                Change Member Role
              </DialogTitle>
              <DialogDescription className="max-w-140 ps-1 text-sm leading-relaxed text-muted-foreground">
                Update {member.name}&apos;s role in {projectName}.
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            <label
              htmlFor="change-member-role"
              className="text-[0.68rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase"
            >
              Role
            </label>

            <Select
              value={selectedRole}
              onValueChange={(value) =>
                setDraftRole(value as Exclude<ProjectMemberRole, "owner">)
              }
              disabled={isLoading}
            >
              <SelectTrigger
                id="change-member-role"
                className="h-12 w-full bg-surface-highest px-4"
              >
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent position="popper" align="start" side="bottom" sideOffset={6}>
                {ROLE_OPTIONS.map((roleOption) => (
                  <SelectItem key={roleOption.value} value={roleOption.value}>
                    {roleOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
          </div>

          <div className="mt-7 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              className="h-11 min-w-24 px-4 text-[0.95rem] font-semibold text-muted-foreground hover:text-foreground"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>

            <Button
              type="button"
              size="lg"
              className="h-11 min-w-46 px-6 text-[0.95rem] font-semibold shadow-[0_10px_18px_rgba(0,50,184,0.2)]"
              onClick={() => {
                void handleConfirm()
              }}
              disabled={isLoading || selectedRole === currentRole}
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
