"use client"

import { useCallback, useState } from "react"

import { sendInvitation } from "@/features/projects/services/invite-service"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function useInviteMember(projectId: string) {
	const [email, setEmail] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [successEmail, setSuccessEmail] = useState<string | null>(null)

	const handleSubmit = useCallback(async () => {
		if (isLoading) return

		const normalizedEmail = email.trim()

		if (!normalizedEmail) {
			setError("Please enter an email address.")
			setSuccessEmail(null)
			return
		}

		if (!EMAIL_PATTERN.test(normalizedEmail)) {
			setError("Please enter a valid email address.")
			setSuccessEmail(null)
			return
		}

		setIsLoading(true)

		try {
			const result = await sendInvitation({
				email: normalizedEmail,
				projectId,
			})

			if ("error" in result) {
				setError(result.error)
				setSuccessEmail(null)
				return
			}

			setError(null)
			setSuccessEmail(normalizedEmail)
			setEmail("")
		} finally {
			setIsLoading(false)
		}
	}, [email, isLoading, projectId])

	const reset = useCallback(() => {
		setEmail("")
		setError(null)
		setSuccessEmail(null)
	}, [])

	return {
		email,
		setEmail,
		isLoading,
		error,
		successEmail,
		handleSubmit,
		reset,
	}
}
