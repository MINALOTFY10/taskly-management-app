import { useCallback, useEffect, useRef, useState } from "react"

import {
  getOffsetFromPage,
  getPageFromOffset,
  getTotalPages,
  type PaginationMeta,
} from "@/lib/pagination"

type UseMobilePaginationFetchParams<TItem> = {
  initialItems: TItem[]
  initialPagination: PaginationMeta
  isMobile: boolean | undefined
  isInfiniteEnabled?: boolean
  buildRequestUrl: (params: {
    nextPage: number
    limit: number
    offset: number
  }) => string
  getItemId: (item: TItem) => string
  loadMoreErrorMessage: string
}

type PaginatedFetchResponse<TItem> = {
  data: TItem[]
  error: string | null
  pagination: PaginationMeta
}

function getTotalFromContentRange(contentRange: string | null): number | null {
  if (!contentRange) return null

  const [, totalPart] = contentRange.split("/")
  if (!totalPart) return null

  const parsed = Number.parseInt(totalPart, 10)
  return Number.isNaN(parsed) ? null : Math.max(0, parsed)
}

export function useMobilePaginationFetch<TItem>({
  initialItems,
  initialPagination,
  isMobile,
  isInfiniteEnabled,
  buildRequestUrl,
  getItemId,
  loadMoreErrorMessage,
}: UseMobilePaginationFetchParams<TItem>) {
  const limit = initialPagination.limit

  const [items, setItems] = useState<TItem[]>(initialItems)
  const [currentPage, setCurrentPage] = useState(
    getPageFromOffset(initialPagination.offset, limit)
  )
  const [totalCount, setTotalCount] = useState(initialPagination.totalCount)
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const totalPages = getTotalPages(totalCount, limit)
  const hasMore = items.length < totalCount
  const canLoadMore = isInfiniteEnabled ?? isMobile === true

  const isLoadingMoreRef = useRef(false)

  useEffect(() => {
    setItems(initialItems)
    setCurrentPage(getPageFromOffset(initialPagination.offset, limit))
    setTotalCount(initialPagination.totalCount)
    setLoadMoreError(null)
    isLoadingMoreRef.current = false
    setIsLoadingMore(false)
  }, [initialItems, initialPagination.offset, initialPagination.totalCount, limit])

  const fetchNextPageOnMobile = useCallback(async () => {
    if (!canLoadMore || isLoadingMoreRef.current || !hasMore) return

    isLoadingMoreRef.current = true
    setIsLoadingMore(true)
    setLoadMoreError(null)

    const nextPage = currentPage + 1
    const offset = getOffsetFromPage(nextPage, limit)

    try {
      const res = await fetch(
        buildRequestUrl({
          nextPage,
          limit,
          offset,
        })
      )

      if (!res.ok) {
        setLoadMoreError(loadMoreErrorMessage)
        return
      }

      const payload = (await res.json()) as PaginatedFetchResponse<TItem>

      if (payload.error) {
        setLoadMoreError(payload.error)
        return
      }

      const totalFromHeader = getTotalFromContentRange(
        res.headers.get("Content-Range")
      )

      setCurrentPage(nextPage)
      setTotalCount(totalFromHeader ?? payload.pagination.totalCount)

      setItems((prev) => {
        const existingIds = new Set(prev.map((item) => getItemId(item)))
        const newRows = payload.data.filter(
          (item) => !existingIds.has(getItemId(item))
        )

        return newRows.length ? [...prev, ...newRows] : prev
      })
    } finally {
      isLoadingMoreRef.current = false
      setIsLoadingMore(false)
    }
  }, [
    canLoadMore,
    hasMore,
    buildRequestUrl,
    currentPage,
    getItemId,
    limit,
    loadMoreErrorMessage,
  ])

  return {
    items,
    currentPage,
    totalCount,
    totalPages,
    hasMore,
    isLoadingMore,
    loadMoreError,
    fetchNextPageOnMobile,
  }
}
