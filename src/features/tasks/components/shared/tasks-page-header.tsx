import { Filter, Plus, Search } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type TasksView = "board" | "list"

type TasksPageHeaderProps = {
  projectId: string
  projectName: string
  view: TasksView
  onViewChange: (view: TasksView) => void
  isSwitchingView?: boolean
}

export function TasksPageHeader({
  projectId,
  projectName,
  view,
  onViewChange,
  isSwitchingView = false,
}: TasksPageHeaderProps) {
  const handleViewChange = (value: string) => {
    if (value === "list" || value === "board") {
      onViewChange(value)
    }
  }

  return (
    <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
      <div className="space-y-3">
        <p className="text-[0.6rem] font-bold tracking-[0.28em] text-muted-foreground uppercase">
          Projects &gt; {projectName} &gt; Tasks
        </p>
        <div className="space-y-1">
          <h1 className="text-[2.2rem] leading-none font-semibold tracking-tight text-foreground sm:text-[2.55rem]">
            Active Workboard
          </h1>
          <p className="max-w-140 text-sm text-muted-foreground sm:text-[0.95rem]">
            Curating {projectName}&apos;s production pipeline and milestones.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-53.5">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Search tasks (not yet available)"
            placeholder="Search tasks..."
            readOnly
            className="h-10 cursor-default border-0 bg-[#d9e2ff] pl-9 text-sm text-foreground shadow-none placeholder:text-slate-500 focus-visible:ring-0"
          />
        </div>

        <Select
          value={view}
          onValueChange={handleViewChange}
          disabled={isSwitchingView}
        >
          <SelectTrigger className="w-full border-0 bg-accent px-3 text-sm font-medium text-foreground shadow-none focus:ring-0 sm:w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className={cn(view === "board" ? "mt-18" : "mt-10")}>
            <SelectItem value="list">List View</SelectItem>
            <SelectItem value="board">Board View</SelectItem>
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-10 w-10 shrink-0 border-border/60 bg-background shadow-none"
          aria-label="Filter tasks"
        >
          <Filter className="size-4" />
        </Button>

        <Link
          href={`/project/${projectId}/tasks/new`}
          className="w-full sm:w-auto"
        >
          <Button className="h-10 w-full gap-2 px-5 sm:w-auto">
            <Plus className="size-4" />
            Create Task
          </Button>
        </Link>
      </div>
    </header>
  )
}