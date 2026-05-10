import { EyeOff } from "lucide-react"

type EpicsErrorProps = {
  message?: string
}

export default function EpicsError({ message }: EpicsErrorProps) {
  const isSearchError = message === "Failed to search epics"

  return (
    <section className="flex flex-col items-center justify-center px-5 py-18 text-center">
      <div className="w-full max-w-lg rounded-xl border border-border/60 bg-card/80 px-5 py-6 shadow-sm">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-lg bg-error/15">
          <EyeOff className="size-8 text-error" aria-hidden="true" />
        </div>

        <h2 className="text-xl font-bold text-foreground">
          {isSearchError ? "Failed to search epics" : "Something went wrong"}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {isSearchError
            ? "Please try again in a moment."
            : "We're having trouble retrieving your project epics right now. Please try again in a moment."}
        </p>
      </div>
    </section>
  )
}