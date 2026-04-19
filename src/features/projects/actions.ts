"use server"

import { revalidatePath } from "next/cache"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import {
  createProjectSchema,
  type CreateProjectFormValues,
} from "@/features/projects/schemas/validations"

type ProjectRow = {
  id: string
  name: string
  description: string | null
}

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
    .select("id, name, description")
    .single<ProjectRow>()

  if (error) {
    return { data: null, error: `Failed to create project: ${error.message}` }
  }

  revalidatePath("/projects")
  return { data, error: null }
}
