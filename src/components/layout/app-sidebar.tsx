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

interface AppSidebarProps {
  activeNav: NavKey
  setActiveNav: (key: NavKey) => void
  handleLogout: () => void
}

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

function NavItem({activeNav, setActiveNav}: {activeNav: NavKey, setActiveNav: (key: NavKey) => void}) {
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
export function AppSidebar({
  activeNav,
  setActiveNav,
  handleLogout,
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" className="border-0!">
      <SidebarHeader className="h-16 justify-center border-b border-border/50">
        <AppLogo className="ml-4" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mt-4 gap-2">
              <NavItem activeNav={activeNav} setActiveNav={setActiveNav} />
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
              tooltip="Logout"
              className="h-10 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="size-4.5" />
              <span className="text-sm">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
