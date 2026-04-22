"use client"

import { AlertCircle, List } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { TaskRow } from "./task-row"
import { useFetchEpicTasks } from "@/features/tasks/hooks/use-fetch-epic-tasks"
import type { EpicRow } from "@/features/epics/types"

type TasksListProps = {
  epic: EpicRow | null
  projectId: string
}

export function TasksList({ epic, projectId }: TasksListProps) {
  const { tasks, loading, error } = useFetchEpicTasks(epic?.id, projectId)

  return (
    <div className="mt-5 mx-5">
      {loading ? (
        <TasksListLoading />
      ) : error ? (
        <TasksListError message={error} />
      ) : tasks.length === 0 ? (
        <TasksListEmpty />
      ) : (
        <div className="rounded-xl border border-border/60 overflow-hidden bg-background">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className={index !== tasks.length - 1 ? "border-b border-border/60" : ""}
            >
              <TaskRow task={task} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function TasksListLoading() {
  return (
    <div className="space-y-0 rounded-xl border border-border/60 overflow-hidden">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className={`flex items-center justify-between px-4 py-4 ${i !== 2 ? "border-b border-border/60" : ""}`}
        >
          <div className="flex items-center gap-3 flex-1">
            <Skeleton className="h-5 w-5 rounded-full shrink-0" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <div className="text-right space-y-2">
            <Skeleton className="h-3 w-16 ml-auto" />
            <Skeleton className="h-4 w-24 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  )
}

function TasksListEmpty() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/50 bg-accent/10 py-10">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
        <List className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-muted-foreground">
        No tasks found for this epic
      </p>
    </div>
  )
}

function TasksListError({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-destructive/30 bg-destructive/5 py-10">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/20">
        <AlertCircle className="h-5 w-5 text-destructive" />
      </div>
      <p className="text-sm font-medium text-muted-foreground">Failed to load tasks</p>
      <p className="mt-1 text-xs text-muted-foreground text-center max-w-60">{message}</p>
    </div>
  )
}