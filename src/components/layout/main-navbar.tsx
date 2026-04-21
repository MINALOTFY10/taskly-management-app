"use client" 
import { SidebarTrigger } from "@/components/ui/sidebar"
import { getDisplayName, getInitials, getJobTitle } from "./main-shell.utils"
import { useAppSelector } from "@/store/hooks"

export function MainNavbar() {
  const user = useAppSelector((state) => state.user.user)

  const displayName = getDisplayName(user)
  const initials = getInitials(displayName)
  const jobTitle = getJobTitle(user).toUpperCase()

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-surface-high px-3 sm:px-6">
      <div className="flex items-center gap-2 lg:hidden">
        <SidebarTrigger className="text-foreground" />
        <span className="text-xl font-bold tracking-tight text-foreground">
          TASKLY
        </span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm leading-tight font-semibold text-foreground">
            {displayName}
          </p>
          <p className="text-[10px] leading-tight font-bold tracking-[0.08em] text-muted-foreground">
            {jobTitle}
          </p>
        </div>

        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
          {initials}
        </div>
      </div>
    </header>
  )
}