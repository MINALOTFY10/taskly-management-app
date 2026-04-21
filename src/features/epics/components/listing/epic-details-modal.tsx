"use client"

import { formatEpicDate } from "@/features/epics/utils/date"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import type { EpicRow } from "@/features/epics/types"
import EpicAvatar from "@/features/epics/components/shared/epic-avatar"
import { Button } from "@/components/ui/button"
import { BiSolidCarousel } from "react-icons/bi"
import { CalendarDays, List } from "lucide-react"

type Props = {
  open: boolean
  onClose: () => void
  epic: EpicRow | null
  loading?: boolean
  error?: string | null
}

/**
 * Local skeleton helper to keep the JSX readable.
 * Only rendered when loading=true — never used as a null fallback.
 */
function Skeleton({ className }: { className: string }) {
  return (
    <span className={`inline-block animate-pulse rounded bg-muted ${className}`} />
  )
}

export default function EpicDetailsModal({
  open,
  onClose,
  epic,
  loading = false,
  error = null,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent>
        <div className="px-6 py-6">
          <DialogHeader>
            {/* Epic ID badge row */}
            <div className="flex items-center gap-3">
              <BiSolidCarousel size={20} className="text-[#003D9B]" />
              <span className="inline-flex items-center rounded-sm px-0 py-1 text-xs font-extrabold tracking-wide text-muted-foreground/90">
                {loading ? (
                  <Skeleton className="h-4 w-16" />
                ) : (
                  epic?.epic_id ?? "—"
                )}
              </span>
            </div>

            {/* Title */}
            <DialogTitle className="text-2xl">
              {loading ? (
                <Skeleton className="h-6 w-2/3" />
              ) : (
                epic?.title ?? "Epic details"
              )}
            </DialogTitle>

            {/* Description / error */}
            <DialogDescription className="mt-3">
              {loading ? (
                <Skeleton className="h-4 w-full" />
              ) : error ? (
                <span className="text-sm text-destructive">{error}</span>
              ) : (
                <span className="text-sm text-muted-foreground">
                  {epic?.description ?? "No description provided"}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          {/* Meta grid */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Created by */}
            <div className="sm:col-span-1">
              <p className="text-[0.65rem] font-bold tracking-widest text-muted-foreground uppercase">
                Created by
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                {loading ? (
                  <Skeleton className="h-7 w-7 rounded-full" />
                ) : (
                  <EpicAvatar
                    name={epic?.created_by.name ?? "Unknown"}
                    size="sm"
                  />
                )}
                <div className="text-sm font-medium">
                  {loading ? (
                    <Skeleton className="h-4 w-20" />
                  ) : (
                    epic?.created_by.name ?? "Unknown"
                  )}
                </div>
              </div>
            </div>

            {/* Assignee */}
            <div className="sm:col-span-1">
              <p className="text-[0.65rem] font-bold tracking-widest text-muted-foreground uppercase">
                Assignee
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                {loading ? (
                  <Skeleton className="h-7 w-7 rounded-full" />
                ) : (
                  <EpicAvatar
                    name={epic?.assignee?.name ?? "Unassigned"}
                    size="sm"
                  />
                )}
                <div className="text-sm font-medium">
                  {loading ? (
                    <Skeleton className="h-4 w-20" />
                  ) : (
                    epic?.assignee?.name ?? "Unassigned"
                  )}
                </div>
              </div>
            </div>

            {/* Created at */}
            <div className="sm:col-span-1">
              <p className="text-[0.65rem] font-bold tracking-widest text-muted-foreground uppercase">
                Created at
              </p>
              <div className="mt-2 flex items-center gap-2 text-sm font-medium">
                <CalendarDays className="size-3.5 shrink-0" aria-hidden="true" />
                {loading ? (
                  <Skeleton className="h-4 w-16" />
                ) : (
                  epic ? formatEpicDate(epic.created_at) : "—"
                )}
              </div>
            </div>
          </div>

          {/* Tasks empty state */}
          <div className="mt-6">
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface-low px-6 py-12 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                <List className="h-6 w-6 text-muted-foreground" />
              </div>

              <h3 className="mb-6 text-lg font-normal text-foreground">
                No tasks have been added to this epic yet
              </h3>

              <Button className="bg-primary px-7 py-5.5 text-base font-medium transition-colors hover:bg-primary-container">
                <span className="mr-2 text-xl">+</span> Add Task
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}