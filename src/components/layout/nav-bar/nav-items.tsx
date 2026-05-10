import { usePathname } from "next/navigation"
import { NAV_ITEMS } from "../main-shell.constants"
import { NavItem } from "./nav-item"

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
        const activeHref = getActiveHref(href)

        const isActive = activeHref
          ? pathname === activeHref ||
            (pathname.startsWith(`${activeHref}/`) && activeHref !== "/project")
          : false

        return (
          <NavItem
            key={item.key}
            label={item.label}
            icon={item.icon}
            href={href}
            isActive={isActive}
            isDisabled={isDisabled}
          />
        )
      })}
    </>
  )
}
