import { getProjects } from "@/features/projects/queries"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const limit = Number(searchParams.get("limit") ?? 10)
  const offset = Number(searchParams.get("offset") ?? 0)

  const result = await getProjects({ limit, offset })
  return Response.json(result)
}