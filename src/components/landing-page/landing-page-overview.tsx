import Link from "next/link"
import { ArrowRight, BarChart3, CheckCircle2, Sparkles } from "lucide-react"
import { IoBuild } from "react-icons/io5";

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { quickStats, trustPoints } from "@/components/landing-page/landing-page-data"

export default function LandingPageOverview() {
  return (
    <section
      id="overview"
      className="grid items-center gap-10 rounded-4xl border border-border/70 bg-card px-5 py-8 shadow-sm sm:px-8 sm:py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-12"
    >
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-muted-foreground shadow-sm">
          <IoBuild  className="size-3.5 text-primary" />
          Built to match your product workspace
        </div>

        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Plan less, ship more, and keep every project visibly moving.
        </h1>

        <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
          Taskly gives teams a consistent way to organize Projects, Epics, and Tasks in a design
          system that stays readable in both light and dark mode.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button asChild size="lg" className="h-12 px-5 text-base font-semibold">
            <Link href="/signup">
              Start free
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg" className="h-12 px-5 text-base font-semibold">
            <Link href="/login">Use my account</Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {trustPoints.map((point) => (
            <div
              key={point}
              className="flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground"
            >
              <CheckCircle2 className="size-4 shrink-0 text-success" />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-border bg-background p-4 shadow-sm sm:p-5">
        <div className="rounded-[1.4rem] border border-border bg-card p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.24em] text-muted-foreground uppercase">
                Project workspace
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                A single place to see what matters.
              </h2>
            </div>

            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <BarChart3 className="size-5" />
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {quickStats.map((stat, index) => (
              <div key={stat.label} className="rounded-2xl border border-border bg-muted/35 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <span
                    className={cn(
                      "h-2 w-16 rounded-full bg-border/70",
                      index === 0 && "bg-primary/20",
                      index === 1 && "bg-primary/30",
                      index === 2 && "bg-success/25",
                      index === 3 && "bg-warning/25"
                    )}
                  />
                </div>
                <p className="mt-3 text-2xl font-semibold tracking-tight">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-border bg-background p-4">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-semibold text-foreground">Launch readiness</span>
              <span className="text-muted-foreground">82%</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-muted">
              <div className="h-full w-[82%] rounded-full bg-primary" />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Most work is already in motion. Keep the board visible and the team aligned.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
