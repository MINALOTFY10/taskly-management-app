"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { FaCheck } from "react-icons/fa"

import { type SignUpFormValues, signUpSchema } from "@/lib/validations/auth"
import AuthLayout from "../_components/auth-layout"
import AuthInput from "../_components/auth-input"
import AuthSubmitButton from "../_components/auth-submit-button"
import VerifyEmailState from "../_components/verify-email-page"
import { signUpUser } from "@/lib/services/auth-service"
import PasswordRulesChecker from "../_components/password-rules-checker"

const PASSWORD_RULES = [
  {
    key: "minLength" as const,
    label: "At least 8 characters",
    test: (p: string) => p.length >= 8,
  },
  {
    key: "hasUpperLowerDigit" as const,
    label: "One uppercase, lowercase, and digit",
    test: (p: string) => /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(p),
  },
  {
    key: "hasSpecial" as const,
    label: "One special character",
    test: (p: string) => /[^A-Za-z0-9]/.test(p),
  },
] as const

export default function SignUpPage() {
  const router = useRouter()

  const [apiError, setApiError] = useState<string | null>(null)
  const [verifyEmail, setVerifyEmail] = useState<string | null>(null)

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      jobTitle: "",
    },
    mode: "onChange",
  })

  const passwordValue = useWatch({ control, name: "password" }) || ""

  const passwordChecks = useMemo(
    () =>
      Object.fromEntries(
        PASSWORD_RULES.map((rule) => [rule.key, rule.test(passwordValue)])
      ),
    [passwordValue]
  ) as Record<(typeof PASSWORD_RULES)[number]["key"], boolean>

  const rules = PASSWORD_RULES.map((rule) => ({
    key: rule.key,
    label: rule.label,
    matched: passwordChecks[rule.key],
  }))

  const onSubmit = async (values: SignUpFormValues) => {
    setApiError(null)

    try {
      const { data, error } = await signUpUser(values)

      if (error) {
        setApiError(
          error.message || "Unable to create account. Please try again."
        )
        return
      }

      if (data.user && data.user.identities?.length === 0) {
        setApiError(
          "An account with this email already exists. Please log in instead."
        )
        return
      }

      if (data.session) {
        router.push("/main")
        router.refresh()
      } else {
        setVerifyEmail(values.email)
      }
    } catch {
      setApiError("Network error. Please check your connection and try again.")
    }
  }

  return (
    <AuthLayout
      title="Create your workspace"
      subtitle="Join the editorial approach to task management."
    >
      {verifyEmail ? (
        <VerifyEmailState email={verifyEmail} />
      ) : (
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          aria-describedby="signup-form-status"
        >
          <AuthInput
            id="name"
            label="Full Name"
            type="text"
            autoComplete="name"
            placeholder="Enter your full name"
            aria-invalid={Boolean(errors.name)}
            {...register("name")}
            error={errors.name?.message}
          />

          <AuthInput
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="yourname@company.com"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
            error={errors.email?.message}
          />

          <AuthInput
            id="jobTitle"
            label="Job Title (Optional)"
            type="text"
            autoComplete="organization-title"
            placeholder="e.g. Project Manager"
            aria-invalid={Boolean(errors.jobTitle)}
            {...register("jobTitle")}
            error={errors.jobTitle?.message}
          />

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AuthInput
              id="password"
              label="Password"
              type="password"
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              aria-invalid={Boolean(errors.password)}
              {...register("password")}
              error={errors.password?.message}
              containerClassName=""
            />

            <AuthInput
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              autoComplete="new-password"
              placeholder="Repeat your password"
              aria-invalid={Boolean(errors.confirmPassword)}
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
              containerClassName=""
            />
          </div>

          <PasswordRulesChecker
            rules={rules}
            variant="badge"
            layout="list"
            className="mb-6"
          />
          <p
            id="signup-form-status"
            role="alert"
            className={
              apiError
                ? "rounded-md border border-error/30 bg-error/10 px-3 py-2 text-sm text-error"
                : "sr-only"
            }
          >
            {apiError ?? ""}
          </p>

          <AuthSubmitButton
            isLoading={isSubmitting}
            loadingText="Creating account..."
          >
            Create Account
          </AuthSubmitButton>
        </form>
      )}

      <p className="mt-8 w-full text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}
