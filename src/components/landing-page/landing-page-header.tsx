import Link from "next/link"
import { ArrowRight } from "lucide-react"

import AppLogo from "@/components/shared/app-logo"
import { Button } from "@/components/ui/button"

export default function LandingPageHeader() {
  return (
    <header className="mb-8 flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card/80 px-4 py-3 shadow-sm backdrop-blur sm:px-6">
      <AppLogo />

      <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
        <a href="#overview" className="transition-colors hover:text-foreground">
          Overview
        </a>
        <a href="#features" className="transition-colors hover:text-foreground">
          Features
        </a>
        <a href="#workflow" className="transition-colors hover:text-foreground">
          Workflow
        </a>
        <a href="#cta" className="transition-colors hover:text-foreground">
          Get started
        </a>
      </nav>

      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
          <Link href="/login">Log in</Link>
        </Button>
        <Button asChild size="sm" className="shadow-sm">
          <Link href="/signup">
            Get started
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </header>
  )
}
