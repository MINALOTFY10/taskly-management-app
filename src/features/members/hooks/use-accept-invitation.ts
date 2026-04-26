"use client"

import { useCallback, useState } from "react"

import { acceptInvitation } from "@/features/projects/services/invite-service"

export function useAcceptInvitation(token: string | null) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAccepted, setIsAccepted] = useState(false)

  const handleAccept = useCallback(async (): Promise<string | null> => {
    if (isLoading) return null

    if (!token) {
      setError("invalid_token")
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await acceptInvitation(token)

      if ("error" in result) {
        setError(result.error)
        return null
      }

      setIsAccepted(true)
      return result.projectId
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, token])

  return {
    isLoading,
    error,
    isAccepted,
    handleAccept,
  }
}
