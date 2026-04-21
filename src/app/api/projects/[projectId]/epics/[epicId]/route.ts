import { getEpicById } from "@/features/epics/queries"

export async function GET(
  _req: Request,
  context: { params: Promise<{ projectId: string; epicId: string }> }
) {
  const { projectId, epicId } = await context.params
  const result = await getEpicById(projectId, epicId)
  return Response.json(result)
}
