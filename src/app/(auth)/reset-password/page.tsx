"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import AuthLayout from "@/features/auth/components/auth-layout"
import AuthInput from "@/features/auth/components/auth-input"
import AuthSubmitButton from "@/features/auth/components/auth-submit-button"
import PasswordRulesChecker from "@/features/auth/components/password-rules-checker"
import { usePasswordRules } from "@/features/auth/hooks/usePasswordRules"
import { resetPasswordWithAccessToken } from "@/features/auth/services/auth-service"
import {
  resetPasswordSchema,
  type ResetPasswordFormValues } from "@/features/auth/schemas/validations"

const SUCCESS_MESSAGE =
  "Your password has been updated successfully. You can now log in."

export default function ResetPasswordPage() {
  const router = useRouter()

  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [isLinkChecked, setIsLinkChecked] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [isUpdated, setIsUpdated] = useState(false)

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onChange",
  })

  const rules = usePasswordRules(control, "password")

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const hashParams = new URLSearchParams(
        window.location.hash.replace("#", "")
      )
      const token = hashParams.get("access_token")
      const refresh = hashParams.get("refresh_token")
      const type = hashParams.get("type")

      if (token && refresh && type === "recovery") {
        setAccessToken(token)
        setRefreshToken(refresh)
        window.history.replaceState(
          null,
          document.title,
          window.location.pathname
        )
      } else {
        setAccessToken(null)
        setRefreshToken(null)
      }

      setIsLinkChecked(true)
    }, 0)

    return () => window.clearTimeout(timeout)
  }, [])

  const onSubmit = async ({ password }: ResetPasswordFormValues) => {
    if (!accessToken || !refreshToken) {
      setApiError("Invalid or expired reset link.")
      return
    }

    setApiError(null)

    const { error } = await resetPasswordWithAccessToken({
      accessToken,
      refreshToken,
      password,
    })

    if (error) {
      setApiError(error)
      return
    }

    setIsUpdated(true)
    window.setTimeout(() => router.push("/login"), 3000)
  }

  if (!isLinkChecked) {
    return (
      <AuthLayout
        title="Create a New Password"
        subtitle="Checking your reset link..."
      >
        <p className="text-center text-sm text-muted-foreground">Loading...</p>
      </AuthLayout>
    )
  }

  if (!accessToken || !refreshToken) {
    return (
      <AuthLayout
        title="Reset Password"
        subtitle="Invalid or expired reset link."
      >
        <div className="space-y-5 text-center">
          <p className="rounded-md border border-error/30 bg-error/10 px-4 py-3 text-sm font-bold text-error">
            Invalid or expired reset link.
          </p>
          <Link
            href="/forgot-password"
            className="inline-flex items-center justify-center text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            Request a new reset link
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Create a New Password"
      subtitle="Create a new, strong password to secure your workstation access."
    >
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        aria-describedby="reset-password-status"
      >
        <AuthInput
          id="password"
          label="New Password"
          type="password"
          showPasswordToggle
          autoComplete="new-password"
          placeholder="Enter new password"
          aria-invalid={Boolean(errors.password)}
          {...register("password")}
          error={errors.password?.message}
        />

        <AuthInput
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          showPasswordToggle
          autoComplete="new-password"
          placeholder="Confirm new password"
          aria-invalid={Boolean(errors.confirmPassword)}
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        <PasswordRulesChecker
          rules={rules}
          title="Security Requirements"
        />

        <p
          id="reset-password-status"
          role="alert"
          className={
            apiError
              ? "rounded-md border border-error/30 bg-error/10 px-3 py-2 text-sm text-error"
              : "sr-only"
          }
        >
          {apiError ?? ""}
        </p>

        {isUpdated && (
          <p className="rounded-md border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
            {SUCCESS_MESSAGE}
          </p>
        )}

        <AuthSubmitButton
          isLoading={isSubmitting}
          loadingText="Updating password..."
          disabled={isUpdated}
        >
          Update Password
        </AuthSubmitButton>

        <div className="pt-2 text-center">
          <Link
            href="/login"
            className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            Back to Log In
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}
