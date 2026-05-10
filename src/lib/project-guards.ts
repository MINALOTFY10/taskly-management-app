import { notFound } from "next/navigation"

export type FetchResult<T = any> = {
  data?: T | null
  error?: string | null
  notFound?: boolean
}

export function assertProjectExists<T>(
  result: FetchResult<T>
): asserts result is FetchResult<T> & { data: NonNullable<T> } {
  if (result.error) {
    throw new Error(result.error)
  }

  if (result.notFound || !result.data) {
    notFound()
  }
}

export default assertProjectExists
