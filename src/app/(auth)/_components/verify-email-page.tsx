import Link from "next/link"
import { MdOutlineMarkEmailRead } from "react-icons/md"


export default function VerifyEmailPage({ email }: { email: string }) {
  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <MdOutlineMarkEmailRead size={32} />
      </span>
      <div className="space-y-3">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight text-foreground">
          Check your inbox
        </h2>
        <p className="text-sm text-muted-foreground">
          We sent a confirmation link to{" "}
          <span className="font-semibold text-foreground">{email}</span>.
          <br />
          Click the link to activate your account.
        </p>
      </div>
      <p className="text-sm text-muted-foreground">
        Didn&apos;t receive it? Check your spam folder, or{" "}
        {/* Plain Link without reload — navigating to /signup is already a fresh page */}
        <Link
          href="/signup"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          try again
        </Link>
        .
      </p>
    </div>
  )
}