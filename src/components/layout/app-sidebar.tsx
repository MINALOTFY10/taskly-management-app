"use client"

import { ChevronLeft, ChevronRight, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

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
import AppLogo from "../shared/app-logo"
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
  const pathname = usePathname()
  const projectIdMatch = pathname.match(/^\/project\/([^\/]+)/)
  const projectId = projectIdMatch?.[1] ?? null

  const projectNavHrefByKey = {
    epics: projectId ? `/project/${projectId}/epics` : undefined,
    tasks: projectId ? `/project/${projectId}/tasks` : undefined,
    members: projectId ? `/project/${projectId}/members` : undefined,
    details: projectId ? `/project/${projectId}/details` : undefined,
  } as const

  return (
    <>
      {NAV_ITEMS.map((item) => {
        const href =
          item.key === "projects" ? item.href : projectNavHrefByKey[item.key]
        const isDisabled = item.key !== "projects" && !projectId
        const Icon = item.icon

        const isActive = href
          ? pathname === (href || pathname.startsWith(`${href}/`))
          : false

        if (href && !isDisabled) {
          return (
            <SidebarMenuItem key={item.key} className="px-2">
              <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={item.label}
                className="h-11"
              >
                <Link href={href}>
                  <Icon className="mr-1 size-5 shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        }

        return (
          <SidebarMenuItem key={item.key} className="px-2">
            <SidebarMenuButton
              isActive={false}
              tooltip={item.label}
              disabled={isDisabled}
              className="h-11 disabled:cursor-not-allowed disabled:opacity-50"
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
