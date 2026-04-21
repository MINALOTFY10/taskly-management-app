export type PaginationItem = number | "ellipsis"

export const PAGE_SIZE = 6

export type PaginationMeta = {
  limit: number
  offset: number
  totalCount: number
  rangeStart: number
  rangeEnd: number
}

// Find pagination calculations and page parameter parsing
export function parsePageParam(pageParam?: string): number {
  const page = Number.parseInt(pageParam ?? "1", 10)
  return Number.isNaN(page) ? 1 : Math.max(1, page)
}

// Calculates the offset for a given page number and limit
export function getOffsetFromPage(page: number, limit: number): number {
  return (Math.max(1, page) - 1) * Math.max(1, limit)
}

// Calculates the page number from a given offset and limit
export function getPageFromOffset(offset: number, limit: number): number {
  const safeLimit = Math.max(1, limit)
  return Math.floor(Math.max(0, offset) / safeLimit) + 1
}

// Calculates the total number of pages based on total count and limit
export function getTotalPages(totalCount: number, limit: number): number {
  return Math.max(1, Math.ceil(Math.max(0, totalCount) / Math.max(1, limit)))
}

// Generates a compact pagination item list based on total pages and current page
export function buildCompactPaginationItems(
  totalPages: number,
  currentPage: number
): PaginationItem[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  if (currentPage <= 3) {
    return [1, 2, 3, "ellipsis", totalPages]
  }
  if (currentPage >= totalPages - 2) {
    return [1, "ellipsis", totalPages - 2, totalPages - 1, totalPages]
  }
  return [1, "ellipsis", currentPage, "ellipsis", totalPages]
}