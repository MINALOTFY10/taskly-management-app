"use client"

import React, { useEffect, useState } from "react"
import SettingSection from "./SettingSection"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppToast } from "@/components/providers/toast-provider"
import {
  requestPasswordRecovery,
  updateUserProfile as updateProfileAPI,
} from "@/features/auth/services/auth-service"
import { createClient } from "@/lib/supabase/client"
import { useAppSelector } from "@/store/hooks"

function getProfileName(
  user: {
    user_metadata?: Record<string, unknown>
    email?: string | null
  } | null
) {
  if (!user) return ""

  const metadata = user.user_metadata ?? {}
  const metadataName =
    (typeof metadata.name === "string" ? metadata.name : "") ||
    (typeof metadata.full_name === "string" ? metadata.full_name : "")
  const normalizedName = metadataName.trim()

  if (normalizedName) return normalizedName
  if (!user.email) return ""

  return user.email.split("@")[0]
}

export default function ProfileSettings() {
  const user = useAppSelector((state) => state.user.user)
  const [name, setName] = useState("")
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isSendingReset, setIsSendingReset] = useState(false)
  const { showToast } = useAppToast()

  useEffect(() => {
    let isMounted = true

    async function loadProfile() {
      // Fill quickly from Redux, then refresh from Supabase for latest metadata.
      if (user && isMounted) {
        setName(getProfileName(user))
      }

      const supabase = createClient()
      const { data } = await supabase.auth.getUser()

      if (!isMounted) return

      setName(getProfileName(data.user ?? user ?? null))
      setIsLoadingProfile(false)
    }

    void loadProfile()

    return () => {
      isMounted = false
    }
  }, [user])

  const onSave = async () => {
    const trimmedName = name.trim()

    if (!trimmedName) {
      showToast({ variant: "error", message: "Name is required." })
      return
    }

    setIsSavingProfile(true)
    try {
      const { error, user: updatedUser } = await updateProfileAPI({
        name: trimmedName,
      })

      if (error) {
        showToast({ variant: "error", message: error })
      } else {
        setName(getProfileName(updatedUser ?? user ?? null) || trimmedName)
        showToast({ variant: "success", message: "Profile updated" })
      }
    } catch {
      showToast({ variant: "error", message: "Network error" })
    } finally {
      setIsSavingProfile(false)
    }
  }

  const onChangePassword = async () => {
    if (!user?.email) {
      showToast({
        variant: "error",
        message: "No email found for this account.",
      })
      return
    }

    setIsSendingReset(true)
    try {
      const { error } = await requestPasswordRecovery({
        email: user.email,
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        showToast({ variant: "error", message: error })
      } else {
        showToast({
          variant: "success",
          message: "Password reset link sent. Please check your email.",
        })
      }
    } catch {
      showToast({ variant: "error", message: "Network error" })
    } finally {
      setIsSendingReset(false)
    }
  }

  return (
    <div className="grid gap-6">
      <div>
        <div className="text-[1.54rem] font-semibold mb-1">General</div>
        <p className="text-[0.85rem] ms-0.5">Manage your profile, login information, and devices</p>
      </div>
      <SettingSection title="Profile" description="Update your public name">
        <div className="grid gap-3">
          <Input
            placeholder="Name"
            value={name}
            disabled={isLoadingProfile}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <Button
              onClick={onSave}
              disabled={isLoadingProfile || isSavingProfile}
              size="sm"
            >
              {isSavingProfile ? "Saving..." : "Save"}
            </Button>
            <span className="text-sm text-muted-foreground">
              Changes are saved to your account profile.
            </span>
          </div>
        </div>
      </SettingSection>

      <SettingSection
        title="Change Password"
        description="Use the existing secure reset flow to update your password"
      >
        <div className="grid gap-3">
          <div className="flex items-center gap-3">
            <Button
              onClick={onChangePassword}
              disabled={isSendingReset}
              size="sm"
            >
              {isSendingReset ? "Sending..." : "Send Reset Link"}
            </Button>
            <span className="text-sm text-muted-foreground">
              We&apos;ll email a secure password reset link to your account.
            </span>
          </div>
        </div>
      </SettingSection>
    </div>
  )
}
