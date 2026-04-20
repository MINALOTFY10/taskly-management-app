import type { Metadata } from "next"
import { notFound } from "next/navigation"

import ProjectMembersError from "@/features/projects/components/members/project-members-error"
import ProjectMembersPage from "@/features/projects/components/members/project-members-page"
import { getProjectById, getProjectMembers } from "@/features/projects/queries"

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

    const [projectResult, membersResult] = await Promise.all([
        getProjectById(projectId),
        getProjectMembers(projectId),
    ])

    if (projectResult.error) {
        throw new Error(projectResult.error)
    }

    if (projectResult.notFound || !projectResult.data) {
        notFound()
    }

    if (membersResult.error) {
        return (
            <ProjectMembersError
                projectId={projectId}
                message="Failed to load project members. Please try again."
            />
        )
    }

    return (
        <ProjectMembersPage
            projectName={projectResult.data.name}
            members={membersResult.data}
        />
    )
}