"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { NavSearch } from "./nav-search"
import { NavUserMenu } from "./nav-user-menu"

export function MainNavbar() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDarkMode = resolvedTheme === "dark" 

  return (
    <header className="sticky top-2 z-20 mx-2.5 mb-2.5 flex min-h-12 items-center gap-2 rounded-2xl bg-background/80 px-2.5 py-2 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.1)] ring-1 ring-border/25 backdrop-blur-md sm:mx-4 sm:px-4">
      <div className="flex items-center gap-1.5 lg:shrink-0">
        <SidebarTrigger className="text-foreground lg:hidden" />
      </div>

      <NavSearch />

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="size-8 rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={() => setTheme(isDarkMode ? "light" : "dark")}
              aria-label={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDarkMode ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isDarkMode ? "Light mode" : "Dark mode"}
          </TooltipContent>
        </Tooltip>

        <NavUserMenu />
      </div>
    </header>
  )
}
