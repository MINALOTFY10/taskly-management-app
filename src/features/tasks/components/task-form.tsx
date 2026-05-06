"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarDays, Plus } from "lucide-react"
import { Controller, useForm } from "react-hook-form"

import { FormField } from "@/components/shared/form-field"
import { FormStatusMessage } from "@/components/shared/form-status-message"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  createTaskSchema,
  type CreateTaskFormValues,
} from "@/features/tasks/schemas/validations"
import { TASK_STATUS_VALUES, isTaskStatus } from "@/features/tasks/types"
import { getTaskStatusLabel } from "@/features/tasks/utils/status"

type AssigneeOption = {
  userId: string
  label: string
}

type EpicOption = {
  id: string
  label: string
}

type TaskFormProps = {
  projectName: string
  workspaceName: string
  assigneeOptions: AssigneeOption[]
  epicOptions: EpicOption[]
  initialEpicId?: string
  initialStatus?: string
  apiError: string | null
  isPending?: boolean
  onSubmit: (values: CreateTaskFormValues) => Promise<void>
  onCancel: () => void
}

export default function TaskForm({
  projectName,
  workspaceName,
  assigneeOptions,
  epicOptions,
  initialEpicId,
  initialStatus,
  apiError,
  isPending = false,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const normalizedInitialEpicId =
    initialEpicId && epicOptions.some((epic) => epic.id === initialEpicId)
      ? initialEpicId
      : ""
  const normalizedInitialStatus = isTaskStatus(initialStatus)
    ? initialStatus
    : "TO_DO"

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      status: normalizedInitialStatus,
      epicId: normalizedInitialEpicId,
      assigneeId: "",
      dueDate: "",
      description: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  })

  const isBusy = isSubmitting || isPending

  return (
    <section className="app-page-shell">
      <div className="mx-auto hidden w-full items-start sm:flex">
        <div className="space-y-2">
          <p className="text-[0.6rem] font-bold tracking-widest text-muted-foreground uppercase">
            Projects &gt; {projectName} &gt; Tasks &gt; New Task
          </p>
          <h1 className="mt-3 text-[2rem] leading-none font-semibold tracking-tight text-foreground">
            Create New Task
          </h1>
          <p className="max-w-130 text-xs text-muted-foreground">
            Initialize a new work item within the {workspaceName} Workspace
            ecosystem.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-2 w-full max-w-220 overflow-hidden rounded-lg bg-transparent sm:mt-8 sm:mb-4 sm:border sm:border-border/55 sm:bg-card">
        <div className="px-0 py-2 sm:hidden">
          <h1 className="text-[2rem] leading-none font-semibold tracking-tight text-foreground">
            Create New Task
          </h1>
          <p className="mt-2 max-w-90 text-[0.95rem] leading-6 text-muted-foreground">
            Initialize a new work item within the {workspaceName} ecosystem.
          </p>
        </div>

        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 px-0 py-2 sm:px-7 sm:py-6"
          aria-describedby="task-form-status"
        >
          <FormField
            label="Title"
            htmlFor="task-title"
            required
            error={errors.title?.message}
            errorId="task-title-error"
          >
            <Input
              id="task-title"
              placeholder="e.g., Finalize structural schematics"
              maxLength={200}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? "task-title-error" : undefined}
              className="h-12 border-transparent bg-surface-highest px-3 text-sm shadow-none sm:h-10"
              {...register("title")}
            />
          </FormField>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField
              label="Status"
              htmlFor="task-status"
              required
              error={errors.status?.message}
              errorId="task-status-error"
            >
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="task-status"
                      aria-invalid={Boolean(errors.status)}
                      aria-describedby={
                        errors.status ? "task-status-error" : undefined
                      }
                      className="h-12 w-full border-transparent bg-surface-highest px-3 text-sm shadow-none sm:h-10"
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="mt-10">
                      {TASK_STATUS_VALUES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {getTaskStatusLabel(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            <FormField
              label="Assignee"
              htmlFor="task-assignee"
              trailingLabel="Optional"
              error={errors.assigneeId?.message}
              errorId="task-assignee-error"
            >
              <Controller
                name="assigneeId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || "unassigned"}
                    onValueChange={(value) =>
                      field.onChange(value === "unassigned" ? "" : value)
                    }
                  >
                    <SelectTrigger
                      id="task-assignee"
                      aria-invalid={Boolean(errors.assigneeId)}
                      aria-describedby={
                        errors.assigneeId ? "task-assignee-error" : undefined
                      }
                      className="h-12 w-full border-transparent bg-surface-highest px-3 text-sm shadow-none sm:h-10"
                    >
                      <SelectValue placeholder="Select Team Member" />
                    </SelectTrigger>
                    <SelectContent className="mt-10">
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {assigneeOptions.map((assignee) => (
                        <SelectItem
                          key={assignee.userId}
                          value={assignee.userId}
                        >
                          {assignee.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </div>

          <FormField
            label="Epic"
            htmlFor="task-epic"
            trailingLabel="Optional"
            error={errors.epicId?.message}
            errorId="task-epic-error"
          >
            <Controller
              name="epicId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || "none"}
                  onValueChange={(value) =>
                    field.onChange(value === "none" ? "" : value)
                  }
                >
                  <SelectTrigger
                    id="task-epic"
                    aria-invalid={Boolean(errors.epicId)}
                    aria-describedby={
                      errors.epicId ? "task-epic-error" : undefined
                    }
                    className="h-12 w-full border-transparent bg-surface-highest px-3 text-sm shadow-none sm:h-10"
                  >
                    <SelectValue placeholder="Select Epic Link" />
                  </SelectTrigger>

                  <SelectContent
                    position="popper"
                    className="mt-2 max-h-50 overflow-y-auto"
                  >
                    <SelectItem value="none">No Epic</SelectItem>
                    {epicOptions.map((epic) => (
                      <SelectItem key={epic.id} value={epic.id}>
                        {epic.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>

          <FormField
            label="Due Date"
            htmlFor="task-due-date"
            trailingLabel="Optional"
            error={errors.dueDate?.message}
            errorId="task-due-date-error"
          >
            <div className="relative">
              <Input
                id="task-due-date"
                type="datetime-local"
                step={60}
                aria-invalid={Boolean(errors.dueDate)}
                aria-describedby={
                  errors.dueDate ? "task-due-date-error" : undefined
                }
                className="h-12 border-transparent bg-surface-highest px-3 text-sm shadow-none sm:h-10"
                {...register("dueDate")}
              />
            </div>
          </FormField>

          <FormField
            label="Description"
            htmlFor="task-description"
            trailingLabel="Optional"
            error={errors.description?.message}
            errorId="task-description-error"
          >
            <textarea
              id="task-description"
              maxLength={2000}
              placeholder="Provide detailed context for this task..."
              aria-invalid={Boolean(errors.description)}
              aria-describedby={
                errors.description ? "task-description-error" : undefined
              }
              className="min-h-36 w-full resize-none rounded-md border border-transparent bg-surface-highest px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-3 focus:ring-primary/20 sm:min-h-32"
              {...register("description")}
            />
          </FormField>

          <FormStatusMessage id="task-form-status" message={apiError} />

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-end">
            <Button
              type="submit"
              size="lg"
              className="order-1 h-10 w-full min-w-36 px-5 text-[13px] font-semibold shadow-[0_8px_20px_rgba(0,50,184,0.18)] sm:order-2 sm:w-auto"
              disabled={isBusy}
            >
              <Plus className="size-4" />
              {isBusy ? "Creating..." : "Create Task"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="order-2 h-9 px-3 text-[13px] font-semibold text-primary hover:text-primary/85 sm:order-1 sm:text-muted-foreground sm:hover:text-foreground"
              onClick={onCancel}
              disabled={isBusy}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}
