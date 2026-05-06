"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export type BreadcrumbNavItem = {
  label: ReactNode
  href?: string
  current?: boolean
  className?: string
}

export type BreadcrumbNavProps = {
  items: BreadcrumbNavItem[]
  ariaLabel?: string
  className?: string
  listClassName?: string
  itemClassName?: string
  linkClassName?: string
  currentClassName?: string
  separator?: ReactNode
  separatorClassName?: string
}

const defaultLinkClassName =
  "truncate text-[0.60rem] font-semibold tracking-[0.24em] text-muted-foreground uppercase transition-colors hover:text-foreground"
const defaultCurrentClassName =
  "truncate text-[0.60rem] font-semibold tracking-[0.24em] text-primary uppercase"

export function BreadcrumbNav({
  items,
  ariaLabel = "Breadcrumb",
  className,
  listClassName,
  itemClassName,
  linkClassName,
  currentClassName,
  separator,
  separatorClassName,
}: BreadcrumbNavProps) {
  if (items.length === 0) {
    return null
  }

  const separatorNode = separator ?? (
    <ChevronRight aria-hidden="true" size={14} />
  )

  return (
    <nav aria-label={ariaLabel} className={className}>
      <ol className={cn("flex flex-wrap items-center gap-1", listClassName)}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const isCurrent = item.current ?? isLast

          return (
            <li
              key={index}
              className={cn("flex min-w-0 items-center gap-1", itemClassName)}
            >
              {index > 0 ? (
                <span
                  className={cn(
                    "flex shrink-0 items-center text-muted-foreground",
                    separatorClassName
                  )}
                  aria-hidden="true"
                >
                  {separatorNode}
                </span>
              ) : null}

              {item.href && !isCurrent ? (
                <Link
                  href={item.href}
                  className={cn(
                    "min-w-0",
                    defaultLinkClassName,
                    linkClassName,
                    item.className
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isCurrent ? "page" : undefined}
                  className="min-w-0 cursor-default p-0"
                  style={{ marginBottom: "4.7px" }}
                >
                  <span
                    className={cn(
                      isCurrent
                        ? defaultCurrentClassName
                        : defaultLinkClassName,
                      isCurrent ? currentClassName : linkClassName,
                      item.className
                    )}
                  >
                    {item.label}
                  </span>
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
