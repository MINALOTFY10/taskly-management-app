"use client"

import React from "react"

import { Button } from "@/components/ui/button"

type AuthActionButtonProps = React.ComponentProps<typeof Button> & {
  isLoading?: boolean
  loadingText?: string
}

export default function AuthActionButton({
  children,
  isLoading = false,
  loadingText = "Submitting...",
  disabled,
  ...props
}: AuthActionButtonProps) {
  return (
    <Button disabled={Boolean(disabled) || isLoading} {...props}>
      {isLoading ? loadingText : children}
    </Button>
  )
}