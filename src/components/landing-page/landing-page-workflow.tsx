import { MessageSquareQuote, ShieldCheck } from "lucide-react"

import { cn } from "@/lib/utils"
import { workflowCards } from "@/components/landing-page/landing-page-data"

export default function LandingPageWorkflow() {
  return (
    <section id="workflow" className="mt-8 rounded-4xl border border-border bg-card p-5 shadow-sm sm:p-6 lg:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] text-muted-foreground uppercase">
            Workflow
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            The same calm structure across the whole app.
          </h2>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="size-4 text-primary" />
          Secure by default
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {workflowCards.map((card, index) => (
          <article key={card.title} className="rounded-2xl border border-border bg-background p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">{card.title}</p>
                <p className="mt-1 text-xl font-semibold tracking-tight">{card.value}</p>
              </div>

              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MessageSquareQuote className="size-4" />
              </div>
            </div>

            <div className="mt-5 h-2 rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full bg-primary",
                  index === 1 && "bg-success",
                  index === 2 && "bg-warning",
                  card.fill
                )}
              />
            </div>

            <p className="mt-4 text-sm leading-6 text-muted-foreground">{card.meta}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
