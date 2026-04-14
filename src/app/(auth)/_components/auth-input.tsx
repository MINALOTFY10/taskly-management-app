"use client"

import React from "react"

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string
	error?: string | null
	containerClassName?: string
	labelClassName?: string
	hideLabel?: boolean
}

export default function AuthInput({
	id,
	label,
	error,
	containerClassName = "mb-5",
	labelClassName,
	className,
	hideLabel = false,
	...props
}: AuthInputProps) {
	const baseClass =
		"h-13 sm:h-11 w-full rounded-md border border-transparent bg-surface-highest px-4 text-base text-foreground transition outline-none focus:border-primary focus:ring-2 focus:ring-primary/25"

	return (
		<div className={containerClassName}>
			{label && !hideLabel && (
				<label
					htmlFor={id}
					className={
						"mb-2 block text-xs font-semibold tracking-wide text-muted-foreground uppercase " +
						(labelClassName ?? "")
					}
				>
					{label}
				</label>
			)}

			<input id={id} className={`${baseClass} ${className ?? ""}`} {...(props as any)} />

			{error ? (
				<p className="mt-1 text-sm text-error" role="alert">
					{error}
				</p>
			) : null}
		</div>
	)
}

