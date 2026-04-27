import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin" 

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")

  if (!token || token.trim() === "") {
    return NextResponse.json({ error: "invalid_token" }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data: invitation, error: invitationError } = await supabase
    .from("project_invitations")
    .select("project_id, invited_by, status, expires_at")
    .eq("token", token.trim())
    .maybeSingle()

  if (invitationError) {
    console.error("API: Failed to fetch invitation", invitationError)
    return NextResponse.json({ error: "unknown" }, { status: 500 })
  }

  if (!invitation) {
    return NextResponse.json({ error: "invalid_token" }, { status: 404 })
  }

  if (invitation.status?.toLowerCase() === "accepted") {
    return NextResponse.json({ error: "already_accepted" }, { status: 410 })
  }

  if (
    invitation.expires_at &&
    new Date(invitation.expires_at).getTime() < Date.now()
  ) {
    return NextResponse.json({ error: "expired" }, { status: 410 })
  }

  const [projectResult, profileResult] = await Promise.all([
    supabase
      .from("projects")
      .select("name")
      .eq("id", invitation.project_id)
      .maybeSingle(),
    invitation.invited_by
      ? supabase
          .from("profiles")
          .select("name, department")
          .eq("id", invitation.invited_by)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ])

  if (projectResult.error) {
    console.error("API: Failed to fetch project", projectResult.error)
  }

  if (profileResult.error) {
    console.error("API: Failed to fetch inviter profile", profileResult.error)
  }

  return NextResponse.json({
    projectId: invitation.project_id,
    projectName: projectResult.data?.name?.trim() || null,
    inviterId: invitation.invited_by ?? null,
    inviterName: profileResult.data?.name?.trim() || null,
    inviterRole: profileResult.data?.department?.trim() || null,
    status: invitation.status,
    expiresAt: invitation.expires_at,
  })
}
