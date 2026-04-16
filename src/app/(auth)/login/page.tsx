"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { loginSchema, type LoginFormValues } from "@/lib/validations/auth"
import AuthLayout from "@/app/(auth)/_components/auth-layout"
import AuthInput from "@/app/(auth)/_components/auth-input"
import AuthSubmitButton from "@/app/(auth)/_components/auth-submit-button"
import { loginUser } from "@/lib/services/auth-service"

export default function Page() {
  const router = useRouter()
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  })

  const onSubmit = async (values: LoginFormValues) => {
    setApiError(null)

    try {
      const { data, error } = await loginUser(values)

      if (error) {
        setApiError("Invalid email or password. Please try again.")
        return
      }

      if (!data.session) {
        setApiError(
          "Login succeeded but no session was returned. Please try again."
        )
        return
      }
      router.push("/main")
      router.refresh()
    } catch {
      setApiError("Network error. Please check your connection and try again.")
    }
  }

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Please enter your details to access your workspace."
    >
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        aria-describedby="login-form-status"
      >
        <AuthInput
          id="email"
          label="Email Address"
          type="email"
          autoComplete="email"
          placeholder="yourname@company.com"
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
          error={errors.email?.message}
        />

        <AuthInput
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          aria-invalid={Boolean(errors.password)}
          {...register("password")}
          error={errors.password?.message}
        />

        {/* Remember me + Forgot password row */}
        <div className="my-6 flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground select-none">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-muted-foreground/40 accent-primary"
              {...register("rememberMe")}
            />
            Remember Me
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <p
          id="login-form-status"
          role="alert"
          className={
            apiError
              ? "rounded-md border border-error/30 bg-error/10 px-3 py-2 text-sm text-error"
              : "sr-only"
          }
        >
          {apiError ?? ""}
        </p>

        <AuthSubmitButton isLoading={isSubmitting} loadingText="Signing in...">
          Log In
        </AuthSubmitButton>
      </form>

      <p className="mx-sm:absolute mx-sm:left-1/2 mx-sm:-translate-x-1/2 bottom-10 mt-8 w-full text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </AuthLayout>
  )
}
