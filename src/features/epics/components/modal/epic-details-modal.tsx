"use client"

import { useCallback, useEffect, useState } from "react"
import { BiSolidCarousel } from "react-icons/bi"
import { List } from "lucide-react"

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAppToast } from "@/components/providers/toast-provider"
import { updateEpicAction } from "@/features/epics/actions"

import type { EpicRow } from "@/features/epics/types"
import type { UpdateEpicFormValues } from "@/features/epics/schemas/validations"

// Sub-components
import { EpicTitleSection } from "./epic-title-section"
import { EpicDescriptionSection } from "./epic-description-section"
import { EpicMetaGrid } from "./epic-meta-grid"

const UPDATE_EPIC_ERROR_MESSAGE = "Failed to update epic. Please try again."

type EpicDetailsModalProps = {
  open: boolean
  onClose: () => void
  epic: EpicRow | null
  projectId: string
  assigneeOptions: any[]
  onEpicUpdated?: (epic: EpicRow) => void
  loading?: boolean
  error?: string | null
}

export default function EpicDetailsModal({
  open,
  onClose,
  epic,
  projectId,
  assigneeOptions,
  onEpicUpdated,
  loading = false,
  error = null,
}: EpicDetailsModalProps) {
  const { showToast } = useAppToast()
  const [localEpic, setLocalEpic] = useState<EpicRow | null>(epic)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setLocalEpic(epic)
  }, [epic, open])

  const saveEpicUpdate = async (
    payload: UpdateEpicFormValues,
    buildOptimisticEpic: (current: EpicRow) => EpicRow
  ) => {
    if (!localEpic || isSaving) return

    const previousEpic = localEpic
    const optimisticEpic = buildOptimisticEpic(previousEpic)

    setIsSaving(true)
    setLocalEpic(optimisticEpic)
    onEpicUpdated?.(optimisticEpic)

    try {
      const result = (await updateEpicAction(
        projectId,
        localEpic.id,
        payload
      )) as any
      if (result.error || !result.data) throw new Error(result.error)

      setLocalEpic(result.data)
      onEpicUpdated?.(result.data)
      showToast({ variant: "success", message: "Epic updated successfully" })
    } catch {
      setLocalEpic(previousEpic)
      onEpicUpdated?.(previousEpic)
      showToast({ variant: "error", message: UPDATE_EPIC_ERROR_MESSAGE })
    } finally {
      setIsSaving(false)
    }
  }

  const isBusy = loading || isSaving

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-215 p-0">
        <div className="px-8 py-8">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <BiSolidCarousel size={20} className="text-[#003D9B]" />
              <span className="text-xs font-extrabold tracking-wide text-muted-foreground/90">
                {localEpic?.epic_id ?? "—"}
              </span>
            </div>

            <EpicTitleSection
              epic={localEpic}
              isBusy={isBusy}
              onSave={(title) =>
                saveEpicUpdate({ title }, (curr) => ({ ...curr, title }))
              }
            />

            <EpicDescriptionSection
              epic={localEpic}
              isBusy={isBusy}
              onSave={(description) =>
                saveEpicUpdate({ description }, (curr) => ({
                  ...curr,
                  description,
                }))
              }
            />
          </DialogHeader>

          <div className="mt-8 h-px w-full bg-border/60" />

          <EpicMetaGrid
            epic={localEpic}
            isBusy={isBusy}
            assigneeOptions={assigneeOptions}
            onUpdate={saveEpicUpdate}
          />

          <div className="mt-10 flex items-center justify-between">
            <h3 className="text-3xl font-semibold text-foreground">Tasks</h3>
            <Button variant="ghost" className="font-semibold text-primary">
              + Add Task
            </Button>
          </div>

          <EmptyTaskState />
        </div>
      </DialogContent>
    </Dialog>
  )
}

function EmptyTaskState() {
  return (
    <div className="mt-5 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/70 bg-surface-low py-12">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
        <List className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mb-6 text-lg font-normal">No tasks added yet</h3>
      <Button className="bg-primary px-7">+ Add Task</Button>
    </div>
  )
}
