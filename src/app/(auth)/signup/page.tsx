"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {  useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"

import { type SignUpFormValues, signUpSchema } from "@/lib/validations/auth"
import { FaCheck } from "react-icons/fa"
import AuthLayout from "../_components/auth-layout"
import AuthInput from "../_components/auth-input"
import AuthSubmitButton from "../_components/auth-submit-button"
import VerifyEmailState from "../_components/verify-email-page"
import { signUpUser } from "@/lib/services/auth-service"

export default function Page() {
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
  const passwordChecks = {
    minLength: passwordValue.length >= 8,
    hasUpperLowerDigit: /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(passwordValue),
    hasSpecial: /[^A-Za-z0-9]/.test(passwordValue),
  }

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
        <>
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
              containerClassName="mb-7"
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
              containerClassName="mb-7"
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
              containerClassName="mb-7"
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

            <div
              className="mb-6 rounded-md border border-transparent bg-surface-highest p-4 text-xs"
              aria-live="polite"
            >
              <ul className="space-y-2 text-muted-foreground">
                {(
                  [
                    ["minLength", "At least 8 characters"],
                    [
                      "hasUpperLowerDigit",
                      "One uppercase, lowercase, and digit",
                    ],
                    ["hasSpecial", "One special character"],
                  ] as const
                ).map(([key, label]) => (
                  <li key={key} className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className={`inline-flex h-4 w-4 items-center justify-center rounded-full border text-[10px] leading-none ${
                        passwordChecks[key]
                          ? "border-success text-success"
                          : "border-muted-foreground/40 text-transparent"
                      }`}
                    >
                      <FaCheck className="text-[8px]" />
                    </span>
                    <span
                      className={
                        passwordChecks[key]
                          ? "text-success"
                          : "text-muted-foreground"
                      }
                    >
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

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
        </>
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
