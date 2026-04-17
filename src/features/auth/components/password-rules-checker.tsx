import { CheckCircle2, Circle } from "lucide-react"
import { FaCheck } from "react-icons/fa"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PasswordRule {
  key: string
  label: string
  matched: boolean
}

interface PasswordRulesCheckerProps {
  rules: PasswordRule[]
  layout?: "list" | "grid"
  variant?: "badge" | "icon"
  title?: string
  className?: string
}

function BadgeIcon({ matched }: { matched: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[10px] leading-none transition-colors ${
        matched
          ? "border-success text-success"
          : "border-muted-foreground/40 text-transparent"
      }`}
    >
      <FaCheck className="text-[8px]" />
    </span>
  )
}

function LucideIcon({ matched }: { matched: boolean }) {
  return matched ? (
    <CheckCircle2
      className="h-4 w-4 shrink-0 text-success"
      aria-hidden="true"
    />
  ) : (
    <Circle
      className="h-4 w-4 shrink-0 text-muted-foreground/60"
      aria-hidden="true"
    />
  )
}

export default function PasswordRulesChecker({
  rules,
  layout = "list",
  variant = "icon",
  title,
  className = "",
}: PasswordRulesCheckerProps) {
  const listClassName =
    layout === "grid" ? "grid grid-cols-2 gap-2 text-sm" : "space-y-2 text-sm"

  return (
    <section
      className={`rounded-md bg-surface-high p-4 ${className}`}
      aria-live="polite"
    >
      {title && (
        <h2 className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {title}
        </h2>
      )}

      <ul className={listClassName}>
        {rules.map((rule) => (
          <li key={rule.key} className="flex items-center gap-2">
            {variant === "badge" ? (
              <BadgeIcon matched={rule.matched} />
            ) : (
              <LucideIcon matched={rule.matched} />
            )}

            <span
              className={
                rule.matched ? "text-success" : "text-muted-foreground"
              }
            >
              {rule.label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
