import { FolderOpen, GitFork, Info, ListChecks, Users } from "lucide-react"

import type { NavItem } from "./main-shell.types"

export const NAV_ITEMS: NavItem[] = [
  { key: "projects", label: "Projects", icon: FolderOpen, href: "/project" },
  { key: "epics", label: "Project Epics", icon: GitFork },
  { key: "tasks", label: "Project Tasks", icon: ListChecks },
  { key: "members", label: "Project Members", icon: Users },
  { key: "details", label: "Project Details", icon: Info },
]