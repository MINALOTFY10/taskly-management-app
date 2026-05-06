"use client"

import { Loader2, Mail, UserPlus } from "lucide-react"

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useInviteMember } from "@/features/members/hooks/use-invite-member"

type InviteMemberFormProps = {
	projectId: string
	projectName: string
	open: boolean
	onClose: () => void
}

export default function InviteMemberForm({
	projectId,
	projectName,
	open,
	onClose,
}: InviteMemberFormProps) {
	const { email, setEmail, isLoading, error, successEmail, handleSubmit, reset } =
		useInviteMember(projectId)

	const handleClose = () => {
		reset()
		onClose()
	}

	return (
		<Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
			<DialogContent className="w-[calc(100%-2rem)] max-w-160 rounded-xl border border-border/45 p-0 sm:w-150">
				<div className="px-5 py-5 sm:px-6 sm:py-6">
					<DialogHeader className="space-y-3">
						<div className="inline-flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
							<UserPlus className="size-4.5" />
						</div>

						<div className="space-y-1">
							<DialogTitle className="text-[1.7rem] leading-none font-semibold tracking-tight text-foreground sm:text-[1.8rem]">
								Invite Team Member
							</DialogTitle>
							<DialogDescription className="max-w-120 text-xs leading-relaxed text-muted-foreground">
								Send an invitation to join the {projectName} workspace.
							</DialogDescription>
						</div>
					</DialogHeader>

					<form
						className="mt-5 space-y-4"
						onSubmit={(event) => {
							event.preventDefault()
							void handleSubmit()
						}}
						noValidate
					>
						<div className="space-y-2">
							<label
								htmlFor="invite-member-email"
								className="text-[0.68rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase"
							>
								Email Address
							</label>

							<div className="relative mt-1">
								<Input
									id="invite-member-email"
									type="email"
									placeholder="Enter email address"
									value={email}
									onChange={(event) => setEmail(event.target.value)}
									disabled={isLoading}
									aria-invalid={Boolean(error)}
									className="h-10 border-transparent bg-surface-highest px-3 pr-10 text-sm shadow-none"
								/>
								<Mail className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
							</div>

							{error ? (
								<p className="text-sm text-destructive" role="alert">
									{error}
								</p>
							) : null}

							{successEmail ? (
								<p
									className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700"
									role="status"
								>
									Invitation sent successfully to {successEmail}.
								</p>
							) : null}
						</div>

						<div className="flex items-center justify-end gap-2.5 pt-2">
							<Button
								type="button"
								variant="ghost"
								className="h-9 min-w-20 px-3 text-[0.85rem] font-semibold text-muted-foreground hover:text-foreground"
								onClick={handleClose}
							>
								Cancel
							</Button>

							<Button
								type="submit"
								size="lg"
								className="h-9 min-w-40 px-5 text-[0.85rem] font-semibold shadow-[0_10px_18px_rgba(0,50,184,0.2)]"
								disabled={isLoading}
							>
								{isLoading ? (
									<span className="inline-flex items-center gap-2">
										<Loader2 className="size-4 animate-spin" />
										Sending...
									</span>
								) : (
									"Send Invitation"
								)}
							</Button>
						</div>
					</form>
				</div>
			</DialogContent>
		</Dialog>
	)
}
