import { Metadata } from "next"
import { getProjects } from "@/features/projects/queries"
import ProjectListPage from "@/features/projects/components/project-list-page"

export const metadata: Metadata = {
  title: "Projects",
}

export default async function ProjectPage() {
  const { data, error } = await getProjects()

  return <ProjectListPage projects={data} hasError={Boolean(error)} />
}