import { createClient } from "@/lib/supabase/client"

type InvitationErrorResult = { error: string }

type SendInvitationParams = {
	email: string
	projectId: string
}

function mapInvitationError(rawError: unknown): string {
	const defaultMessage = "An unexpected error occurred. Please try again."

	if (!rawError) {
		return defaultMessage
	}

	if (rawError instanceof TypeError) {
		return "Something went wrong. Please check your connection and try again."
	}

	const normalizedText =
		typeof rawError === "string"
			? rawError.toLowerCase()
			: [
					(rawError as { code?: unknown })?.code,
					(rawError as { message?: unknown })?.message,
					(rawError as { details?: unknown })?.details,
					(rawError as { hint?: unknown })?.hint,
				]
					.filter((value) => typeof value === "string")
					.join(" ")
					.toLowerCase()

	if (
		normalizedText.includes("403") ||
		normalizedText.includes("not allowed") ||
		normalizedText.includes("permission")
	) {
		return "You don't have permission to do this."
	}

	if (normalizedText.includes("invalid_token")) {
		return "This invitation link is invalid."
	}

	if (normalizedText.includes("expired")) {
		return "This invitation has expired. Ask the project admin to send a new one."
	}

	if (
		normalizedText.includes("already_accepted") ||
		normalizedText.includes("already been used")
	) {
		return "This invitation has already been used."
	}

	if (normalizedText.includes("user_already_member")) {
		return "This user is already a member of this project."
	}

	if (
		normalizedText.includes("network") ||
		normalizedText.includes("failed to fetch")
	) {
		return "Something went wrong. Please check your connection and try again."
	}

	return defaultMessage
}

export async function sendInvitation({
	email,
	projectId,
}: SendInvitationParams): Promise<{ success: true } | InvitationErrorResult> {
	const normalizedEmail = email.trim()
	const normalizedProjectId = projectId.trim()

	if (!normalizedEmail || !normalizedProjectId) {
		return { error: "An unexpected error occurred. Please try again." }
	}

	const supabase = createClient()

	try {
		const {
			data: { session },
			error: sessionError,
		} = await supabase.auth.getSession()

		if (sessionError) {
			console.error("Failed to get session before invite_member RPC", sessionError)
			return { error: mapInvitationError(sessionError) }
		}

		if (!session) {
			return { error: "You don't have permission to do this." }
		}

		const { error } = await supabase.rpc("invite_member", {
			p_email: normalizedEmail,
			p_project_id: normalizedProjectId,
			p_app_url: process.env.NEXT_PUBLIC_APP_URL!,
			p_base_url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
		})

		if (error) {
			console.error("invite_member RPC failed", error)
			return { error: mapInvitationError(error) }
		}

		return { success: true }
	} catch (error) {
		console.error("Unexpected sendInvitation failure", error)
		return { error: mapInvitationError(error) }
	}
}

export async function acceptInvitation(
	token: string
): Promise<{ projectId: string } | InvitationErrorResult> {
	const normalizedToken = token.trim()

	if (!normalizedToken) {
		return { error: "This invitation link is invalid." }
	}

	const supabase = createClient()

	try {
		const {
			data: { session },
			error: sessionError,
		} = await supabase.auth.getSession()

		if (sessionError) {
			console.error("Failed to get session before accept_invitation RPC", sessionError)
			return { error: mapInvitationError(sessionError) }
		}

		if (!session) {
			return { error: "You don't have permission to do this." }
		}

		const { data, error } = await supabase.rpc("accept_invitation", {
			p_token: normalizedToken,
		})

		if (error) {
			console.error("accept_invitation RPC failed", error)
			return { error: mapInvitationError(error) }
		}

		if (typeof data === "string") {
			return { projectId: data }
		}

		if (Array.isArray(data) && data.length > 0) {
			const firstRow = data[0] as { project_id?: unknown; projectId?: unknown }
			if (typeof firstRow.project_id === "string") {
				return { projectId: firstRow.project_id }
			}
			if (typeof firstRow.projectId === "string") {
				return { projectId: firstRow.projectId }
			}
		}

		if (data && typeof data === "object") {
			const mappedData = data as { project_id?: unknown; projectId?: unknown }

			if (typeof mappedData.project_id === "string") {
				return { projectId: mappedData.project_id }
			}

			if (typeof mappedData.projectId === "string") {
				return { projectId: mappedData.projectId }
			}
		}

		return { projectId: "" }
	} catch (error) {
		console.error("Unexpected acceptInvitation failure", error)
		return { error: mapInvitationError(error) }
	}
}
