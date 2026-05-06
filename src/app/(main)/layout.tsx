import { cookies } from "next/headers"
import { requireUser } from "@/lib/auth.utils"
import { StoreProvider } from "@/store/store-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { MainShell } from "../../components/layout/main-shell"

export default async function MainLayout({ children}: { children: React.ReactNode }) {
  const user = await requireUser()
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false"

  return (
    <StoreProvider initialUser={user}>
      <SidebarProvider defaultOpen={defaultOpen}>
        <TooltipProvider>
          <MainShell>{children}</MainShell>
        </TooltipProvider>
      </SidebarProvider>
    </StoreProvider>
  )
}
