"use server"

import { revalidatePath } from "next/cache"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { createProjectSchema, type CreateProjectFormValues } from "@/features/projects/schemas/validations"
import type { ProjectRow } from "@/features/projects/types"

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

  revalidatePath("/project", "layout")
  return { data, error: null }
}

export async function updateProjectAction(
  projectId: string,
  values: CreateProjectFormValues
): Promise<ActionResult> {
  const normalizedProjectId = projectId.trim()
  if (!normalizedProjectId) {
    return { data: null, error: "Invalid project id." }
  }

  const validated = createProjectSchema.safeParse(values)
  if (!validated.success) {
    return { data: null, error: "Invalid form data." }
  }

  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("projects")
    .update({
      name: validated.data.name,
      description: validated.data.description?.trim() || null,
    })
    .eq("id", normalizedProjectId)
    .select("id, name, description, created_at")
    .maybeSingle<ProjectRow>()

  if (error) {
    return { data: null, error: `Failed to update project: ${error.message}` }
  }

  if (!data) {
    return {
      data: null,
      error: "Project not found or you do not have permission to edit it.",
    }
  }

  revalidatePath("/project", "layout")

  return { data, error: null }
}
