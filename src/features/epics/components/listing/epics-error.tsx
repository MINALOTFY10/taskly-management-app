import { EyeOff } from "lucide-react"

type EpicsErrorProps = {
  message?: string
}

export default function EpicsError({ message }: EpicsErrorProps) {
  const isSearchError = message === "Failed to search epics"

  return (
    <section className="flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-error/15">
        <EyeOff className="size-8 text-error" aria-hidden="true" />
      </div>

      <h2 className="text-xl font-bold text-foreground">
        {isSearchError ? "Failed to search epics" : "Something went wrong"}
      </h2>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
        {isSearchError
          ? "Please try again in a moment."
          : "We're having trouble retrieving your project epics right now. Please try again in a moment."}
      </p>
    </section>
  )
}