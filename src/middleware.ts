import { createServerClient } from "@supabase/ssr"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const { pathname } = req.nextUrl
  const isInvitePath = pathname === "/invite"
  const publicPaths = new Set([
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
  ])

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // getUser() validates the JWT with Supabase's auth server on every call.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthenticated = user !== null

  // Propagate any refreshed session cookies onto redirects so they are not lost.
  const redirectWithCookies = (path: string) => {
    const redirectRes = NextResponse.redirect(new URL(path, req.url))
    res.cookies.getAll().forEach(({ name, value, ...options }) => {
      redirectRes.cookies.set(name, value, options)
    })
    return redirectRes
  }

  if (!isAuthenticated && !publicPaths.has(pathname) && !isInvitePath) {
    return redirectWithCookies("/signup")
  }

  const emailLinkError = "Email link is invalid or has expired"
  if (
    req.nextUrl.searchParams.get("error_description") === emailLinkError &&
    pathname !== "/signup"
  ) {
    return redirectWithCookies(
      `/signup?error_description=${encodeURIComponent(emailLinkError)}`
    )
  }

  if (publicPaths.has(pathname) && isAuthenticated && !isInvitePath) {
    return redirectWithCookies("/project")
  }

  return res
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|auth/callback).*)"],
}
