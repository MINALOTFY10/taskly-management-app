"use client"

import { ChevronLeft, ChevronRight, LogOut } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { NAV_ITEMS } from "./main-shell.constants"
import type { NavKey } from "./main-shell.types"
import AppLogo from "../shared/app-logo"
import { useState } from "react"
import { useLogout } from "@/hooks/use-logout"

export function AppSidebar() {
  const { handleLogout, isLoggingOut, logoutError } = useLogout()

  return (
    <Sidebar collapsible="icon" className="border-0!">
      <SidebarHeader className="h-16 justify-center border-b border-border/50">
        <AppLogo className="ml-4" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mt-4 gap-2">
              <NavItems />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 px-4 py-3">
        <SidebarMenu className="gap-2">
          <SidebarMenuItem className="hidden lg:flex">
            <CollapseButton />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              disabled={isLoggingOut}
              tooltip="Logout"
              className="h-10 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="size-4.5" />
              <span className="text-sm">
                {isLoggingOut ? "Logging out..." : "Logout"}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <p
          role="alert"
          className={
            logoutError
              ? "mt-2 rounded-md border border-error/30 bg-error/10 px-2 py-1 text-xs text-error"
              : "sr-only"
          }
        >
          {logoutError ?? ""}
        </p>
      </SidebarFooter>
    </Sidebar>
  )
}

// Sub-components
function CollapseButton() {
  const { toggleSidebar, open } = useSidebar()
  return (
    <SidebarMenuButton
      onClick={toggleSidebar}
      tooltip={open ? "Collapse" : "Expand"}
      className="h-10"
    >
      {open ? (
        <ChevronLeft className="size-5!" />
      ) : (
        <ChevronRight className="size-5!" />
      )}
      <span className="text-sm">Collapse</span>
    </SidebarMenuButton>
  )
}

function NavItems() {
  const [activeNav, setActiveNav] = useState<NavKey>("projects")

  return (
    <>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon
        return (
          <SidebarMenuItem key={item.key} className="px-2">
            <SidebarMenuButton
              isActive={item.key === activeNav}
              onClick={() => setActiveNav(item.key)}
              tooltip={item.label}
              className="h-11"
            >
              <Icon className="mr-1 size-5 shrink-0" />
              <span className="text-sm">{item.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </>
  )
}