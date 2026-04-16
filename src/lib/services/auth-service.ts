import { createClient } from "@/lib/supabase/client"

export async function signUpUser(values: {
  email: string
  password: string
  name: string
  jobTitle?: string | null
}) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback?next=/main`,
      data: {
        name: values.name,
        job_title: values.jobTitle || null,
      },
    },
  })

  return { data, error }
}

export async function loginUser(values: { email: string; password: string }) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  })

  return { data, error }
}

/**
 * Sends a password-recovery email via the Supabase SDK.
 * Always returns a generic message — never reveals whether the address exists.
 */
export async function requestPasswordRecovery(values: {
  email: string
  redirectTo?: string
}) {
  const supabase = createClient()

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: values.redirectTo,
    })

    if (error) {
      return { error: "Unable to send reset link right now. Please try again." }
    }

    return { error: null }
  } catch {
    return { error: "Network error. Please check your connection and try again." }
  }
}

/**
 * Activates the recovery session from the URL hash tokens, then updates the
 * password, then signs out so the user must log in fresh.
 */
export async function resetPasswordWithAccessToken(values: {
  accessToken: string
  refreshToken: string
  password: string
}) {
  const supabase = createClient()

  try {
    // 1. Establish a real session from both tokens present in the recovery URL.
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: values.accessToken,
      refresh_token: values.refreshToken,
    })

    if (sessionError) {
      return { error: "Invalid or expired reset link. Please request a new one." }
    }

    // 2. Update the password while the session is active.
    const { error: updateError } = await supabase.auth.updateUser({
      password: values.password,
    })

    if (updateError) {
      return { error: updateError.message ?? "Failed to update password. Please try again." }
    }

    // 3. Sign out immediately — user must log in with their new password.
    await supabase.auth.signOut()

    return { error: null }
  } catch {
    return { error: "Network error. Please check your connection and try again." }
  }
}