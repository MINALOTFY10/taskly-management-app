"use client"

import { ChevronsLeft, ChevronsRight } from "lucide-react"
import NavItems from "./nav-bar/nav-items"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import AppLogo from "../shared/app-logo"
import SettingsDialog from "../../features/settings/components/SettingsDialog"
import { NavItem } from "./nav-bar/nav-item"

export function AppSidebar() {
  const { toggleSidebar, open } = useSidebar()

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

      <SidebarFooter className="border-t border-border/50 py-3.5 pt-4">
        <SidebarMenu className="items-start gap-3.5">
          <NavItem
            label={open ? "Collapse" : "Expand"}
            icon={open ? ChevronsLeft : ChevronsRight}
            onClick={toggleSidebar}
            menuItemClassName="hidden lg:flex ms-1"
            buttonClassName="h-8 px-3 w-58 cursor-pointer"
            iconClassName="size-5.5!"
          />
          <SidebarMenuItem className="ms-1 hidden lg:flex">
            <SettingsDialog />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
