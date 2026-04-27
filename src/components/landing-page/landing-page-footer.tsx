import Link from "next/link"

export default function LandingPageFooter() {
  return (
    <footer className="mt-10 rounded-4xl border border-border bg-card px-5 py-6 shadow-sm sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
            Taskly
          </Link>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Consistent project management for teams that want clarity and momentum.
          </p>
        </div>

        <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2 sm:gap-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-[0.22em] text-muted-foreground uppercase">
              Product
            </p>
            <div className="flex flex-col gap-2">
              <Link href="#features" className="hover:text-foreground">
                Features
              </Link>
              <Link href="#workflow" className="hover:text-foreground">
                Workflow
              </Link>
              <Link href="/signup" className="hover:text-foreground">
                Get started
              </Link>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-[0.22em] text-muted-foreground uppercase">
              Company
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/login" className="hover:text-foreground">
                Sign in
              </Link>
              <Link href="/invite" className="hover:text-foreground">
                Accept invite
              </Link>
              <Link href="/reset-password" className="hover:text-foreground">
                Reset password
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-4 text-xs text-muted-foreground">
        <span>© 2026 Taskly. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <span>Security</span>
          <span>Privacy</span>
          <span>Terms</span>
        </div>
      </div>
    </footer>
  )
}
