"use client"

import { Loader2, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

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

type LeaveProjectDialogProps = {
  open: boolean
  onClose: () => void
  projectName: string
  projectId: string
}

export default function LeaveProjectDialog({
  open,
  onClose,
  projectName,
  projectId,
}: LeaveProjectDialogProps) {
  const router = useRouter()
  const { showToast } = useAppToast()
  const { handleLeaveProject, isLoading, error } = useMemberActions(projectId)

  const handleConfirm = async () => {
    if (isLoading) return

    const succeeded = await handleLeaveProject()

    if (!succeeded) {
      return
    }

    showToast({ variant: "success", message: "You have left the project" })
    router.push("/project")
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-170 rounded-xl border border-border/45 p-0 sm:w-160">
        <div className="px-6 py-6 sm:px-7 sm:py-7">
          <DialogHeader className="space-y-3">
            <div className="inline-flex size-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <LogOut className="size-5" />
            </div>

            <div className="space-y-1">
              <DialogTitle className="text-[2rem] leading-none font-semibold tracking-tight text-foreground sm:text-[2.15rem] mb-2">
                Leave Project
                </DialogTitle>
                <DialogDescription className="ps-1text-sm leading-relaxed text-muted-foreground">
                Are you sure you want to leave {projectName}? You will lose access to all project content.
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
                  Leaving...
                </span>
              ) : (
                "Leave Project"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
