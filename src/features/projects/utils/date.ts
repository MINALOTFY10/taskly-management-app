const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "short",
  year: "numeric",
}

export function formatProjectDate(dateString: string | null | undefined): string {
  if (!dateString) return "—"

  const date = new Date(dateString)

  if (Number.isNaN(date.getTime())) return "—"

  return date.toLocaleDateString("en-GB", DATE_FORMAT)
}