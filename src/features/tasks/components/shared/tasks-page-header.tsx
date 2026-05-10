import { Filter, Loader2, Plus, Search } from "lucide-react"
import Link from "next/link"

import { BreadcrumbNav } from "@/components/shared/breadcrumb-nav"
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
  searchTerm?: string
  onSearchTermChange?: (value: string) => void
  isSearching?: boolean
}

export function TasksPageHeader({
  projectId,
  projectName,
  view,
  onViewChange,
  isSwitchingView = false,
  searchTerm,
  onSearchTermChange,
  isSearching = false,
}: TasksPageHeaderProps) {
  const handleViewChange = (value: string) => {
    if (value === "list" || value === "board") {
      onViewChange(value)
    }
  }

  return (
    <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div className="space-y-2">
        <BreadcrumbNav
          items={[
            { label: "Projects", href: "/project" },
            {
              label: projectName,
              href: `/project/${projectId}/details`,
            },
            { label: "Tasks", current: true },
          ]}
        />
        <div className="space-y-1">
          <h1 className="text-[2rem] leading-none font-semibold tracking-tight text-foreground">
            Active Workboard
          </h1>
          <p className="max-w-140 text-xs text-muted-foreground sm:text-[0.85rem]">
            Curating {projectName}&apos;s production pipeline and milestones.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-50">
          {isSearching ? (
            <Loader2 className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          ) : (
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          )}
          <Input
            aria-label="Search tasks"
            placeholder="Search tasks..."
            className={cn(
              "h-9 border border-border/60 bg-surface-highest pl-8.5 text-xs text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/30",
              !onSearchTermChange && "cursor-default"
            )}
            value={searchTerm}
            onChange={(event) => onSearchTermChange?.(event.target.value)}
            readOnly={!onSearchTermChange}
            aria-busy={isSearching}
          />
        </div>

        <Select
          value={view}
          onValueChange={handleViewChange}
          disabled={isSwitchingView}
        >
          <SelectTrigger className="w-full border border-border/60 bg-card px-2.5 text-xs font-medium text-foreground shadow-sm focus:ring-0 sm:w-34">
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
          className="h-9 w-9 shrink-0 border-border/60 bg-background shadow-none"
          aria-label="Filter tasks"
        >
          <Filter className="size-4" />
        </Button>

        <Link
          href={`/project/${projectId}/tasks/new`}
          className="w-full sm:w-auto"
        >
          <Button className="h-9 w-full gap-1.5 px-4 sm:w-auto">
            <Plus className="size-4" />
            Create Task
          </Button>
        </Link>
      </div>
    </header>
  )
}
