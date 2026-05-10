"use client"

import React, { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import PreferencesSettings from "./preferences-settings"
import ProfileSettings from "./ProfileSettings"
import SettingsButton from "./SettingsButton"
import { Settings, Settings2, Bell, Mail, WifiCog, UserRoundPen, Users, Import, Gem } from "lucide-react"

const SIDEBAR = [
  {
    heading: "Account",
    items: [
      { key: "Profile", label: "Profile", icon: <UserRoundPen size={15} /> },
      { key: "Preferences", label: "Preferences", icon: <Settings2 size={15} /> },
      { key: "Notifications", label: "Notifications", icon: <Bell size={15} /> },
      { key: "Mail & Calendar", label: "Mail & Calendar", icon: <Mail size={15} /> },
      { key: "Connections", label: "Connections", icon: <WifiCog  size={15} /> },
    ],
  },
  {
    heading: "Workspace",
    items: [
      { key: "General", label: "General", icon: <Settings size={15} /> },
      { key: "People", label: "People", icon: <Users  size={15} /> },
      { key: "Import", label: "Import", icon: <Import  size={15} /> },
    ],
  },
  {
    heading: "Access & billing",
    items: [{ key: "Upgrade plan", label: "Upgrade plan", icon: <Gem size={15} /> }],
  },
]

export default function SettingsDialog() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string>("Profile")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div>
        <SettingsButton />
      </div>
      <DialogContent className="top-[10vh] h-[80vh] max-w-5xl translate-y-0 overflow-hidden p-0">
        <div className="grid h-full min-h-0 grid-cols-12 gap-6">
          <aside className="col-span-3 border-r border-border/50">
            <nav className="sticky top-6 flex flex-col gap-4 px-4 py-4">
              {SIDEBAR.map((section) => (
                <div key={section.heading}>
                  <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase">
                    {section.heading}
                  </div>
                  <div className="flex flex-col gap-1">
                    {section.items.map((it) => (
                      <button
                        key={it.key}
                        onClick={() => setActive(it.key)}
                        className={`flex w-full items-center rounded-md px-3 py-2 text-left text-[0.88rem] transition-colors hover:bg-muted cursor-pointer ${
                          active === it.key ? "bg-muted font-semibold" : ""
                        }`}
                      >
                        <div className="rounded-sm">{it.icon}</div>
                        <span className="ml-3">{it.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </aside>

          <main className="col-span-9 min-h-0 overflow-auto bg-transparent p-0">
            <div className="bg-card px-6 py-10">
              {active === "Profile" && <ProfileSettings />}

              {active === "Preferences" && <PreferencesSettings />}

              {active !== "Profile" &&
                active !== "Preferences" &&
                active !== "General" && (
                  <div>
                    <div className="mb-2 text-[1.4rem] font-semibold">
                      {active}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      The settings page for {active}.
                    </p>
                  </div>
                )}
            </div>
          </main>
        </div>
      </DialogContent>
    </Dialog>
  )
}