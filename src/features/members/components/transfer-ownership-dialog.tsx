"use client"

import { Loader2, Repeat } from "lucide-react"

import { useAppToast } from "@/components/providers/toast-provider"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useMemberActions } from "@/features/members/hooks/use-member-actions"
import type { ProjectMemberRow } from "@/features/members/types"

type TransferOwnershipDialogProps = {
  open: boolean
  onClose: () => void
  member: ProjectMemberRow
  projectName: string
  projectId: string
  onSuccess: () => void
}

export default function TransferOwnershipDialog({
  open,
  onClose,
  member,
  projectName,
  projectId,
  onSuccess,
}: TransferOwnershipDialogProps) {
  const { showToast } = useAppToast()
  const { handleTransferOwnership, isLoading, error } = useMemberActions(projectId)

  const handleConfirm = async () => {
    if (isLoading) return

    const succeeded = await handleTransferOwnership(member.userId)

    if (!succeeded) {
      return
    }

    showToast({ variant: "success", message: "Ownership transferred successfully" })
    onSuccess()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-170 rounded-xl border border-border/45 p-0 sm:w-160">
        <div className="px-6 py-6 sm:px-7 sm:py-7">
          <DialogHeader className="space-y-3">
            <div className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Repeat className="size-5" />
            </div>

            <div className="space-y-1">
              <DialogTitle className="mb-4 text-[2rem] leading-none font-semibold tracking-tight text-foreground sm:text-[2.15rem]">
                Transfer Ownership
              </DialogTitle>
              <DialogDescription className="ps-1 text-sm leading-relaxed text-muted-foreground">
                Transfer ownership of {projectName} to {member.name}? You will become an admin.
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
              size="lg"
              className="h-11 min-w-46 px-6 text-[0.95rem] font-semibold shadow-[0_10px_18px_rgba(0,50,184,0.2)]"
              onClick={() => {
                void handleConfirm()
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Transferring...
                </span>
              ) : (
                "Transfer Ownership"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
