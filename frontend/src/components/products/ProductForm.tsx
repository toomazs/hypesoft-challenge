'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Category, Product, CreateProductRequest, UpdateProductRequest } from '@/types';
import { ProductFormData, productSchema } from '@/lib/validations/product';
import { Loader2 } from 'lucide-react';

interface ProductFormProps {
  categories: Category[];
  product?: Product;
  onSubmit: (data: CreateProductRequest | UpdateProductRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProductForm({ 
  categories, 
  product, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: ProductFormProps) {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      stockQuantity: 0,
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description,
        price: product.price,
        categoryId: product.categoryId,
        stockQuantity: product.stockQuantity,
      });
    }
  }, [product, form]);

  const handleFormSubmit = (data: ProductFormData) => {
    if (product) {
      onSubmit({
        id: product.id,
        ...data,
      } as UpdateProductRequest);
    } else {
      onSubmit(data as CreateProductRequest);
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
              <FormLabel>Nome do Produto *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: iPhone 14 Pro"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva as características do produto..."
                  disabled={isLoading}
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço (R$) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    disabled={isLoading}
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stockQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade em Estoque *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    disabled={isLoading}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria *</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            {product ? 'Atualizar' : 'Criar'} Produto
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