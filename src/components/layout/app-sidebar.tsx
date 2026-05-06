"use client"

import { ChevronLeft, ChevronRight, LogOut } from "lucide-react"
import NavItems from "./nav-bar/nav-items"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar} from "@/components/ui/sidebar"
import AppLogo from "../shared/app-logo"

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="">
      <SidebarHeader className="h-14 justify-center border-b border-border/50">
        <AppLogo className="ml-3" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mt-3 gap-4">
              <NavItems />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 px-3 py-2.5">
        <SidebarMenu className="gap-1">
          <SidebarMenuItem className="hidden lg:flex">
            <CollapseButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

function CollapseButton() {
  const { toggleSidebar, open } = useSidebar()
  return (
    <SidebarMenuButton
      onClick={toggleSidebar}
      tooltip={open ? "Collapse" : "Expand"}
      className="h-8 cursor-pointer"
    >
      {open ? (
        <ChevronLeft className="size-4.5!" />
      ) : (
        <ChevronRight className="size-4.5!" />
      )}
      <span className="text-xs">Collapse</span>
    </SidebarMenuButton>
  )
}
