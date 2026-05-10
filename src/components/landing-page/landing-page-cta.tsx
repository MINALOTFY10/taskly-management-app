import Link from "next/link"
import { CheckCircle2, Users } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function LandingPageCta() {
  return (
    <section
      id="cta"
      className="mt-8 grid gap-5 rounded-4xl border border-border bg-card p-5 shadow-sm lg:grid-cols-[1fr_0.95fr] lg:p-8"
    >
      <div className="rounded-[1.5rem] border border-border bg-muted/35 p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <Users className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-muted-foreground">Team-ready</p>
            <p className="text-lg font-semibold tracking-tight">Built for projects that move fast.</p>
          </div>
        </div>

        <p className="mt-4 max-w-prose text-sm leading-6 text-muted-foreground">
          Invite teammates, organize tasks, and keep delivery visible without leaving the design
          language of the rest of Taskly.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button asChild size="lg" className="h-12 px-5 text-base font-semibold">
            <Link href="/signup">Create your workspace</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-12 px-5 text-base font-semibold">
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-border bg-background p-5">
        <p className="text-xs font-semibold tracking-[0.24em] text-muted-foreground uppercase">
          What you get
        </p>
        <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
          <li className="flex gap-3">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
            <span>Project, epic, member, and task views with consistent surfaces.</span>
          </li>
          <li className="flex gap-3">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
            <span>Primary, secondary, muted, and card colors that already match the app.</span>
          </li>
          <li className="flex gap-3">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
            <span>Responsive sections that hold up in both light and dark themes.</span>
          </li>
        </ul>
      </div>
    </section>
  )
}
