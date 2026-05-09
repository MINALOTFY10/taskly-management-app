import type { Metadata } from "next"

import ProjectMembersError from "@/features/members/components/project-members-error"
import ProjectMembersPage from "@/features/members/components/project-members-page"
import { getProjectById } from "@/features/projects/queries"
import { getCurrentUserRole, getProjectMembers } from "@/features/members/queries"
import { assertProjectExists } from "@/lib/project-guards"

type MembersPageProps = {
    params: Promise<{ projectId: string }>
}

export async function generateMetadata({
    params,
}: MembersPageProps): Promise<Metadata> {
    const { projectId } = await params
    const { data } = await getProjectById(projectId)

    return {
        title: data ? `${data.name} Members` : "Project Members",
    }
}

export default async function MembersPage({ params }: MembersPageProps) {
    const { projectId } = await params

    const [projectResult, membersResult, roleResult] = await Promise.all([
        getProjectById(projectId),
        getProjectMembers(projectId),
        getCurrentUserRole(projectId),
    ])

    assertProjectExists(projectResult)

    if (membersResult.error) {
        return (
            <ProjectMembersError
                projectId={projectId}
                message="Failed to load project members. Please try again."
            />
        )
    }

    const currentUserId = roleResult.userId
    const currentUserRole = roleResult.role

    return (
        <ProjectMembersPage
            projectId={projectId}
            projectName={projectResult.data.name}
            members={membersResult.data}
            currentUserId={currentUserId}
            currentUserRole={currentUserRole}
        />
    )
}