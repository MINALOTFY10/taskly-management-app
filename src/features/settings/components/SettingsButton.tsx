"use client"

import { Settings as SettingsIcon } from "lucide-react"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { DialogTrigger } from "@/components/ui/dialog"

export default function SettingsButton() {
  return (
    <DialogTrigger asChild>
      <SidebarMenuButton tooltip="Settings" className="h-8 w-59 px-3 cursor-pointer">
        <SettingsIcon className="size-4.5!" />
        <span className="text-[0.95rem] ms-1">Settings</span>
      </SidebarMenuButton>
    </DialogTrigger>
  )
}
