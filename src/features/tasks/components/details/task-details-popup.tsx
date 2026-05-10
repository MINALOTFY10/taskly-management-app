"use client"

import { useCallback, useEffect, useState } from "react"
import { Link2, X } from "lucide-react"

import { useAppToast } from "@/components/providers/toast-provider"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { updateTaskAction } from "@/features/tasks/actions"
import type { TaskWithAssignee } from "@/features/tasks/queries"
import type { UpdateTaskFormValues } from "@/features/tasks/schemas/validations"
import { TaskMetaGrid } from "./task-meta-grid"
import { TaskDescriptionSection } from "./task-description-section"
import { TaskStatusBadge } from "./task-status-badge"
import { TaskTitleSection } from "./task-title-section"

const UPDATE_TASK_ERROR_MESSAGE = "Failed to update task. Please try again."

type TaskDetailsModalProps = {
  open: boolean
  onClose: () => void
  task: TaskWithAssignee | null
  projectId: string
  onTaskUpdated?: (task: TaskWithAssignee) => void
  loading?: boolean
  error?: string | null
}

export default function TaskDetailsModal({
  open,
  onClose,
  task,
  projectId,
  onTaskUpdated,
  loading = false,
  error = null,
}: TaskDetailsModalProps) {
  const { showToast } = useAppToast()
  const [localTask, setLocalTask] = useState<TaskWithAssignee | null>(task)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setLocalTask(task)
  }, [task, open])

  const saveTaskUpdate = async (
    payload: UpdateTaskFormValues,
    buildOptimisticTask: (current: TaskWithAssignee) => TaskWithAssignee
  ) => {
    if (!localTask || isSaving) return

    const previousTask = localTask
    const optimisticTask = buildOptimisticTask(previousTask)

    setIsSaving(true)
    setLocalTask(optimisticTask)
    onTaskUpdated?.(optimisticTask)

    try {
      const result = await updateTaskAction(projectId, localTask.id, payload)

      if (result.error || !result.data) {
        throw new Error(result.error ?? UPDATE_TASK_ERROR_MESSAGE)
      }

      setLocalTask(result.data)
      onTaskUpdated?.(result.data)
      showToast({ variant: "success", message: "Task updated successfully" })
    } catch {
      setLocalTask(previousTask)
      onTaskUpdated?.(previousTask)
      showToast({ variant: "error", message: UPDATE_TASK_ERROR_MESSAGE })
    } finally {
      setIsSaving(false)
    }
  }

  const isBusy = loading || isSaving

  const handleCopyLink = useCallback(async () => {
    if (!localTask) return
    try {
      const url = new URL(`/project/${projectId}/tasks`, window.location.origin)
      url.searchParams.set("taskId", localTask.id)
      await navigator.clipboard.writeText(url.toString())
      showToast({ variant: "success", message: "Task link copied" })
    } catch {
      showToast({ variant: "error", message: "Unable to copy task link" })
    }
  }, [localTask, projectId, showToast])

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="min-h-[90%] w-[calc(100%-1.25rem)] max-w-245 overflow-hidden border border-[#DCE3F1] bg-[#F4F6FC] p-0 shadow-[0_26px_88px_rgba(15,30,60,0.24)] max-sm:top-auto max-sm:right-0 max-sm:bottom-0 max-sm:left-0 max-sm:w-full max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-t-[28px] max-sm:rounded-b-none sm:w-[calc(100%-2rem)] sm:rounded-2xl"
      >
        <ModalContent
          task={localTask}
          isBusy={isBusy}
          error={error}
          onClose={onClose}
          onCopyLink={handleCopyLink}
          onUpdateTask={saveTaskUpdate}
        />
      </DialogContent>
    </Dialog>
  )
}

type ModalContentProps = {
  task: TaskWithAssignee | null
  isBusy: boolean
  error: string | null
  onClose: () => void
  onCopyLink: () => void
  onUpdateTask: (
    payload: UpdateTaskFormValues,
    buildOptimisticTask: (current: TaskWithAssignee) => TaskWithAssignee
  ) => Promise<void>
}

function ModalContent({
  task,
  isBusy,
  error,
  onClose,
  onCopyLink,
  onUpdateTask,
}: ModalContentProps) {
  if (error) return <ModalError message={error} onClose={onClose} />
  if (!task) return <ModalEmpty onClose={onClose} />

  return (
    <>
      <div className="hidden sm:grid sm:max-h-[90vh] sm:grid-cols-[minmax(0,1fr)_320px]">
        <section className="flex min-h-0 flex-col bg-white/35">
          <div className="border-b border-[#DCE3F1] px-6 py-6">
            <TaskIdBadge taskId={task.id} epicId={task.epic_id} />
            <TaskTitleSection
              task={task}
              isBusy={isBusy}
              onSave={(title) =>
                onUpdateTask({ title }, (current) => ({ ...current, title }))
              }
            />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            <p className="text-[12px] font-bold tracking-[0.12em] text-muted-foreground/80 uppercase">
              Description
            </p>
            <TaskDescriptionSection
              task={task}
              isBusy={isBusy}
              onSave={(description) =>
                onUpdateTask({ description }, (current) => ({
                  ...current,
                  description,
                }))
              }
            />
          </div>

          <div className="flex items-center justify-between border-t border-[#DCE3F1] px-6 py-3">
            <button
              type="button"
              onClick={onCopyLink}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#3D557E] transition-colors hover:text-[#1A3768]"
            >
              <Link2 className="size-4" />
              Copy link
            </button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-9 border-[#CFD7EA] bg-[#E5ECFA] px-5 text-[#243B63] hover:bg-[#DCE6FA]"
            >
              Close
            </Button>
          </div>
        </section>

        <aside className="max-h-[90vh] overflow-y-auto border-l border-[#DCE3F1] bg-[#EEF2FC] px-5 py-5">
          <TaskMetaGrid
            task={task}
            isBusy={isBusy}
            onUpdate={onUpdateTask}
          />
        </aside>
      </div>

      <div className="max-h-[88vh] overflow-y-auto px-4 pt-3 pb-6 sm:hidden">
        <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-[#D3DAEB]" />

        <div className="flex items-start justify-between gap-3">
          <div>
            <TaskIdBadge taskId={task.id} epicId={task.epic_id} />
            <h2 className="mt-2 text-[38px] leading-[1.05] font-bold tracking-[-0.02em] text-[#132A4D]">
              {task.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-[#435D88] transition-colors hover:bg-[#E8EDFA]"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <TaskStatusBadge
            status={task.status}
            size="sm"
            className="text-[10px] tracking-[0.08em] uppercase"
          />
          {task.epic_id ? (
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em] uppercase",
                "bg-[#DDE8FB] text-[#37588F]"
              )}
            >
              {task.epic_id}
            </span>
          ) : null}
        </div>

        <TaskMetaGrid mode="mobile" task={task} />

        <div className="mt-5">
          <p className="text-[11px] font-bold tracking-[0.12em] text-muted-foreground/80 uppercase">
            Description
          </p>
          <div className="mt-2.5 rounded-xl border border-[#E4E8F2] bg-white/40 px-4 py-3 text-[14px] leading-6 text-[#2A3D5F]">
            {task.description?.trim() ? (
              task.description.trim()
            ) : (
              <span className="italic opacity-70">No description provided</span>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

// Shared sub-components
function TaskIdBadge({
  taskId,
  epicId,
}: {
  taskId: string
  epicId: string | null
}) {
  return (
    <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.08em] text-[#2F4A7A] uppercase">
      <span className="rounded-md bg-[#E9EEF9] px-2 py-1 text-[10px] text-[#39588D]">
        {"Task-" + taskId.slice(0, 3).toUpperCase()}
      </span>
      {epicId ? <span>{epicId}</span> : null}
    </div>
  )
}

function ModalError({
  message,
  onClose,
}: {
  message: string
  onClose: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <p className="text-sm font-medium text-destructive">{message}</p>
      <Button variant="outline" onClick={onClose}>
        Close
      </Button>
    </div>
  )
}

function ModalEmpty({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <p className="text-sm font-medium text-muted-foreground">
        Task not found
      </p>
      <Button variant="outline" onClick={onClose}>
        Close
      </Button>
    </div>
  )
}
