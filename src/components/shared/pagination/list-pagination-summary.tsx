type ListPaginationSummaryProps = {
  shownCount: number
  totalCount: number
  itemLabel: string
}

export default function ListPaginationSummary({
  shownCount,
  totalCount,
  itemLabel,
}: ListPaginationSummaryProps) {
  return (
    <p className="text-[0.82rem] text-muted-foreground">
      Showing {shownCount} of {totalCount} {itemLabel}
    </p>
  )
}