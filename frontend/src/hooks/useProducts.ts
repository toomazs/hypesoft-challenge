import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { Product, CreateProductRequest, UpdateProductRequest } from '@/types';
import { toast } from '@/components/ui/use-toast';

export const useProducts = (page = 1, pageSize = 10, search?: string, categoryId?: string) => {
  return useQuery({
    queryKey: ['products', page, pageSize, search, categoryId],
    queryFn: () => apiService.getProducts(page, pageSize, search, categoryId),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => apiService.getProductById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: CreateProductRequest) => apiService.createProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast({
        title: 'Sucesso!',
        description: 'Produto criado com sucesso.',
        variant: 'default',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro!',
        description: error.response?.data?.message || 'Erro ao criar produto.',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...product }: UpdateProductRequest) => 
      apiService.updateProduct(id, product),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast({
        title: 'Sucesso!',
        description: 'Produto atualizado com sucesso.',
        variant: 'default',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro!',
        description: error.response?.data?.message || 'Erro ao atualizar produto.',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast({
        title: 'Sucesso!',
        description: 'Produto excluído com sucesso.',
        variant: 'default',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro!',
        description: error.response?.data?.message || 'Erro ao excluir produto.',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) => 
      apiService.updateStock(id, quantity),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast({
        title: 'Sucesso!',
        description: 'Estoque atualizado com sucesso.',
        variant: 'default',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro!',
        description: error.response?.data?.message || 'Erro ao atualizar estoque.',
        variant: 'destructive',
      });
    },
  });
};

export const useLowStockProducts = (threshold: number = 10) => {
  return useQuery({
    queryKey: ['products', 'low-stock', threshold],
    queryFn: async () => {
      // Get all products and filter by low stock
      const response = await apiService.getProducts(1, 1000); // Get all products
      const products = response.data || [];
      
      console.log('Low stock hook - response:', response);
      console.log('Low stock hook - products:', products);
      console.log('Low stock hook - threshold:', threshold);
      
      if (Array.isArray(products)) {
        const lowStockProducts = products.filter((product: Product) => product.stockQuantity <= threshold);
        console.log('Low stock hook - filtered products:', lowStockProducts);
        return lowStockProducts;
      }
      
      return [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - more frequent updates for stock
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};
