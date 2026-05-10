"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

type AppearanceSettings = {
  theme: "system" | "light" | "dark"
}

export default function useAppearanceSettings() {
  const { theme: activeTheme = "system", setTheme: updateTheme } = useTheme()

  useEffect(() => {
    if (activeTheme !== "system" && activeTheme !== "light" && activeTheme !== "dark") {
      updateTheme("system")
    }
  }, [activeTheme, updateTheme])

  const setTheme = (theme: AppearanceSettings["theme"]) => {
    updateTheme(theme)
  }

  return { settings: { theme: activeTheme }, setTheme }
}
