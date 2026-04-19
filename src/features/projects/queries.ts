import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { ProjectRow } from "@/features/projects/types"

export type ProjectsQueryResult = {
  data: ProjectRow[]
  error: string | null
}

export async function getProjects(): Promise<ProjectsQueryResult> {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("projects")
    .select("id, name, description, created_at")
    .order("created_at", { ascending: false })
    .returns<ProjectRow[]>()

  if (error) {
    return {
      data: [],
      error: `Failed to load projects: ${error.message}`,
    }
  }

  return { data: data ?? [], error: null }
}
