"use client"

import { Unplug } from "lucide-react"

import AppErrorState from "@/components/shared/app-error-state"

type MembersErrorProps = {
  reset: () => void
}

export default function MembersError({ reset }: MembersErrorProps) {
  return (
    <AppErrorState
      message="Failed to load project members. Please try again."
      onAction={reset}
      icon={Unplug}
    />
  )
}
