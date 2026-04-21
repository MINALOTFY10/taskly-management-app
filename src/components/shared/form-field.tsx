import { AlertCircle } from "lucide-react"
import type { ReactNode } from "react"

type FormFieldProps = {
  label: string
  htmlFor: string
  children: ReactNode
  required?: boolean
  hint?: string
  trailingLabel?: string
  error?: string
  errorId?: string
  labelClassName?: string
  wrapperClassName?: string
}

export function FormField({
  label,
  htmlFor,
  children,
  required = false,
  hint,
  trailingLabel,
  error,
  errorId,
  labelClassName,
  wrapperClassName,
}: FormFieldProps) {
  return (
    <div className={wrapperClassName ?? "space-y-2"}>
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor={htmlFor}
          className={
            labelClassName ??
            "block text-xs font-bold tracking-[0.08em] text-muted-foreground uppercase"
          }
        >
          {label} {required && <span className="text-error">*</span>}
        </label>

        {trailingLabel ? (
          <span className="text-xs font-semibold text-muted-foreground">
            {trailingLabel}
          </span>
        ) : null}
      </div>

      {children}

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="flex items-center gap-1.5 text-sm font-medium text-error"
        >
          <AlertCircle className="size-4" aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}
