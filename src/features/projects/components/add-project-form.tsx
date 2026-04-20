"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { useAppToast } from "@/components/providers/toast-provider"
import type { CreateProjectFormValues } from "@/features/projects/schemas/validations"
import { createProjectAction } from "@/features/projects/actions"
import ProjectForm from "@/features/projects/components/project-form"

export default function AddProjectForm() {
  const router = useRouter()
  const [apiError, setApiError] = useState<string | null>(null)
  const { showToast } = useAppToast()

  const onSubmit = async (values: CreateProjectFormValues) => {
    setApiError(null)

    const { error } = await createProjectAction(values)

    if (error) {
      setApiError(error)
      showToast({ variant: "error", message: error })
      return
    }

    showToast({ variant: "success", message: "Project created successfully" })

    router.push("/project")
  }

  const handleCancel = () => {
    router.replace("/project")
  }

  return (
    <ProjectForm
      content={{
        breadcrumb: "Projects > Add New Project",
        pageTitle: "Add New Project",
        cardTitle: "Initialize New Project",
        cardDescription:
          "Define the scope and foundational details of your project.",
        submitLabel: "Create Project",
        submittingLabel: "Creating...",
        tipText:
          "You can invite project members and assign epics immediately after the initial creation process.",
      }}
      apiError={apiError}
      showInviteMemberCta
      onSubmit={onSubmit}
      onCancel={handleCancel}
    />
  )
}
