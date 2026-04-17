import { type EmailOtpType } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

// Supabase redirects here after the user clicks the confirmation link in their
export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl
  const code = searchParams.get("code")
  const tokenHash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null
  const next = searchParams.get("next") ?? "/"
  const errorDescription = searchParams.get("error_description")

  if (errorDescription) {
    return NextResponse.redirect(
      new URL(
        `/signup?error_description=${encodeURIComponent(errorDescription)}`,
        origin
      )
    )
  }

  if (!code && !tokenHash) {
    return NextResponse.redirect(new URL("/signup", origin))
  }

  const safeNext = next.startsWith("/") ? next : "/"
  const normalizedNext = safeNext === "/main" ? "/" : safeNext

  const supabase = await createSupabaseServerClient()
  let authError: string | null = null

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    authError = error?.message ?? null
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    authError = error?.message ?? null
  } else {
    authError = "Invalid authentication callback."
  }

  if (authError) {
    return NextResponse.redirect(
      new URL(
        `/signup?error_description=${encodeURIComponent(authError)}`,
        origin
      )
    )
  }

  return NextResponse.redirect(new URL(normalizedNext, origin))
}