"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, RotateCcw } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"

import AuthInput from "@/app/(auth)/_components/auth-input"
import AuthLayout from "@/app/(auth)/_components/auth-layout"
import AuthSubmitButton from "@/app/(auth)/_components/auth-submit-button"
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/lib/validations/auth"
import { requestPasswordRecovery } from "@/lib/services/auth-service"
import { useCooldown } from "../_components/use-cooldown"
import PasswordResetSuccessSection from "../_components/password-reset-success-section"
import { formatCountdown } from "@/lib/utils/auth/format-countdown"

const RESEND_COOLDOWN_SECONDS = 5 * 60

function resendLabel(isResending: boolean, secondsRemaining: number): string {
  if (isResending) return "Resending..."
  if (secondsRemaining > 0)
    return `Resend in ${formatCountdown(secondsRemaining)}`
  return "Resend"
}

export default function ForgotPasswordPage() {
  const [apiError, setApiError] = useState<string | null>(null)
  const [resendError, setResendError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const cooldown = useCooldown()

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })

  async function sendRecoveryLink(
    email: string
  ): Promise<{ ok: boolean; error: string | null }> {
    const { error } = await requestPasswordRecovery({
      email,
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) return { ok: false, error }

    cooldown.start(RESEND_COOLDOWN_SECONDS)
    return { ok: true, error: null }
  }

  const onSubmit = async ({ email }: ForgotPasswordFormValues) => {
    setApiError(null)
    const { ok, error } = await sendRecoveryLink(email)
    if (!ok) {
      setApiError(error)
      return
    }
    setIsSuccess(true)
  }

  const onResend = async () => {
    if (cooldown.isActive || isResending) return

    const isEmailValid = await trigger("email")
    if (!isEmailValid) return

    setResendError(null)
    setIsResending(true)

    const { ok, error } = await sendRecoveryLink(getValues("email"))
    if (!ok) setResendError(error)

    setIsResending(false)
  }

  return (
    <AuthLayout>
      <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-surface-high text-primary sm:hidden">
        <RotateCcw className="h-5 w-5" />
      </div>

      <div className="mb-12 space-y-1 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-[2.25rem]">
          Forgot password?
        </h1>
        <p className="text-[14px] text-muted-foreground">
          No worries, we&apos;ll send you reset instructions.
        </p>
      </div>

      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        aria-describedby="forgot-password-status"
      >
        <AuthInput
          id="email"
          label="Email Address"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
          error={errors.email?.message}
          containerClassName="mb-6"
        />

        <AuthSubmitButton
          isLoading={isSubmitting}
          loadingText="Sending reset link..."
        >
          Send Reset Link
        </AuthSubmitButton>

        <div className="pt-2 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to log in
          </Link>
        </div>

        <p
          id="forgot-password-status"
          role="alert"
          className={
            apiError
              ? "rounded-md border border-error/30 bg-error/10 px-3 py-2 text-sm text-error"
              : "sr-only"
          }
        >
          {apiError ?? ""}
        </p>
      </form>

      {isSuccess && (
        <PasswordResetSuccessSection
          onResend={onResend}
          disabled={cooldown.isActive || isResending}
          resendLabel={resendLabel(isResending, cooldown.secondsRemaining)}
          resendError={resendError}
        />
      )}
    </AuthLayout>
  )
}
