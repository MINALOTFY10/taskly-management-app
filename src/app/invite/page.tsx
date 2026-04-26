"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

import AppLogo from "@/components/shared/app-logo"
import { Button } from "@/components/ui/button"
import ProjectMemberAvatar from "@/features/members/components/project-member-avatar"
import { useAcceptInvitation } from "@/features/members/hooks/use-accept-invitation"
import type { InvitationDetails } from "@/features/members/types"
import { createClient } from "@/lib/supabase/client"

type InviteErrorCode =
  | "invalid_token"
  | "expired"
  | "already_accepted"
  | "permission"
  | "network"
  | "unknown"

function getInviteErrorMessage(error: string | null): string | null {
  if (!error) return null

  const normalized = error.toLowerCase()

  if (normalized.includes("invalid_token")) {
    return "This invitation link is invalid."
  }

  if (normalized.includes("expired")) {
    return "This invitation has expired. Ask the project admin to send a new one."
  }

  if (normalized.includes("already_accepted")) {
    return "This invitation has already been used."
  }

  if (
    normalized.includes("permission") ||
    normalized.includes("not allowed") ||
    normalized.includes("403")
  ) {
    return "You don't have permission to do this."
  }

  if (normalized.includes("network") || normalized.includes("failed to fetch")) {
    return "Something went wrong. Please check your connection and try again."
  }

  if (
    normalized === "this invitation link is invalid." ||
    normalized === "this invitation has expired. ask the project admin to send a new one." ||
    normalized === "this invitation has already been used." ||
    normalized === "you don't have permission to do this." ||
    normalized === "something went wrong. please check your connection and try again." ||
    normalized === "an unexpected error occurred. please try again."
  ) {
    return error
  }

  return "An unexpected error occurred. Please try again."
}

function InviteErrorCard({ message }: { message: string }) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-[#eff1fb] px-4 py-10">
      <div className="w-full max-w-205">
        <div className="mb-10 flex justify-center">
          <AppLogo className="pointer-events-none" />
        </div>

        <section className="mx-auto w-full max-w-170 rounded-xl border border-border/50 bg-card px-6 py-8 text-center shadow-[0_24px_80px_rgba(13,27,42,0.12)] sm:px-8 sm:py-10">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Invitation Unavailable
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{message}</p>
        </section>
      </div>
    </main>
  )
}

function CenteredSpinner() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-[#eff1fb]">
      <Loader2 className="size-8 animate-spin text-primary" />
    </main>
  )
}

function InvitePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const supabase = createClient()

  const [invitationDetails, setInvitationDetails] = useState<InvitationDetails | null>(
    null
  )
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [pageErrorCode, setPageErrorCode] = useState<InviteErrorCode | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const { isLoading, error, isAccepted, handleAccept } = useAcceptInvitation(token)

  useEffect(() => {
    let isMounted = true

    const loadInvitation = async () => {
      if (!token) {
        if (isMounted) {
          setPageErrorCode("invalid_token")
          setIsPageLoading(false)
        }
        return
      }

      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Failed to check session on invite page", sessionError)
          if (isMounted) {
            setPageErrorCode("network")
            setIsPageLoading(false)
          }
          return
        }

        if (!session) {
          const returnTo = `/invite?token=${encodeURIComponent(token)}`
          router.push(`/login?returnTo=${encodeURIComponent(returnTo)}`)
          return
        }

        const response = await fetch(
          `/api/invitation?token=${encodeURIComponent(token)}`,
          { cache: "no-store" }
        )

        const payload = (await response.json()) as {
          error?: string
          projectId?: string
          projectName?: string | null
          inviterId?: string | null
          inviterName?: string | null
          inviterRole?: string | null
          status?: string | null
          expiresAt?: string | null
        }

        if (!response.ok) {
          const code = payload?.error ?? "unknown"
          if (isMounted) {
            setPageErrorCode(
              code === "invalid_token"
                ? "invalid_token"
                : code === "expired"
                  ? "expired"
                  : code === "already_accepted"
                    ? "already_accepted"
                    : "unknown"
            )
            setIsPageLoading(false)
          }
          return
        }

        if (!payload.projectId) {
          if (isMounted) {
            setPageErrorCode("invalid_token")
            setIsPageLoading(false)
          }
          return
        }

        if (!isMounted) return

        setInvitationDetails({
          projectId: payload.projectId,
          projectName: payload.projectName?.trim() || "this project",
          inviterId: payload.inviterId ?? null,
          inviterName: payload.inviterName?.trim() || "Project Admin",
          inviterRole: payload.inviterRole?.trim() || "Project Admin",
          status: payload.status ?? null,
          expiresAt: payload.expiresAt ?? null,
        })
        setPageErrorCode(null)
      } catch (unexpectedError) {
        console.error("Unexpected invite page failure", unexpectedError)
        if (isMounted) {
          setPageErrorCode("unknown")
        }
      } finally {
        if (isMounted) {
          setIsPageLoading(false)
        }
      }
    }

    void loadInvitation()

    return () => {
      isMounted = false
    }
  }, [router, supabase, token])

  const pageErrorMessage = getInviteErrorMessage(pageErrorCode)
  const acceptErrorMessage = getInviteErrorMessage(error)

  if (isPageLoading) {
    return <CenteredSpinner />
  }

  if (pageErrorMessage) {
    return <InviteErrorCard message={pageErrorMessage} />
  }

  if (!invitationDetails) {
    return <InviteErrorCard message="This invitation link is invalid." />
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-[#eff1fb] px-4 py-10">
      <div className="w-full max-w-3xl">
        <div className="mb-10 flex justify-center">
          <AppLogo className="pointer-events-none" />
        </div>

        <section className="mx-auto w-full rounded-xl border border-border/50 border-t-primary border-t-4 bg-card px-6 py-8 shadow-[0_24px_80px_rgba(13,27,42,0.12)] sm:px-16 sm:py-14">
          <div className="mx-auto w-fit rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold tracking-[0.08em] text-primary uppercase">
            New Project Invitation
          </div>

          <h1 className="mx-auto mt-7 max-w-[22ch] text-center text-[2.3rem] leading-[1.05] font-semibold tracking-tight text-foreground sm:text-[2.3rem]">
            You&apos;ve been invited to join the project{" "}
            <span className="text-primary">{invitationDetails.projectName}</span>
          </h1>

          <div className="mx-auto mt-9 flex max-w-105 items-center gap-3 rounded-lg border border-border/45 bg-surface-highest px-4 py-3">
            <ProjectMemberAvatar name={invitationDetails.inviterName} />

            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.98rem] font-semibold text-foreground">
                {invitationDetails.inviterName}
              </p>
              <p className="truncate text-[0.72rem] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                {invitationDetails.inviterRole}
              </p>
            </div>

            <span className="rounded-md bg-primary/12 px-3 py-1 text-[0.7rem] font-semibold tracking-[0.05em] text-primary uppercase">
              Inviter
            </span>
          </div>

          {acceptErrorMessage ? (
            <p className="mx-auto mt-5 max-w-115 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
              {acceptErrorMessage}
            </p>
          ) : null}

          {successMessage ? (
            <p className="mx-auto mt-5 max-w-115 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-center text-sm text-emerald-700">
              {successMessage}
            </p>
          ) : null}

          <Button
            type="button"
            size="lg"
            className="mt-12 h-14 w-full text-base font-semibold shadow-[0_10px_18px_rgba(0,50,184,0.18)] cursor-pointer"
            disabled={isLoading || isAccepted}
            onClick={async () => {
              const acceptedProjectId = await handleAccept()
              if (acceptedProjectId === null) return

              setSuccessMessage("Invitation accepted. Redirecting...")
              const destination = acceptedProjectId
                ? `/project/${acceptedProjectId}/members`
                : "/project"

              router.push(destination)
              router.refresh()
            }}
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Accepting...
              </span>
            ) : (
              "Accept Invitation"
            )}
          </Button>
        </section>
      </div>
    </main>
  )
}

export default function InvitePage() {
  return (
    <Suspense fallback={<CenteredSpinner />}>
      <InvitePageContent />
    </Suspense>
  )
}
