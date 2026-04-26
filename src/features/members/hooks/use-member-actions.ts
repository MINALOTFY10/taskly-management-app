"use client"

import { useCallback, useRef, useState } from "react"

import {
  changeRole,
  leaveProject,
  removeMember,
  transferOwnership,
} from "@/features/members/services/member-service"
import type { ProjectMemberRole } from "@/features/members/types"

export function useMemberActions(projectId: string) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isLoadingRef = useRef(false)

  const handleRemoveMember = useCallback(
    async (userId: string): Promise<boolean> => {
      if (isLoadingRef.current) return false

      setError(null)
      isLoadingRef.current = true
      setIsLoading(true)

      try {
        const result = await removeMember(projectId, userId)

        if ("error" in result) {
          setError(result.error)
          return false
        }

        setError(null)
        return true
      } finally {
        isLoadingRef.current = false
        setIsLoading(false)
      }
    },
    [projectId]
  )

  const handleChangeRole = useCallback(
    async (
      userId: string,
      newRole: Exclude<ProjectMemberRole, "owner">
    ): Promise<boolean> => {
      if (isLoadingRef.current) return false

      setError(null)
      isLoadingRef.current = true
      setIsLoading(true)

      try {
        const result = await changeRole(projectId, userId, newRole)

        if ("error" in result) {
          setError(result.error)
          return false
        }

        setError(null)
        return true
      } finally {
        isLoadingRef.current = false
        setIsLoading(false)
      }
    },
    [projectId]
  )

  const handleTransferOwnership = useCallback(
    async (userId: string): Promise<boolean> => {
      if (isLoadingRef.current) return false

      setError(null)
      isLoadingRef.current = true
      setIsLoading(true)

      try {
        const result = await transferOwnership(projectId, userId)

        if ("error" in result) {
          setError(result.error)
          return false
        }

        setError(null)
        return true
      } finally {
        isLoadingRef.current = false
        setIsLoading(false)
      }
    },
    [projectId]
  )

  const handleLeaveProject = useCallback(async (): Promise<boolean> => {
    if (isLoadingRef.current) return false

    setError(null)
    isLoadingRef.current = true
    setIsLoading(true)

    try {
      const result = await leaveProject(projectId)

      if ("error" in result) {
        setError(result.error)
        return false
      }

      setError(null)
      return true
    } finally {
      isLoadingRef.current = false
      setIsLoading(false)
    }
  }, [projectId])

  return {
    handleRemoveMember,
    handleChangeRole,
    handleTransferOwnership,
    handleLeaveProject,
    isLoading,
    error,
  }
}
