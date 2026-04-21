"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

import { useAppToast } from "@/components/providers/toast-provider"
import { createTaskAction } from "@/features/tasks/actions"
import TaskForm from "@/features/tasks/components/task-form"
import type { CreateTaskFormValues } from "@/features/tasks/schemas/validations"

type AddTaskFormProps = {
  projectId: string
  projectName: string
  initialEpicId?: string
  members: Array<{
    userId: string
    name: string
    email: string
  }>
  epics: Array<{
    id: string
    epicId: string
    title: string
  }>
}

function truncateEpicTitle(title: string, maxLength: number) {
  if (title.length <= maxLength) return title
  return `${title.slice(0, maxLength - 3)}...`
}

export default function AddTaskForm({
  projectId,
  projectName,
  initialEpicId,
  members,
  epics,
}: AddTaskFormProps) {
  const router = useRouter()
  const [apiError, setApiError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const { showToast } = useAppToast()

  const assigneeOptions = members.map((member) => ({
    userId: member.userId,
    label: `${member.name} (${member.email})`,
  }))

  const epicOptions = epics.map((epic) => ({
    id: epic.id,
    label: `${epic.epicId} ${truncateEpicTitle(epic.title, 100)}`,
  }))

  const onSubmit = async (values: CreateTaskFormValues) => {
    setApiError(null)

    startTransition(async () => {
      const { error } = await createTaskAction(projectId, values)

      if (error) {
        setApiError(error)
        showToast({ variant: "error", message: error })
        return
      }

      showToast({ variant: "success", message: "Task created successfully" })
      router.replace(`/project/${projectId}/tasks`)
    })
  }

  const handleCancel = () => {
    router.replace(`/project/${projectId}/tasks`)
  }

  return (
    <TaskForm
      projectName={projectName}
      workspaceName={projectName}
      assigneeOptions={assigneeOptions}
      epicOptions={epicOptions}
      initialEpicId={initialEpicId}
      apiError={apiError}
      isPending={isPending}
      onSubmit={onSubmit}
      onCancel={handleCancel}
    />
  )
}
