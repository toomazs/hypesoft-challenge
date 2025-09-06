'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/types';
import { CategoryFormData, categorySchema } from '@/lib/validations/category';
import { Loader2 } from 'lucide-react';

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: CreateCategoryRequest | UpdateCategoryRequest) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CategoryForm({ 
  category, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: CategoryFormProps) {
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        description: category.description || '',
      });
    }
  }, [category, form]);

  const handleFormSubmit = async (data: CategoryFormData) => {
    if (category) {
      await onSubmit({
        id: category.id,
        ...data,
      } as UpdateCategoryRequest);
    } else {
      await onSubmit(data as CreateCategoryRequest);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Categoria *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Eletrônicos, Roupas, Casa..."
                  disabled={isLoading}
                  maxLength={50}
                  {...field}
                />
              </FormControl>
              <p className="text-xs text-gray-500">
                {field.value.length}/50 caracteres
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva que tipos de produtos pertencem a esta categoria..."
                  disabled={isLoading}
                  rows={3}
                  maxLength={200}
                  {...field}
                />
              </FormControl>
              <p className="text-xs text-gray-500">
                {field.value.length}/200 caracteres (opcional)
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex space-x-2 pt-4">
          <Button
            type="submit"
            disabled={isLoading || form.formState.isSubmitting}
            className="flex-1"
          >
            {(isLoading || form.formState.isSubmitting) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {category ? 'Atualizar' : 'Criar'} Categoria
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading || form.formState.isSubmitting}
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}