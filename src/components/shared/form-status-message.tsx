type FormStatusMessageProps = {
  id: string
  message: string | null
}

export function FormStatusMessage({ id, message }: FormStatusMessageProps) {
  return (
    <p
      id={id}
      role="alert"
      className={
        message
          ? "rounded-md border border-error/30 bg-error/10 px-3 py-2 text-sm text-error"
          : "sr-only"
      }
    >
      {message ?? ""}
    </p>
  )
}
