import { cn } from "@/lib/utils"
import { capabilities } from "@/components/landing-page/landing-page-data"

export default function LandingPageFeatures() {
  return (
    <section id="features" className="mt-8 grid gap-4 lg:grid-cols-3">
      {capabilities.map((item) => {
        const Icon = item.icon

        return (
          <article
            key={item.title}
            className="rounded-3xl border border-border bg-card p-5 shadow-sm"
          >
            <div className={cn("inline-flex rounded-2xl p-3", item.accent)}>
              <Icon className="size-5" />
            </div>
            <h3 className="mt-4 text-xl font-semibold tracking-tight">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>

            <div className="mt-5 space-y-2 rounded-2xl border border-border bg-muted/35 p-4">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                <span>Status</span>
                <span>Live</span>
              </div>
              <div className="h-2 rounded-full bg-background">
                <div className="h-full w-3/4 rounded-full bg-primary" />
              </div>
            </div>
          </article>
        )
      })}
    </section>
  )
}
