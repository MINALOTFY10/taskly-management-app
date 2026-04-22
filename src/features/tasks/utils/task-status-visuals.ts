import { TaskStatus } from "../types"

export const TASK_STATUS_VISUALS: Record<
  TaskStatus,
  {
    dot: string
    count: string
    card: string
  }
> = {
  TO_DO: {
    dot: "bg-slate-400",
    count: "bg-slate-100 text-slate-500",
    card: "border-border/60 bg-card",
  },
  IN_PROGRESS: {
    dot: "bg-blue-600",
    count: "bg-blue-100 text-blue-700",
    card: "border-blue-200 bg-card border-l-4 border-l-blue-600 shadow-[0_1px_4px_rgba(37,99,235,0.08)]",
  },
  BLOCKED: {
    dot: "bg-red-500",
    count: "bg-red-100 text-red-700",
    card: "border-red-200 bg-red-50/70 shadow-[0_1px_4px_rgba(239,68,68,0.08)]",
  },
  IN_REVIEW: {
    dot: "bg-amber-500",
    count: "bg-amber-100 text-amber-700",
    card: "border-amber-200 bg-card",
  },
  READY_FOR_QA: {
    dot: "bg-emerald-500",
    count: "bg-emerald-100 text-emerald-700",
    card: "border-emerald-200 bg-card",
  },
  REOPENED: {
    dot: "bg-orange-500",
    count: "bg-orange-100 text-orange-700",
    card: "border-orange-200 bg-card",
  },
  READY_FOR_PRODUCTION: {
    dot: "bg-violet-600",
    count: "bg-violet-100 text-violet-700",
    card: "border-violet-200 bg-card",
  },
  DONE: {
    dot: "bg-slate-500",
    count: "bg-slate-100 text-slate-500",
    card: "border-slate-200 bg-slate-50/70",
  },
}