import type { LucideIcon } from "lucide-react"
import { Blocks, CalendarCheck2, LayoutGrid } from "lucide-react"

export type QuickStat = {
  label: string
  value: string
  detail: string
}

export type Capability = {
  icon: LucideIcon
  title: string
  description: string
  accent: string
}

export type WorkflowCard = {
  title: string
  value: string
  fill: string
  meta: string
}

export const quickStats: QuickStat[] = [
  { label: "Projects", value: "24", detail: "Active initiatives" },
  { label: "Tasks", value: "186", detail: "Tracked this week" },
  { label: "Members", value: "12", detail: "Across 3 squads" },
  { label: "Epics", value: "94%", detail: "On-time delivery" },
]

export const capabilities: Capability[] = [
  {
    icon: LayoutGrid,
    title: "Project views that stay clear",
    description:
      "A calm layout for planning, tracking, and reviewing work without losing the bigger picture.",
    accent: "bg-primary/10 text-primary",
  },
  {
    icon: Blocks,
    title: "Epic-to-task structure",
    description:
      "Break goals into epics and tasks with the same consistent card system used across the app.",
    accent: "bg-success/15 text-success",
  },
  {
    icon: CalendarCheck2,
    title: "Deadlines and progress bars",
    description:
      "Keep momentum visible with compact status bars, due dates, and lightweight progress indicators.",
    accent: "bg-warning/20 text-warning",
  },
]

export const workflowCards: WorkflowCard[] = [
  {
    title: "Plan",
    value: "08 open epics",
    fill: "w-2/5",
    meta: "Scope work before it spreads.",
  },
  {
    title: "Build",
    value: "126 active tasks",
    fill: "w-4/5",
    meta: "Track execution with one shared view.",
  },
  {
    title: "Ship",
    value: "14 releases ready",
    fill: "w-3/5",
    meta: "Move completed work into delivery cleanly.",
  },
]

export const trustPoints = [
  "Role-based access and secure invites",
  "Designed for light and dark themes",
  "Optimized for epics and tasks",
]
