"use client"

import { Loader2, UserMinus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAppToast } from "@/components/providers/toast-provider"
import { useMemberActions } from "@/features/members/hooks/use-member-actions"
import type { ProjectMemberRow } from "@/features/members/types"

type RemoveMemberDialogProps = {
  open: boolean
  onClose: () => void
  member: ProjectMemberRow
  projectName: string
  projectId: string
  onSuccess: () => void
}

export default function RemoveMemberDialog({
  open,
  onClose,
  member,
  projectName,
  projectId,
  onSuccess,
}: RemoveMemberDialogProps) {
  const { showToast } = useAppToast()
  const { handleRemoveMember, isLoading, error } = useMemberActions(projectId)

  const handleConfirm = async () => {
    if (isLoading) return

    const succeeded = await handleRemoveMember(member.userId)

    if (!succeeded) {
      return
    }

    showToast({ variant: "success", message: "Member removed successfully" })
    onSuccess()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-170 rounded-xl border border-border/45 p-0 sm:w-160">
        <div className="px-6 py-6 sm:px-7 sm:py-7">
          <DialogHeader className="space-y-3">
            <div className="inline-flex size-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <UserMinus className="size-5" />
            </div>

            <div className="space-y-1">
              <DialogTitle className="text-[2rem] leading-none font-semibold tracking-tight text-foreground sm:text-[2.15rem] mb-3">
                Remove Member
              </DialogTitle>
              <DialogDescription className="max-w-140 text-sm leading-relaxed text-muted-foreground ps-1">
                Are you sure you want to remove {member.name} from {projectName}? This action cannot be undone.
              </DialogDescription>
            </div>
          </DialogHeader>

          {error ? (
            <p className="mt-6 text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <div className="mt-7 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              className="h-11 min-w-24 px-4 text-[0.95rem] font-semibold text-muted-foreground hover:text-foreground"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              size="lg"
              className="h-11 min-w-46 px-6 text-[0.95rem] font-semibold"
              onClick={() => {
                void handleConfirm()
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Removing...
                </span>
              ) : (
                "Remove Member"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
