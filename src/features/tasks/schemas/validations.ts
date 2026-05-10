import { z } from "zod"

import { TASK_STATUS_VALUES } from "@/features/tasks/types"

function isValidDateTime(value: string) {
  return !Number.isNaN(Date.parse(value))
}

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title is required (minimum 3 characters).")
    .max(200, "Title must be at most 200 characters."),

  status: z.enum(TASK_STATUS_VALUES),

  epicId: z.string().trim().optional(),

  description: z
    .string()
    .trim()
    .max(2000, "Description must be at most 2000 characters.")
    .optional(),

  assigneeId: z.string().trim().optional(),

  dueDate: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || isValidDateTime(value), "Invalid due date."),
})

export type CreateTaskFormValues = z.infer<typeof createTaskSchema>

export const updateTaskSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Title is required (minimum 3 characters).")
      .max(200, "Title must be at most 200 characters.")
      .optional(),

    status: z.enum(TASK_STATUS_VALUES).optional(),

    description: z
      .union([
        z
          .string()
          .trim()
          .max(2000, "Description must be at most 2000 characters."),
        z.null(),
      ])
      .optional(),

    dueDate: z
      .union([
        z.string().trim().refine((value) => isValidDateTime(value), "Invalid due date."),
        z.null(),
      ])
      .optional(),
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: "At least one field is required.",
  })

export type UpdateTaskFormValues = z.infer<typeof updateTaskSchema>
