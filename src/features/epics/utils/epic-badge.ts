const EPIC_BADGE_PALETTE = [
  "bg-emerald-100 text-emerald-700 border border-emerald-200",
  "bg-blue-100 text-blue-700 border border-blue-200",
  "bg-violet-100 text-violet-700 border border-violet-200",
  "bg-amber-100 text-amber-700 border border-amber-200",
  "bg-teal-100 text-teal-700 border border-teal-200",
  "bg-rose-100 text-rose-700 border border-rose-200",
]

export function getEpicBadgeColor(epicId: string): string {
  let hash = 0
  for (let i = 0; i < epicId.length; i++) {
    hash = (hash * 31 + epicId.charCodeAt(i)) >>> 0
  }
  return EPIC_BADGE_PALETTE[hash % EPIC_BADGE_PALETTE.length]
}
