'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Product } from '@/types';
import { useUpdateStock } from '@/hooks/useProducts';
import { Loader2 } from 'lucide-react';

const stockUpdateSchema = z.object({
  quantity: z.number()
    .min(0, 'A quantidade não pode ser negativa')
    .max(999999, 'Quantidade muito alta'),
});

type StockUpdateData = z.infer<typeof stockUpdateSchema>;

interface StockUpdateDialogProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function StockUpdateDialog({ product, isOpen, onClose }: StockUpdateDialogProps) {
  const updateStock = useUpdateStock();

  const form = useForm<StockUpdateData>({
    resolver: zodResolver(stockUpdateSchema),
    defaultValues: {
      quantity: 0,
    },
  });

  React.useEffect(() => {
    if (product) {
      form.reset({ quantity: product.stockQuantity });
    }
  }, [product, form]);

  const handleSubmit = async (data: StockUpdateData) => {
    if (!product) return;

    try {
      await updateStock.mutateAsync({
        id: product.id,
        quantity: data.quantity,
      });
      onClose();
    } catch (error) {
    }
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Atualizar Estoque</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Produto: <strong>{product.name}</strong>
          </p>
          <p className="text-sm text-muted-foreground">
            Estoque atual: <strong>{product.stockQuantity} unidades</strong>
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova Quantidade</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Digite a nova quantidade"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={updateStock.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={updateStock.isPending}
              >
                {updateStock.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Atualizar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}