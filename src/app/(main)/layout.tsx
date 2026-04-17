import { cookies } from "next/headers"

import { requireUser } from "@/lib/auth.utils"
import { SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { MainShell } from "../../components/layout/main-shell"
import { getDisplayName, getInitials, getJobTitle } from "../../components/layout/main-shell.utils"

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await requireUser()
  const cookieStore = await cookies()

  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false"

  const displayName = getDisplayName(user)
  const initials = getInitials(displayName)
  const jobTitle = getJobTitle(user).toUpperCase()

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <TooltipProvider>
        <MainShell displayName={displayName} initials={initials} jobTitle={jobTitle}>
          {children}
        </MainShell>
      </TooltipProvider>
    </SidebarProvider>
  )
}