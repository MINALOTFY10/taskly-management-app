"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { useAppToast } from "@/components/providers/toast-provider"
import { updateProjectAction } from "@/features/projects/actions"
import ProjectForm from "@/features/projects/components/project-form"
import type { CreateProjectFormValues } from "@/features/projects/schemas/validations"
import type { ProjectRow } from "@/features/projects/types"

type EditProjectFormProps = {
  project: Pick<ProjectRow, "id" | "name" | "description">
}

export default function EditProjectForm({ project }: EditProjectFormProps) {
  const router = useRouter()
  const [apiError, setApiError] = useState<string | null>(null)
  const { showToast } = useAppToast()

  const onSubmit = async (values: CreateProjectFormValues) => {
    setApiError(null)

    const { error } = await updateProjectAction(project.id, values)

    if (error) {
      setApiError(error)
      showToast({ variant: "error", message: error })
      return
    }

    showToast({ variant: "success", message: "Project updated successfully" })
    router.replace("/project")
  }

  const handleCancel = () => {
    router.replace("/project")
  }

  return (
    <ProjectForm
      content={{
        breadcrumbItems: [
          { label: "Projects", href: "/project" },
          { label: "Edit Project", current: true },
        ],
        pageTitle: "Edit Project",
        cardTitle: "Update Project Details",
        cardDescription:
          "Refine your project title and summary to keep collaborators aligned.",
        submitLabel: "Save Changes",
        submittingLabel: "Saving...",
        tipText:
          "Clear and concise project details make searching, prioritization, and onboarding easier for the team.",
      }}
      apiError={apiError}
      initialValues={{
        name: project.name,
        description: project.description ?? "",
      }}
      onSubmit={onSubmit}
      onCancel={handleCancel}
    />
  )
}