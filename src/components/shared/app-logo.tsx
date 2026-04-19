import Image from "next/image"
import LogoIcon from "@/../public/assets/icon.png"
import {cn} from "@/lib/utils"

export default function AppLogo({className}: {className?: string}) {
  return (
    <div className={cn("flex items-center gap-2 overflow-hidden", className)}>
      <Image
        src={LogoIcon}
        alt="Taskly"
        className="h-4.5 w-4.5 shrink-0"
        priority
      />
      <span className="text-xl font-bold tracking-tight group-data-[collapsible=icon]:hidden">
        TASKLY
      </span>
    </div>
  )
}
