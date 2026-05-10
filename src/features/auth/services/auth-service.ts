import { createClient } from "@/lib/supabase/client"
import { createClient as createSupabaseJsClient } from "@supabase/supabase-js"

const AUTH_STORAGE_KEY_PATTERN = /access_token|refresh_token|auth-token/i

function clearMatchingStorageKeys(storage: Storage) {
  const keys: string[] = []

  for (let i = 0; i < storage.length; i += 1) {
    const key = storage.key(i)
    if (key) keys.push(key)
  }

  keys
    .filter((key) => AUTH_STORAGE_KEY_PATTERN.test(key))
    .forEach((key) => storage.removeItem(key))
}

function clearAuthCookiesInBrowser() {
  if (typeof document === "undefined") return

  const existingCookieNames = document.cookie
    .split(";")
    .map((cookie) => cookie.split("=")[0]?.trim())
    .filter((name): name is string => Boolean(name))

  const cookieNamesToClear = new Set([
    "access_token",
    "refresh_token",
    ...existingCookieNames.filter((name) =>
      AUTH_STORAGE_KEY_PATTERN.test(name)
    ),
  ])

  cookieNamesToClear.forEach((name) => {
    document.cookie = `${name}=; Max-Age=0; path=/`
  })
}

// Supabase's own signOut() already removes its `sb-*` keys, so this is purely defensive.
export function clearClientAuthData() {
  if (typeof window === "undefined") return

  clearMatchingStorageKeys(localStorage)
  clearMatchingStorageKeys(sessionStorage)
  clearAuthCookiesInBrowser()
}

export async function logoutUser() {
  const supabase = createClient()

  try {
    const { error } = await supabase.auth.signOut({ scope: "local" })

    if (error) {
      return { error: "Logout failed, please try again." }
    }

    clearClientAuthData()

    return { error: null }
  } catch {
    return { error: "Logout failed, please try again." }
  }
}

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
      emailRedirectTo: `${window.location.origin}/auth/callback?next=/`,
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

export async function guestLoginUser() {
  try {
    const res = await fetch("/api/auth/guest", { method: "POST" })
    const json = await res.json()

    return { data: json.data ?? null, error: json.error ?? null }
  } catch {
    return { data: null, error: "Network error. Please try again." }
  }
}

/**
 * Sends a password-recovery email via the Supabase SDK.
 * Always returns a generic message — never reveals whether the address exists.
 */
export async function requestPasswordRecovery(values: {
  email: string
  redirectTo?: string
}) {
  // Create recovery links in implicit flow so they do not depend on PKCE verifier storage.
  const supabase = createSupabaseJsClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: {
        flowType: "implicit",
      },
    }
  )

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: values.redirectTo,
    })

    if (error) {
      return { error: "Unable to send reset link right now. Please try again." }
    }

    return { error: null }
  } catch {
    return {
      error: "Network error. Please check your connection and try again.",
    }
  }
}

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
      return {
        error: "Invalid or expired reset link. Please request a new one.",
      }
    }

    // 2. Update the password while the session is active.
    const { error: updateError } = await supabase.auth.updateUser({
      password: values.password,
    })

    if (updateError) {
      return {
        error:
          updateError.message ?? "Failed to update password. Please try again.",
      }
    }

    // 3. Sign out immediately — user must log in with their new password.
    await supabase.auth.signOut()

    return { error: null }
  } catch {
    return {
      error: "Network error. Please check your connection and try again.",
    }
  }
}

export async function updateUserProfile(values: {
  name?: string
  jobTitle?: string | null
  password?: string
}) {
  const supabase = createClient()

  try {
    const payload: {
      data?: {
        name?: string
        full_name?: string
        job_title?: string | null
      }
      password?: string
    } = {}

    if (values.name !== undefined || values.jobTitle !== undefined) {
      payload.data = {}

      if (values.name !== undefined) {
        payload.data.name = values.name
        payload.data.full_name = values.name
      }

      if (values.jobTitle !== undefined) {
        payload.data.job_title = values.jobTitle
      }
    }

    if (values.password) payload.password = values.password

    const { data, error } = await supabase.auth.updateUser(payload)

    if (error) return { error: error.message ?? "Failed to update profile" }

    return { error: null, user: data.user }
  } catch {
    return { error: "Network error. Please try again." }
  }
}

