import { z } from "zod"

function getTodayDateOnly() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

function parseIsoDateOnly(value: string) {
  const [year, month, day] = value.split("-").map(Number)

  if (!year || !month || !day) {
    return null
  }

  return new Date(year, month - 1, day)
}

export const createEpicSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title is required (minimum 3 characters).")
    .max(120, "Title must be at most 120 characters."),

  description: z
    .string()
    .trim()
    .max(500, "Description must be at most 500 characters.")
    .optional(),

  assigneeUserId: z.string().trim().optional(),

  deadline: z
    .string()
    .trim()
    .optional()
    .refine((value) => {
      if (!value) return true

      const parsed = parseIsoDateOnly(value)
      if (!parsed) return false

      return parsed >= getTodayDateOnly()
    }, "Deadline must be today or a future date."),
})

export type CreateEpicFormValues = z.infer<typeof createEpicSchema>

export const updateEpicSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Title is required (minimum 3 characters).")
      .max(120, "Title must be at most 120 characters.")
      .optional(),

    description: z
      .union([
        z.string().trim().max(500, "Description must be at most 500 characters."),
        z.null(),
      ])
      .optional(),

    assigneeUserId: z.union([z.string().trim().min(1), z.null()]).optional(),

    deadline: z
      .union([
        z
          .string()
          .trim()
          .refine((value) => {
            const parsed = parseIsoDateOnly(value)
            if (!parsed) return false
            return parsed >= getTodayDateOnly()
          }, "Deadline must be today or a future date."),
        z.null(),
      ])
      .optional(),
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: "At least one field is required.",
  })

export type UpdateEpicFormValues = z.infer<typeof updateEpicSchema>
