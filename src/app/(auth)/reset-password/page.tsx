"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2, Circle, Eye, EyeOff } from "lucide-react"
import { useForm, useWatch } from "react-hook-form"

import AuthLayout from "@/app/(auth)/_components/auth-layout"
import AuthSubmitButton from "@/app/(auth)/_components/auth-submit-button"
import { resetPasswordWithAccessToken } from "@/lib/services/auth-service"
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/lib/validations/auth"

const SUCCESS_MESSAGE =
  "Your password has been updated successfully. You can now log in"

export default function Page() {
  const router = useRouter()

  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [isLinkChecked, setIsLinkChecked] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [isUpdated, setIsUpdated] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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

  const passwordValue = useWatch({ control, name: "password" }) || ""

  const passwordRules = useMemo(
    () => [
      {
        key: "length",
        label: "8 - 64 characters",
        matched: passwordValue.length >= 8 && passwordValue.length <= 64,
      },
      {
        key: "upperLower",
        label: "Uppercase letter",
        matched: /[A-Z]/.test(passwordValue),
      },
      {
        key: "lowercase",
        label: "Lowercase letter",
        matched: /[a-z]/.test(passwordValue),
      },
      {
        key: "digit",
        label: "One digit",
        matched: /[0-9]/.test(passwordValue),
      },
      {
        key: "special",
        label: "Special character",
        matched: /[^A-Za-z0-9]/.test(passwordValue),
      },
    ],
    [passwordValue]
  )

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

    window.setTimeout(() => {
      router.push("/login")
    }, 3000)
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
        {/* New Password */}
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-xs font-semibold tracking-wide text-muted-foreground uppercase"
          >
            New Password
          </label>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Enter new password"
              aria-invalid={Boolean(errors.password)}
              className="h-11 w-full rounded-md border border-transparent bg-surface-highest px-4 pr-12 text-base text-foreground transition outline-none focus:border-primary focus:ring-2 focus:ring-primary/25"
              {...register("password")}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {errors.password ? (
            <p className="mt-1 text-sm text-error" role="alert">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-xs font-semibold tracking-wide text-muted-foreground uppercase"
          >
            Confirm Password
          </label>

          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Confirm new password"
              aria-invalid={Boolean(errors.confirmPassword)}
              className="h-11 w-full rounded-md border border-transparent bg-surface-highest px-4 pr-12 text-base text-foreground transition outline-none focus:border-primary focus:ring-2 focus:ring-primary/25"
              {...register("confirmPassword")}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {errors.confirmPassword ? (
            <p className="mt-1 text-sm text-error" role="alert">
              {errors.confirmPassword.message}
            </p>
          ) : null}
        </div>

        {/* Password requirements checklist */}
        <section className="rounded-md bg-surface-high p-4" aria-live="polite">
          <h2 className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Security Requirements
          </h2>

          <ul className="grid grid-cols-2 gap-2 text-sm">
            {passwordRules.map((rule) => (
              <li key={rule.key} className="flex items-center gap-2">
                {rule.matched ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground/60" />
                )}
                <span
                  className={
                    rule.matched ? "text-emerald-900" : "text-muted-foreground"
                  }
                >
                  {rule.label}
                </span>
              </li>
            ))}
          </ul>
        </section>

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

        {isUpdated ? (
          <p className="rounded-md border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
            {SUCCESS_MESSAGE}
          </p>
        ) : null}

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
