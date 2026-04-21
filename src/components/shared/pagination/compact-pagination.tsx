"use client"

import { useMemo } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { buildCompactPaginationItems } from "@/lib/pagination"
import { cn } from "@/lib/utils"

type CompactPaginationProps = {
  currentPage: number
  totalPages: number
  pageParamName?: string
  className?: string
}

export default function CompactPagination({
  currentPage,
  totalPages,
  pageParamName = "page",
  className,
}: CompactPaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const paginationItems = useMemo(
    () => buildCompactPaginationItems(totalPages, currentPage),
    [totalPages, currentPage]
  )

  const createPageHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (page <= 1) {
      params.delete(pageParamName)
    } else {
      params.set(pageParamName, String(page))
    }

    const query = params.toString()
    return `${pathname}${query ? `?${query}` : ""}`
  }

  function handlePageChange(page: number) {
    if (page < 1 || page > totalPages || page === currentPage) return
    router.push(createPageHref(page))
  }

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
        className="h-8 w-8 cursor-pointer hover:bg-primary/2"
      >
        <ChevronLeft className="size-3.5" />
      </Button>

      {paginationItems.map((item, index) => {
        if (item === "ellipsis") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="px-1 text-xs text-muted-foreground"
            >
              ...
            </span>
          )
        }

        return (
          <Button
            key={`page-${item}`}
            asChild
            type="button"
            variant={item === currentPage ? "default" : "outline"}
            size="icon-sm"
            className={cn("h-8 w-8 text-xs", {
              "hover:bg-primary/2": item !== currentPage,
            })}
          >
            <Link
              href={createPageHref(item)}
              aria-current={item === currentPage ? "page" : undefined}
            >
              {item}
            </Link>
          </Button>
        )
      })}

      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
        className="h-8 w-8 cursor-pointer hover:bg-primary/2"
      >
        <ChevronRight className="size-3.5" />
      </Button>
    </div>
  )
}
