import { Metadata } from "next"
import AddProjectForm from "@/features/projects/components/add-project-form"

export const metadata: Metadata = {
  title: "Add New Project",
}

export default function AddProjectPage() {
  return <AddProjectForm />
}