import { z } from "zod"

export const productSchema = z.object({
  name: z.string()
    .min(1, "Nome é obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  description: z.string()
    .min(1, "Descrição é obrigatória")
    .min(10, "Descrição deve ter pelo menos 10 caracteres")
    .max(1000, "Descrição deve ter no máximo 1000 caracteres"),
  price: z.number()
    .min(0.01, "Preço deve ser maior que zero")
    .max(999999.99, "Preço deve ser menor que R$ 1.000.000"),
  categoryId: z.string()
    .min(1, "Categoria é obrigatória"),
  stockQuantity: z.number()
    .int("Quantidade deve ser um número inteiro")
    .min(0, "Quantidade não pode ser negativa")
    .max(999999, "Quantidade deve ser menor que 1.000.000"),
})

export const createProductSchema = productSchema

export const updateProductSchema = productSchema.extend({
  id: z.string().min(1, "ID é obrigatório")
})

export type ProductFormData = z.infer<typeof productSchema>
export type CreateProductData = z.infer<typeof createProductSchema>
export type UpdateProductData = z.infer<typeof updateProductSchema>