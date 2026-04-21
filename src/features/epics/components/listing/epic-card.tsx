"use client"

import { CalendarDays, MoreHorizontal, UserRound } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import EpicDetailsModal from "@/features/epics/components/listing/epic-details-modal"
import type { EpicRow } from "@/features/epics/types"
import EpicAvatar from "@/features/epics/components/shared/epic-avatar"
import { getEpicBadgeColor } from "@/features/epics/utils/epic-badge"
import {
  getStatusClassName,
  getStatusLabel,
} from "@/features/epics/utils/status"
import { formatEpicDate } from "@/features/epics/utils/date"
import { cn } from "@/lib/utils"

type EpicCardProps = {
  epic: EpicRow
}

export default function EpicCard({ epic }: EpicCardProps) {
  const badgeColor = getEpicBadgeColor(epic.epic_id)
  const statusLabel = getStatusLabel(epic.status)
  const statusClass = getStatusClassName(epic.status)
  const assigneeName = epic.assignee?.name ?? "Unassigned"
  const isDone = statusLabel === "Done"

  const [open, setOpen] = useState(false)

  return (
    <>
      <article
        onClick={() => setOpen(true)}
        className={cn(
          "group flex flex-col rounded-xl border-l-7 border-[#004E32] bg-card p-4 shadow-sm transition-colors hover:border-primary/20 hover:bg-accent/10 sm:p-5 cursor-pointer",
          isDone && "border-0! bg-primary/5 hover:bg-primary/5"
        )}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center rounded-sm border-0! px-3.5 py-1 text-[0.68rem] font-bold tracking-wide",
                badgeColor
              )}
            >
              {epic.epic_id}
            </span>

            <span
              className={cn(
                "inline-flex items-center rounded-md px-2 py-0.5 text-[0.68rem] font-semibold sm:hidden",
                statusClass
              )}
            >
              {statusLabel}
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
            aria-label={`Options for ${epic.title}`}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </div>

        <h3 className="mt-5 line-clamp-2 text-[1.35rem] leading-snug font-bold text-foreground">
          {epic.title}
        </h3>

        <div className="mt-4 hidden items-center justify-between sm:flex">
          <div className="flex items-center gap-2.5">
            <EpicAvatar name={assigneeName} size="md" />
            <div>
              <p className="text-[0.6rem] font-bold tracking-widest text-muted-foreground uppercase">
                Assignee
              </p>
              <p className="text-sm font-medium text-foreground">
                {assigneeName}
              </p>
            </div>
          </div>

          <span
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-semibold",
              statusClass
            )}
          >
            {statusLabel}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between sm:hidden">
          <div className="flex items-center gap-2">
            <EpicAvatar name={assigneeName} size="sm" />
            <div>
              <p className="text-[0.6rem] font-bold tracking-widest text-muted-foreground uppercase">
                Assignee
              </p>
              <p className="text-sm font-medium text-foreground">
                {assigneeName}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[0.6rem] font-bold tracking-widest text-muted-foreground uppercase">
              Deadline
            </p>
            <p className="text-sm font-medium text-foreground">
              {formatEpicDate(epic.deadline)}
            </p>
          </div>
        </div>

        <div className="mt-8 hidden sm:block">
          <div className="border-1.5 mb-3 h-px w-full bg-border/30" />

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <UserRound className="size-3.5 shrink-0" aria-hidden="true" />
              <span>
                Created by:{" "}
                <span className="font-medium text-foreground/80">
                  {epic.created_by.name}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <CalendarDays className="size-3.5 shrink-0" aria-hidden="true" />
              <span>{formatEpicDate(epic.created_at)}</span>
            </div>
          </div>
        </div>
      </article>
      <EpicDetailsModal
        open={open}
        onClose={() => setOpen(false)}
        epic={epic}
      />
    </>
  )
}