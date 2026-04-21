"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { CircleCheckBig, Lightbulb } from "lucide-react"
import { useMemo } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"

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
  createEpicSchema,
  type CreateEpicFormValues,
} from "@/features/epics/schemas/validations"

type AssigneeOption = {
  userId: string
  label: string
}

type EpicFormProps = {
  projectName: string
  assigneeOptions: AssigneeOption[]
  apiError: string | null
  isPending?: boolean
  onSubmit: (values: CreateEpicFormValues) => Promise<void>
  onCancel: () => void
}

function getTodayIsoDate() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export default function EpicForm({
  projectName,
  assigneeOptions,
  apiError,
  isPending = false,
  onSubmit,
  onCancel,
}: EpicFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateEpicFormValues>({
    resolver: zodResolver(createEpicSchema),
    defaultValues: {
      title: "",
      description: "",
      assigneeUserId: "",
      deadline: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  })

  const todayDate = useMemo(() => getTodayIsoDate(), [])
  const descriptionValue = useWatch({ control, name: "description" }) ?? ""

  const isBusy = isSubmitting || isPending

  return (
    <section className="px-5 py-5 sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto hidden w-full items-start sm:flex">
        <div className="space-y-2">
          <p className="text-[0.6rem] font-bold uppercase text-muted-foreground tracking-widest">
            Projects › {projectName} › Epics › New Epic
          </p>
          <h1 className="mt-4 text-[2.2rem] leading-none font-semibold tracking-tight text-foreground">
            Create New Epic
          </h1>
        </div>
      </div>

      <div className="mx-auto mt-4 w-full max-w-220 overflow-hidden rounded-md bg-transparent sm:mt-10 sm:mb-5 sm:border sm:border-border/55 sm:bg-card">
        <div className="px-0 py-5 sm:border-b sm:border-border/60 sm:px-8 sm:py-8">
          <div className="flex items-start gap-4">
            <div className="hidden size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:flex">
              <CircleCheckBig className="size-7" />
            </div>

            <div>
              <h2 className="text-[1.70rem] leading-none font-bold text-foreground sm:text-[1.4rem]">
                New Epic
              </h2>
              <p className="mt-1 max-w-125 text-[0.8rem] leading-snug text-muted-foreground sm:text-[0.9rem]">
                Define a major milestone and group related tasks.
              </p>
            </div>
          </div>
        </div>

        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 px-0 py-5 sm:px-8 sm:py-7"
          aria-describedby="epic-form-status"
        >
          <FormField
            label="Title"
            htmlFor="epic-title"
            required
            hint="Minimum 3 characters required"
            error={errors.title?.message}
            errorId="epic-title-error"
          >
            <Input
              id="epic-title"
              placeholder="e.g. Structural Foundation Phase"
              maxLength={120}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? "epic-title-error" : undefined}
              className="h-14 border-transparent bg-surface-highest px-4 text-base shadow-none sm:h-12"
              {...register("title")}
            />
          </FormField>

          <FormField
            label="Description"
            htmlFor="epic-description"
            trailingLabel="Optional"
            error={errors.description?.message}
            errorId="epic-description-error"
          >
            <textarea
              id="epic-description"
              maxLength={500}
              placeholder="Outline the key scope, outcomes, and milestones of this epic..."
              aria-invalid={Boolean(errors.description)}
              aria-describedby={
                errors.description
                  ? "epic-description-error"
                  : "epic-description-char-count"
              }
              className="min-h-44 w-full resize-none rounded-md border border-transparent bg-surface-highest px-4 py-3 text-base outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-3 focus:ring-primary/20 sm:min-h-36"
              {...register("description")}
            />

            <p
              id="epic-description-char-count"
              className="text-right text-xs font-semibold text-muted-foreground"
              aria-live="polite"
              aria-atomic="true"
            >
              <span className="sm:hidden">{descriptionValue.length} / 500</span>
              <span className="hidden sm:inline">
                {descriptionValue.length} / 500 characters
              </span>
            </p>
          </FormField>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormField
              label="Assignee"
              htmlFor="epic-assignee"
              trailingLabel="Optional"
              error={errors.assigneeUserId?.message}
              errorId="epic-assignee-error"
            >
              <Controller
                name="assigneeUserId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || "unassigned"}
                    onValueChange={(value) =>
                      field.onChange(value === "unassigned" ? "" : value)
                    }
                  >
                    <SelectTrigger
                      id="epic-assignee"
                      aria-invalid={Boolean(errors.assigneeUserId)}
                      aria-describedby={
                        errors.assigneeUserId ? "epic-assignee-error" : undefined
                      }
                      className="h-14 w-full border-transparent bg-surface-highest px-4 text-base shadow-none sm:h-12"
                    >
                      <SelectValue placeholder="Select a member..." />
                    </SelectTrigger>
                    <SelectContent className="mt-18 bg-primary/20 text-black">
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {assigneeOptions.map((assignee) => (
                        <SelectItem key={assignee.userId} value={assignee.userId}>
                          {assignee.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            <FormField
              label="Deadline"
              htmlFor="epic-deadline"
              trailingLabel="Optional"
              error={errors.deadline?.message}
              errorId="epic-deadline-error"
            >
              <Input
                id="epic-deadline"
                type="date"
                min={todayDate}
                aria-invalid={Boolean(errors.deadline)}
                aria-describedby={errors.deadline ? "epic-deadline-error" : undefined}
                className="h-14 border-transparent bg-surface-highest px-4 text-base shadow-none sm:h-12"
                {...register("deadline")}
              />
            </FormField>
          </div>

          <FormStatusMessage id="epic-form-status" message={apiError} />

          <div className="flex flex-col-reverse gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              className="h-11 px-4 text-[14px] font-semibold text-primary hover:text-primary/85 sm:text-muted-foreground sm:hover:text-foreground"
              onClick={onCancel}
              disabled={isBusy}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              size="lg"
              className="h-12 w-full min-w-40 px-6 text-[14px] font-semibold shadow-[0_8px_20px_rgba(0,50,184,0.18)] sm:w-auto"
              disabled={isBusy}
            >
              {isBusy ? "Creating..." : "Create Epic"}
            </Button>
          </div>
        </form>

        <div className="mt-3 rounded-lg bg-surface-high px-4 py-4 sm:mt-0 sm:rounded-none sm:border-t sm:border-border/60 sm:px-8">
          <p className="flex items-start gap-2 text-sm text-muted-foreground">
            <Lightbulb
              className="mt-0.5 size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <span>
              <span className="font-bold text-foreground/80">Pro Tip</span>
              <span className="hidden sm:inline">
                : You can assign tasks and set sprint goals after creation.
              </span>
              <span className="sm:hidden">
                {" "}
                You can assign tasks and set sprint goals after creation.
              </span>
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}