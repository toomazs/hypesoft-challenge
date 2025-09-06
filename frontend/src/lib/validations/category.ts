import { z } from "zod"

export const categorySchema = z.object({
  name: z.string()
    .min(1, "Nome é obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(50, "Nome deve ter no máximo 50 caracteres"),
  description: z.string()
    .min(1, "Descrição é obrigatória")
    .min(5, "Descrição deve ter pelo menos 5 caracteres")
    .max(200, "Descrição deve ter no máximo 200 caracteres"),
})

export const createCategorySchema = categorySchema

export const updateCategorySchema = categorySchema.extend({
  id: z.string().min(1, "ID é obrigatório")
})

export type CategoryFormData = z.infer<typeof categorySchema>
export type CreateCategoryData = z.infer<typeof createCategorySchema>
export type UpdateCategoryData = z.infer<typeof updateCategorySchema>