"use client"

import Link from "next/link"
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItemProps {
  label: string
  icon: LucideIcon
  href?: string
  isActive?: boolean
  isDisabled?: boolean
  onClick?: () => void
  menuItemClassName?: string
  buttonClassName?: string
  iconClassName?: string
}

export function NavItem({
  label,
  icon: Icon,
  href,
  isActive = false,
  isDisabled = false,
  onClick,
  menuItemClassName,
  buttonClassName,
  iconClassName = "mr-1 size-4 shrink-0",
}: NavItemProps) {
  const resolvedMenuItemClassName = menuItemClassName ?? "ms-2 "

  const resolvedButtonClassName = buttonClassName

  const content = (
    <>
      <Icon className={iconClassName} />
      <span className="text-[0.95rem]">{label}</span>
    </>
  )

  if (href && !isDisabled) {
    return (
      <SidebarMenuItem className={resolvedMenuItemClassName}>
        <SidebarMenuButton
          asChild
          isActive={isActive}
          tooltip={label}
          className={cn(resolvedButtonClassName, "h-8 px-3")}
        >
          <Link href={href}>{content}</Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarMenuItem className={resolvedMenuItemClassName}>
      <SidebarMenuButton
        isActive={isActive}
        tooltip={label}
        disabled={isDisabled}
        onClick={onClick}
        className={resolvedButtonClassName}
      >
        {content}
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
