"use server"

import { revalidatePath } from "next/cache"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import {
  createProjectSchema,
  type CreateProjectFormValues,
} from "@/features/projects/schemas/validations"
import type { ProjectRow } from "@/features/projects/types"
import {
  getProjects,
  type GetProjectsOptions,
  type ProjectsQueryResult,
} from "@/features/projects/queries"

type ActionResult = {
  data: ProjectRow | null
  error: string | null
}

export async function createProjectAction(
  values: CreateProjectFormValues
): Promise<ActionResult> {
  const validated = createProjectSchema.safeParse(values)
  if (!validated.success) {
    return { data: null, error: "Invalid form data." }
  }

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from("projects")
    .insert({
      name: validated.data.name,
      description: validated.data.description?.trim() || null,
    })
    .select("id, name, description, created_at")
    .single<ProjectRow>()

  if (error) {
    return { data: null, error: `Failed to create project: ${error.message}` }
  }

  revalidatePath("/project")
  return { data, error: null }
}

export async function getProjectsAction(
  options: GetProjectsOptions = {}
): Promise<ProjectsQueryResult> {
  return getProjects(options)
}