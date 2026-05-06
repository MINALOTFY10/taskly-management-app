import Link from "next/link"
import { usePathname } from "next/navigation"
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { NAV_ITEMS } from "../main-shell.constants"

export default function NavItems() {
  const pathname = usePathname()
  const projectIdMatch = pathname.match(/^\/project\/([^\/]+)/)
  const extractedId = projectIdMatch?.[1] ?? null
  const projectId = extractedId === "add" ? null : extractedId

  const projectNavHrefByKey = {
    epics: projectId ? `/project/${projectId}/epics` : undefined,
    tasks: projectId ? `/project/${projectId}/tasks?view=board` : undefined,
    members: projectId ? `/project/${projectId}/members` : undefined,
    details: projectId ? `/project/${projectId}/details` : undefined,
  } as const

  const getActiveHref = (href: string | undefined) => href?.split("?")[0]

  return (
    <>
      {NAV_ITEMS.map((item) => {
        const href =
          item.key === "projects" ? item.href : projectNavHrefByKey[item.key]
        const isDisabled = item.key !== "projects" && !projectId
        const Icon = item.icon
        const activeHref = getActiveHref(href)

        const isActive = activeHref
          ? pathname === activeHref ||
            (pathname.startsWith(`${activeHref}/`) && activeHref !== "/project")
          : false

        if (href && !isDisabled) {
          return (
            <SidebarMenuItem key={item.key}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={item.label}
                className="h-9 px-3"
              >
                <Link href={href}>
                  <Icon className="mr-1 size-4 shrink-0" />
                  <span className="text-[0.95rem]">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        }

        return (
          <SidebarMenuItem key={item.key} className="px-1.5">
            <SidebarMenuButton
              isActive={false}
              tooltip={item.label}
              disabled={isDisabled}
              className="h-9 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon className="mr-1 size-4 shrink-0" />
              <span className="text-[0.95rem]">{item.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </>
  )
}
