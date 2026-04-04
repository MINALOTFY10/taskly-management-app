import AppErrorState from "@/components/shared/app-error-state"

type ErrorStateProps = {
  message?: string
}

export default function ErrorState({
  message = "Failed to load projects",
}: ErrorStateProps) {
  return <AppErrorState message={message} actionHref="/project" />
}
