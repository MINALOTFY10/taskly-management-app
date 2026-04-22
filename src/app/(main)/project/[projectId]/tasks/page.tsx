import type { Metadata } from "next"
import { notFound } from "next/navigation"

import TasksBoardPage from "@/features/tasks/components/board/tasks-board-page"
import { getProjectById } from "@/features/projects/queries"
import { getTasksByProjectId } from "@/features/tasks/queries"

type TasksPageProps = {
    params: Promise<{ projectId: string }>
    searchParams: Promise<{ view?: string }>
}

export async function generateMetadata({
    params,
}: TasksPageProps): Promise<Metadata> {
    const { projectId } = await params
    const { data } = await getProjectById(projectId)

    return {
        title: data ? `${data.name} — Tasks` : "Project Tasks",
    }
}

export default async function TasksPage({ params }: TasksPageProps) {
    const { projectId } = await params

    const [projectResult, tasksResult] = await Promise.all([
        getProjectById(projectId),
        getTasksByProjectId(projectId),
    ])

    if (projectResult.error) {
        throw new Error(projectResult.error)
    }

    if (projectResult.notFound || !projectResult.data) {
        notFound()
    }

    if (tasksResult.error) {
        throw new Error(tasksResult.error)
    }

    return (
        <TasksBoardPage
            projectId={projectId}
            projectName={projectResult.data.name}
            tasks={tasksResult.data}
        />
    )
}