import { Unplug } from "lucide-react"

import AppErrorState from "@/components/shared/app-error-state"

type ProjectMembersErrorProps = {
  projectId: string
  message?: string
}

export default function ProjectMembersError({
  projectId,
  message = "Failed to load project members. Please try again.",
}: ProjectMembersErrorProps) {
  return (
    <AppErrorState
      message={message}
      actionHref={`/project/${projectId}/members`}
      icon={Unplug}
    />
  )
}
