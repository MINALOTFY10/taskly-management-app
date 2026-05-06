"use client"

import { ChevronDown, LogOut } from "lucide-react"

import { useLogout } from "@/hooks/use-logout"
import { useAppSelector } from "@/store/hooks"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { getDisplayName, getInitials, getJobTitle } from "../main-shell.utils"

export function NavUserMenu() {
  const user = useAppSelector((state) => state.user.user)
  const { handleLogout, isLoggingOut } = useLogout()

  const displayName = getDisplayName(user)
  const initials = getInitials(displayName)
  const jobTitle = getJobTitle(user).toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-8 gap-2 rounded-full bg-muted/50 pr-3 pl-1 text-xs ring-1 ring-border/30 transition-colors hover:bg-muted/80"
        >
          <div className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60 text-[0.65rem] font-bold text-primary-foreground shadow-[0_1px_6px_rgba(0,0,0,0.25)]">
            {initials}
          </div>

          <div className="hidden min-w-0 text-left sm:block">
            <p className="truncate text-xs leading-tight font-semibold text-foreground">
              {displayName}
            </p>
            <p className="truncate text-[9px] leading-tight font-bold tracking-[0.08em] text-muted-foreground uppercase">
              {jobTitle}
            </p>
          </div>

          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <div className="px-3 py-2">
          <p className="truncate text-sm font-semibold text-foreground">
            {displayName}
          </p>
          <p className="truncate text-xs tracking-[0.08em] text-muted-foreground uppercase">
            {jobTitle}
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault()
            void handleLogout()
          }}
          disabled={isLoggingOut}
        >
          <LogOut className="mr-2 size-4" />
          {isLoggingOut ? "Signing out..." : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
