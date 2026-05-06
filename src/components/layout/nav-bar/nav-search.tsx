"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Loader2, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

function SearchInput({
  value,
  onChange,
  onClear,
  isSearching,
  autoFocus = false,
  className,
}: {
  value: string
  onChange: (value: string) => void
  onClear: () => void
  isSearching: boolean
  autoFocus?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative flex w-full items-center gap-2 rounded-full bg-muted/60 px-4 py-1.5 ring-1 ring-border/30 transition-colors ring-inset focus-within:ring-primary/30 hover:bg-muted/80",
        className
      )}
    >
      {isSearching ? (
        <Loader2 className="size-3.5 shrink-0 animate-spin text-muted-foreground" />
      ) : (
        <Search className="size-3.5 shrink-0 text-muted-foreground" />
      )}
      <Input
        type="search"
        autoFocus={autoFocus}
        aria-label="Search current workspace"
        placeholder="Search tasks, epics, and projects..."
        className={cn(
          "h-auto border-0 bg-transparent px-1.5 text-xs shadow-none placeholder:text-muted-foreground focus-visible:ring-0",
          value && "pr-8"
        )}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-busy={isSearching}
      />
      {value ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="size-8 rounded-full text-muted-foreground hover:bg-muted lg:hidden"
              size="icon-xs"
              onClick={onClear}
              aria-label="Clear search"
            >
              <X className="size-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Clear search</TooltipContent>
        </Tooltip>
      ) : null}
    </div>
  )
}

export function NavSearch() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const initialSearchTerm = searchParams.get("q") ?? ""
  const [searchTerm, setSearchTerm] = React.useState(initialSearchTerm)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = React.useState(false)
  const [isSearching, startSearchTransition] = React.useTransition()

  React.useEffect(() => {
    setSearchTerm(initialSearchTerm)
  }, [initialSearchTerm])

  React.useEffect(() => {
    const normalized = searchTerm.trim()
    const normalizedInitial = initialSearchTerm.trim()

    if (normalized === normalizedInitial) return

    const timeoutId = window.setTimeout(() => {
      startSearchTransition(() => {
        const params = new URLSearchParams(searchParams.toString())

        if (normalized) {
          params.set("q", normalized)
        } else {
          params.delete("q")
        }

        params.delete("page")

        const query = params.toString()
        router.replace(query ? `${pathname}?${query}` : pathname)
      })
    }, 350)

    return () => window.clearTimeout(timeoutId)
  }, [initialSearchTerm, pathname, router, searchParams, searchTerm])

  const handleClear = () => {
    setSearchTerm("")
    setIsMobileSearchOpen(false)
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden min-w-0 flex-1 lg:flex">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={handleClear}
          isSearching={isSearching}
          className="w-full"
        />
      </div>

      {/* Mobile trigger + dialog */}
      <Dialog open={isMobileSearchOpen} onOpenChange={setIsMobileSearchOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="lg:hidden"
              aria-label="Search"
              onClick={() => setIsMobileSearchOpen(true)}
            >
              <Search className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Search</TooltipContent>
        </Tooltip>

        <DialogContent className="gap-4 p-5 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Search workspace</DialogTitle>
            <DialogDescription>
              Search tasks, epics, and projects from the current page.
            </DialogDescription>
          </DialogHeader>
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={handleClear}
            isSearching={isSearching}
            autoFocus
            className="px-2.5"
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
