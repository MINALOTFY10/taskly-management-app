import { useMemo } from "react"
import { useWatch } from "react-hook-form"
import type { Control, FieldValues, Path } from "react-hook-form"

const PASSWORD_RULES = [
  {
    key: "length",
    label: "8 - 64 characters",
    test: (p: string) => p.length >= 8 && p.length <= 64,
  },
  {
    key: "uppercase",
    label: "Uppercase letter",
    test: (p: string) => /[A-Z]/.test(p),
  },
  {
    key: "lowercase",
    label: "Lowercase letter",
    test: (p: string) => /[a-z]/.test(p),
  },
  {
    key: "digit",
    label: "One digit",
    test: (p: string) => /[0-9]/.test(p),
  },
  {
    key: "special",
    label: "Special character",
    test: (p: string) => /[^A-Za-z0-9]/.test(p),
  },
] as const

export function usePasswordRules<T extends FieldValues>(
  control: Control<T>,
  name: Path<T>
) {
  const passwordValue = (useWatch({ control, name }) as string) ?? ""

  return useMemo(
    () =>
      PASSWORD_RULES.map((rule) => ({
        key: rule.key,
        label: rule.label,
        matched: rule.test(passwordValue),
      })),
    [passwordValue]
  )
}
