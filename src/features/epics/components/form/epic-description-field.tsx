import type {
  Control,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form"
import { useWatch } from "react-hook-form"
import { FormField } from "@/components/shared/form-field"
import type { CreateEpicFormValues } from "@/features/epics/schemas/validations"

type Props = {
  register: UseFormRegister<CreateEpicFormValues>
  errors: FieldErrors<CreateEpicFormValues>
  control: Control<CreateEpicFormValues>
}

export function EpicDescriptionField({ register, errors, control }: Props) {
  const value = useWatch({ control, name: "description" }) ?? ""

  return (
    <FormField
      label="Description"
      htmlFor="epic-description"
      hint="Optional"
      error={errors.description?.message}
    >
      <textarea
        id="epic-description"
        maxLength={500}
        className="min-h-44 w-full resize-none rounded-md border border-transparent bg-surface-highest px-4 py-3 text-base outline-none"
        {...register("description")}
      />

      <p className="text-right text-xs font-semibold text-muted-foreground">
        {value.length} / 500
      </p>
    </FormField>
  )
}
