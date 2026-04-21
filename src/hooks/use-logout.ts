import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { logoutUser } from "@/features/auth/services/auth-service"

interface UseLogoutReturn {
  handleLogout: () => Promise<void>
  isLoggingOut: boolean
  logoutError: string | null
}

export function useLogout(): UseLogoutReturn {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState<string | null>(null)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    setLogoutError(null)

    const { error } = await logoutUser()

    if (error) {
      setLogoutError(error)
      setIsLoggingOut(false)
      return
    }

    router.replace("/login")
  }

  return { handleLogout, isLoggingOut, logoutError }
}
