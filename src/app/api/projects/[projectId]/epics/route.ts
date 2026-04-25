import { getEpics } from "@/features/epics/queries"
import { PAGE_SIZE } from "@/lib/pagination"

export async function GET(
  req: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await context.params
  const { searchParams } = new URL(req.url)

  const rawLimit = Number(searchParams.get("limit"))
  const rawOffset = Number(searchParams.get("offset"))

  const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.floor(rawLimit) : PAGE_SIZE
  const offset =
    Number.isFinite(rawOffset) && rawOffset >= 0 ? Math.floor(rawOffset) : 0
  const search = searchParams.get("q") ?? ""

  const result = await getEpics(projectId, { limit, offset, search })

  return Response.json(result, {
    headers: {
      "Content-Range": `${result.pagination.rangeStart}-${result.pagination.rangeEnd}/${result.pagination.totalCount}`,
    },
  })
}
