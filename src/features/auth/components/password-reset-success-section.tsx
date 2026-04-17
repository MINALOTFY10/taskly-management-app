"use client"

import React from "react"
import { AlarmClock } from "lucide-react"
import { FaCheckCircle } from "react-icons/fa"
import { Button } from "@/components/ui/button"

interface PasswordResetSuccessSectionProps {
  onResend: () => void | Promise<void>
  disabled?: boolean
  resendLabel: string
  resendError?: string | null
}

export default function PasswordResetSuccessSection({
  onResend,
  disabled = false,
  resendLabel,
  resendError,
}: PasswordResetSuccessSectionProps) {
  return (
    <section className="mt-8 border-t border-border/50 pt-6" aria-live="polite">
      <div className="rounded-md bg-emerald-100/70 p-4 text-emerald-900">
        <p className="flex items-start gap-2 px-1 text-sm">
          <FaCheckCircle className="mt-0.5 mr-1 h-4.5 w-4.5 shrink-0" />
          If an account exists with this email, we've sent a password reset
          link.
        </p>
      </div>

      <div className="mt-8 space-y-3">
        <div className="flex items-center justify-center text-[12px] font-bold tracking-wide text-muted-foreground uppercase">
          Didn&apos;t receive the email?
        </div>

        <Button
          type="button"
          variant="secondary"
          className="text-muted-foreground/-10 h-13 w-full rounded-lg border border-transparent bg-surface-highest text-[17px] font-semibold"
          onClick={onResend}
          disabled={disabled}
        >
          <AlarmClock className="mr-2 size-5" />
          <span>{resendLabel}</span>
        </Button>

        {resendError && (
          <p
            role="alert"
            className="rounded-md border border-error/30 bg-error/10 px-3 py-2 text-sm text-error"
          >
            {resendError}
          </p>
        )}
      </div>
    </section>
  )
}
