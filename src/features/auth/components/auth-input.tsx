"use client"

import React, { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string | null
  containerClassName?: string
  labelClassName?: string
  showPasswordToggle?: boolean  // ← new
}

const BASE_INPUT_CLASS =
  "h-13 sm:h-11 w-full rounded-md border border-transparent bg-surface-highest px-4 text-base text-foreground transition outline-none focus:border-primary focus:ring-2 focus:ring-primary/25"

const BASE_LABEL_CLASS =
  "mb-2 block text-xs font-semibold tracking-wide text-muted-foreground uppercase"

export default function AuthInput({
  id,
  label,
  error,
  containerClassName = "mb-7",
  labelClassName,
  className,
  type,
  showPasswordToggle = false,
  ...props
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  const inputType =
    showPasswordToggle && type === "password"
      ? showPassword ? "text" : "password"
      : type

  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={id} className={cn(BASE_LABEL_CLASS, labelClassName)}>
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={id}
          type={inputType}
          className={cn(
            BASE_INPUT_CLASS,
            showPasswordToggle && "pr-12",
            className
          )}
          {...props}
        />

        {showPasswordToggle && type === "password" && (
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
        )}
      </div>

      {error && (
        <p className="mt-1 ml-2 text-sm text-muted-foreground" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}