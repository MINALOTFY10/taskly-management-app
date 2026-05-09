"use client"

import React from "react"

import AuthActionButton from "@/features/auth/components/auth-action-button"

interface AuthSubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	isLoading?: boolean
	loadingText?: string
}

export default function AuthSubmitButton({
	children,
	isLoading = false,
	loadingText = "Submitting...",
	...props
}: AuthSubmitButtonProps) {
	return (
		<AuthActionButton
			type={props.type ?? "submit"}
			size="lg"
			className="h-13 w-full text-base font-semibold sm:h-11 max-sm:mt-4"
			isLoading={isLoading}
			loadingText={loadingText}
			{...props}
		>
			{children}
		</AuthActionButton>
	)
}

