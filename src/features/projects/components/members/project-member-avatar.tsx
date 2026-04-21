import { cn } from "@/lib/utils"
import { getAvatarColor, getInitials } from "@/features/projects/utils/avatar"

type ProjectMemberAvatarProps = {
  name: string
  size?: "sm" | "md"
  className?: string
}

const SIZE_CLASSES = {
  sm: "size-10 text-[0.75rem]",
  md: "size-11 text-sm",
}

export default function ProjectMemberAvatar({
  name,
  size = "md",
  className,
}: ProjectMemberAvatarProps) {
  const { bg, text } = getAvatarColor(name)
  const initials = getInitials(name)

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl font-bold",
        SIZE_CLASSES[size],
        bg,
        text,
        className
      )}
      aria-hidden="true"
      title={name}
    >
      {initials}
    </div>
  )
}