"use client"

import React from "react"
import SettingSection from "./SettingSection"
import { Button } from "@/components/ui/button"
import useAppearanceSettings from "@/features/settings/hooks/useAppearanceSettings"

export default function PreferencesSettings() {
  const { settings, setTheme } = useAppearanceSettings()

  return (
    <div className="grid gap-5">
      <div>
        <div className="mb-1 text-[1.54rem] font-semibold">Preferences</div>
        <p className="ms-0.5 text-[0.85rem]">
          Choose how you want Notion to look and behave
        </p>
      </div>
      <SettingSection
        title="Theme"
        description="Choose light, dark or follow system"
      >
        <div className="flex gap-2">
          {(["system", "light", "dark"] as const).map((t) => (
            <Button
              key={t}
              variant={settings.theme === t ? "default" : "outline"}
              onClick={() => setTheme(t)}
              size="sm"
            >
              {t[0].toUpperCase() + t.slice(1)}
            </Button>
          ))}
        </div>
      </SettingSection>
      <SettingSection
        title=""
        description=""
      >
     
      </SettingSection>
    </div>
  )
}
