// @/features/epics/components/details/sections/epic-meta-grid.tsx
import { formatEpicDate } from "@/features/epics/utils/date"
import EpicAvatar from "@/features/epics/components/shared/epic-avatar"
import { AssigneeSection } from "./assignee-section"
import { DeadlineSection } from "./deadline-section"
import { CalendarDays } from "lucide-react"

export function EpicMetaGrid({ epic, isBusy, assigneeOptions, onUpdate }: any) {
  return (
    <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-7">
      <div className="sm:col-span-2">
        <MetaLabel>Created by</MetaLabel>
        <div className="mt-2.5 flex items-center gap-2">
          <EpicAvatar 
            name={epic?.created_by.name ?? "Unknown"} 
            size="sm" 
          />
          <div className="text-sm font-medium">
            {epic?.created_by.name ?? "Unknown"}
          </div>
        </div>
      </div>

      <div className="sm:col-span-2">
        <MetaLabel>Assignee</MetaLabel>
        <AssigneeSection 
          epic={epic} 
          isBusy={isBusy} 
          options={assigneeOptions} 
          onUpdate={onUpdate} 
        />
      </div>

      <div className="flex gap-14 sm:col-span-3 ms-auto">
        <div className="items-start text-sm font-medium">
          <MetaLabel>Created at</MetaLabel>
          <div className="flex items-center gap-1">
            <CalendarDays className="size-3.5 shrink-0 text-muted-foreground" />
            {formatEpicDate(epic?.created_at)}
          </div>
        </div>

        <div className="items-start text-sm font-medium">
          <MetaLabel>Deadline</MetaLabel>
          <DeadlineSection 
            epic={epic} 
            isBusy={isBusy} 
            onUpdate={onUpdate} 
          />
        </div>
      </div>
    </div>
  )
}

function MetaLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-[0.65rem] font-bold tracking-widest text-muted-foreground uppercase">
      {children}
    </p>
  )
}