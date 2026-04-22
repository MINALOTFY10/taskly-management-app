"use client"

import { useEffect, useState } from "react"
import { getTasksByEpicId, type TaskWithAssignee } from "@/features/tasks/queries"

export type UseFetchEpicTasksState = {
  tasks: TaskWithAssignee[]
  loading: boolean
  error: string | null
}

export function useFetchEpicTasks(
  epicId: string | null | undefined,
  projectId: string
): UseFetchEpicTasksState {
  const [tasks, setTasks] = useState<TaskWithAssignee[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!epicId || !projectId) {
      setTasks([])
      setError(null)
      return
    }

    let cancelled = false

    const fetchTasks = async () => {
      setLoading(true)
      setError(null)

      try {
        const result = await getTasksByEpicId(projectId, epicId)

        if (cancelled) return

        if (result.error) {
          setError(result.error)
          setTasks([])
        } else {
          setTasks(result.data)
          setError(null)
        }
      } catch {
        if (cancelled) return
        setError("An unexpected error occurred while fetching tasks")
        setTasks([])
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchTasks()

    return () => {
      cancelled = true
    }
  }, [epicId, projectId])

  return { tasks, loading, error }
}