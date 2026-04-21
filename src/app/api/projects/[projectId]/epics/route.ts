import { getEpics } from "@/features/epics/queries"

export async function GET(
  req: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await context.params
  const { searchParams } = new URL(req.url)
  const limit = Number(searchParams.get("limit") ?? 10)
  const offset = Number(searchParams.get("offset") ?? 0)

  const result = await getEpics(projectId, { limit, offset })
  return Response.json(result)
}
