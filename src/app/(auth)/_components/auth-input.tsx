"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string | null
  containerClassName?: string
  labelClassName?: string
  hideLabel?: boolean
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
  ...props
}: AuthInputProps) {
  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={id} className={cn(BASE_LABEL_CLASS, labelClassName)}>
          {label}
        </label>
      )}

      <input id={id} className={cn(BASE_INPUT_CLASS, className)} {...props} />

      {error && (
        <p className="mt-1 ml-2 text-sm text-muted-foreground" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
