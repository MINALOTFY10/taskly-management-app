"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface AuthSubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	isLoading?: boolean
	loadingText?: string
}

export default function AuthSubmitButton({
	children,
	isLoading = false,
	loadingText = "Submitting...",
	className,
	disabled,
	...props
}: AuthSubmitButtonProps) {
	return (
		<Button
			type={props.type ?? "submit"}
			size="lg"
			disabled={Boolean(disabled) || isLoading}
			className={cn(`h-13 sm:h-11 max-sm:mt-4 w-full text-base font-semibold`, className)}
			{...props}
		>
			{isLoading ? loadingText : children}
		</Button>
	)
}

