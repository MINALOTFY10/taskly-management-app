"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  CircleCheckBig,
  Lightbulb,
  UserRoundPlus,
} from "lucide-react"
import { useForm, useWatch } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/shared/form-field"
import { FormStatusMessage } from "@/components/shared/form-status-message"
import {
  createProjectSchema,
  type CreateProjectFormValues,
} from "@/features/projects/schemas/validations"

type ProjectFormContent = {
  breadcrumb: string
  pageTitle: string
  cardTitle: string
  cardDescription: string
  submitLabel: string
  submittingLabel: string
  tipText: string
}

type ProjectFormProps = {
  content: ProjectFormContent
  apiError: string | null
  initialValues?: Partial<CreateProjectFormValues>
  showInviteMemberCta?: boolean
  onSubmit: (values: CreateProjectFormValues) => Promise<void>
  onCancel: () => void
}

export default function ProjectForm({
  content,
  apiError,
  initialValues,
  showInviteMemberCta = false,
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      description: initialValues?.description ?? "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  })

  const descriptionValue = useWatch({ control, name: "description" }) ?? ""

  return (
    <section className="px-5 py-5 sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto hidden w-full items-start justify-between gap-4 sm:flex">
        <div className="space-y-2">
          <p className="text-[0.6rem] font-bold tracking-widest text-muted-foreground uppercase">
            {content.breadcrumb}
          </p>
          <h1 className="mt-4 text-[2.2rem] leading-none font-semibold tracking-tight text-foreground">
            {content.pageTitle}
          </h1>
        </div>

        {showInviteMemberCta && (
          <Button
            type="button"
            size="lg"
            className="mt-auto hidden h-11 px-5 text-[14px] font-semibold shadow-[0_8px_20px_rgba(0,50,184,0.18)] sm:inline-flex"
          >
            <UserRoundPlus className="mr-1 size-4" />
            Invite Member
          </Button>
        )}
      </div>

      <div className="mx-auto mt-4 w-full max-w-220 overflow-hidden rounded-md bg-transparent sm:mt-10 sm:mb-5 sm:border sm:border-border/55 sm:bg-card">
        <div className="px-0 py-5 sm:border-b sm:border-border/60 sm:px-8 sm:py-8">
          <div className="flex items-start gap-4">
            <div className="hidden size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:flex">
              <CircleCheckBig className="size-7" />
            </div>

            <div>
              <h2 className="text-[1.70rem] leading-none font-bold text-foreground sm:text-[1.4rem]">
                {content.cardTitle}
              </h2>
              <p className="mt-1 max-w-125 text-[0.8rem] leading-snug text-muted-foreground sm:text-[0.9rem]">
                {content.cardDescription}
              </p>
            </div>
          </div>
        </div>

        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 px-0 py-5 sm:px-8 sm:py-7"
          aria-describedby="project-form-status"
        >
          <FormField
            label="Project Title"
            htmlFor="project-name"
            required
            error={errors.name?.message}
            errorId="project-name-error"
          >
            <Input
              id="project-name"
              type="text"
              maxLength={100}
              placeholder="Enter project title"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "project-name-error" : undefined}
              className="h-14 border-transparent bg-surface-highest px-4 text-base shadow-none sm:h-12"
              {...register("name")}
            />
          </FormField>

          <FormField
            label="Description"
            htmlFor="project-description"
            trailingLabel="Optional"
            error={errors.description?.message}
            errorId="project-description-error"
          >

            <textarea
              id="project-description"
              maxLength={500}
              placeholder="Provide a high-level overview of the project's architectural objectives and key milestones..."
              aria-invalid={Boolean(errors.description)}
              aria-describedby={
                errors.description
                  ? "project-description-error"
                  : "description-char-count"
              }
              className="min-h-44 w-full resize-none rounded-md border border-transparent bg-surface-highest px-4 py-3 text-base outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-3 focus:ring-primary/20 sm:min-h-36"
              {...register("description")}
            />

            <p
              id="description-char-count"
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

          <FormStatusMessage
            id="project-form-status"
            message={apiError}
          />

          <div className="flex flex-col-reverse gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              className="h-11 px-4 text-[14px] font-semibold text-primary hover:text-primary/85 sm:text-muted-foreground sm:hover:text-foreground"
              onClick={onCancel}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              size="lg"
              className="h-12 w-full min-w-40 px-6 text-[14px] font-semibold shadow-[0_8px_20px_rgba(0,50,184,0.18)] sm:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? content.submittingLabel : content.submitLabel}
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
              <span className="hidden sm:inline">: {content.tipText}</span>
              <span className="sm:hidden"> {content.tipText}</span>
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}