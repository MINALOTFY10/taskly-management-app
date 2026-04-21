"use client"

import { useRouter } from "next/navigation"
import { useTransition, useState } from "react"

import { useAppToast } from "@/components/providers/toast-provider"
import { createEpicAction } from "@/features/epics/actions"
import EpicForm from "@/features/epics/components/form/epic-form"
import type { CreateEpicFormValues } from "@/features/epics/schemas/validations"

type AddEpicFormProps = {
  projectId: string
  projectName: string
  members: Array<{
    userId: string
    name: string
    email: string
  }>
}

export default function AddEpicForm({
  projectId,
  projectName,
  members,
}: AddEpicFormProps) {
  const router = useRouter()
  const [apiError, setApiError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const { showToast } = useAppToast()

  const assigneeOptions = members.map((member) => ({
    userId: member.userId,
    label: `${member.name} (${member.email})`,
  }))

  const onSubmit = async (values: CreateEpicFormValues) => {
    setApiError(null)

    startTransition(async () => {
      const { error } = await createEpicAction(projectId, values)

      if (error) {
        setApiError(error)
        showToast({ variant: "error", message: error })
        return
      }

      showToast({ variant: "success", message: "Epic created successfully" })
      router.replace(`/project/${projectId}/epics`)
    })
  }

  const handleCancel = () => {
    router.replace(`/project/${projectId}/epics`)
  }

  return (
    <EpicForm
      projectName={projectName}
      assigneeOptions={assigneeOptions}
      apiError={apiError}
      isPending={isPending}
      onSubmit={onSubmit}
      onCancel={handleCancel}
    />
  )
}
