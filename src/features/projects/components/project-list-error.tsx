import { Button } from "@/components/ui/button"
import { FileWarning } from "lucide-react"
import Link from "next/link"

type ErrorStateProps = {
  message?: string
}

export default function ErrorState({
  message = "Failed to load projects",
}: ErrorStateProps) {
  return (
    <section className="flex min-h-[calc(100dvh-64px)] flex-col items-center justify-center px-5 py-12 text-center sm:px-8">
      <div className="flex size-18 items-center justify-center rounded-xl bg-error/15 text-error">
        <FileWarning className="size-9" />
      </div>

      <h1 className="mt-6 text-[2.2rem] leading-none font-semibold tracking-tight text-foreground">
        Something went wrong
      </h1>
      <p className="mt-4 max-w-sm text-[0.9rem] leading-relaxed text-muted-foreground sm:text-[1rem]">
        {message}
      </p>

      <Button
        asChild
        size="lg"
        className="mt-7 h-12 px-7 text-[14px] font-semibold"
      >
        <Link href="/project">Retry Connection</Link>
      </Button>
    </section>
  )
}
