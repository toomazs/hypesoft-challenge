'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import { Category, Product, CreateCategoryRequest, UpdateCategoryRequest } from '@/types';
import { formatDateTime } from '@/lib/utils';
import { 
  Tag, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { CategoryForm } from '@/components/categories/CategoryForm';
import { toast } from '@/components/ui/use-toast';

export default function CategoriesPage() {
  const [search, setSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  const { data: productsData } = useProducts(1, 1000); // Get all products to count by category
  
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const categories = categoriesData || [];
  const products = productsData?.data || [];

  // Filter categories based on search
  const filteredCategories = categories.filter((category: Category) =>
    category.name.toLowerCase().includes(search.toLowerCase()) ||
    category.description?.toLowerCase().includes(search.toLowerCase())
  );

  // Count products by category
  const getCategoryProductCount = (categoryId: string) => {
    return products.filter((product: Product) => product.categoryId === categoryId).length;
  };

  const handleCreateCategory = async (categoryData: CreateCategoryRequest) => {
    try {
      await createCategoryMutation.mutateAsync(categoryData);
      setIsCreateModalOpen(false);
      toast({
        title: 'Sucesso!',
        description: 'Categoria criada com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro!',
        description: 'Erro ao criar categoria.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateCategory = async (categoryData: UpdateCategoryRequest) => {
    try {
      await updateCategoryMutation.mutateAsync(categoryData);
      setEditingCategory(null);
      toast({
        title: 'Sucesso!',
        description: 'Categoria atualizada com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro!',
        description: 'Erro ao atualizar categoria.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const productCount = getCategoryProductCount(categoryId);
    
    if (productCount > 0) {
      toast({
        title: 'Erro!',
        description: `Não é possível excluir esta categoria pois ela possui ${productCount} produto(s) associado(s).`,
        variant: 'destructive',
      });
      return;
    }

    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        await deleteCategoryMutation.mutateAsync(categoryId);
        toast({
          title: 'Sucesso!',
          description: 'Categoria excluída com sucesso.',
        });
      } catch (error) {
        toast({
          title: 'Erro!',
          description: 'Erro ao excluir categoria.',
          variant: 'destructive',
        });
      }
    }
  };

  if (categoriesError) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="p-6">
          <div className="text-center space-y-2">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
            <h3 className="text-lg font-semibold text-gray-900">Erro ao carregar categorias</h3>
            <p className="text-gray-600">Não foi possível carregar a lista de categorias.</p>
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categorias</h1>
          <p className="text-gray-600">
            Organize seus produtos em categorias para melhor gestão
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Categoria
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Categorias</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">
              Categorias cadastradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos Categorizados</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">
              Produtos com categoria
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média por Categoria</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.length > 0 ? Math.round(products.length / categories.length) : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Produtos por categoria
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Pesquisar</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar categorias por nome ou descrição..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Tag className="h-5 w-5" />
                <span>Categorias Cadastradas</span>
              </CardTitle>
              <CardDescription>
                {categoriesLoading ? 'Carregando...' : `${filteredCategories.length} categoria(s) encontrada(s)`}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {categoriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-32 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {search ? 'Nenhuma categoria encontrada' : 'Nenhuma categoria cadastrada'}
              </h3>
              <p className="text-gray-500">
                {search 
                  ? 'Tente buscar com outros termos.' 
                  : 'Comece criando sua primeira categoria de produtos.'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCategories.map((category: Category) => {
                const productCount = getCategoryProductCount(category.id);
                return (
                  <Card key={category.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Tag className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{category.name}</CardTitle>
                            <Badge variant="secondary">
                              {productCount} produto(s)
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingCategory(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-600 hover:text-red-800"
                            disabled={productCount > 0}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {category.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                      
                      <div className="text-xs text-gray-500">
                        <p>Criada em: {formatDateTime(category.createdAt)}</p>
                        {category.updatedAt !== category.createdAt && (
                          <p>Atualizada: {formatDateTime(category.updatedAt)}</p>
                        )}
                      </div>
                      
                      {productCount > 0 && (
                        <div className="pt-2 border-t">
                          <div className="flex items-center space-x-2">
                            <Package className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              Contém {productCount} produto(s)
                            </span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Category Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Categoria</DialogTitle>
            <DialogDescription>
              Crie uma nova categoria para organizar seus produtos
            </DialogDescription>
          </DialogHeader>
          <CategoryForm
            onSubmit={(data) => {
              if ('id' in data) {
                return handleUpdateCategory(data as UpdateCategoryRequest);
              } else {
                return handleCreateCategory(data as CreateCategoryRequest);
              }
            }}
            onCancel={() => setIsCreateModalOpen(false)}
            isLoading={createCategoryMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Category Modal */}
      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Categoria</DialogTitle>
            <DialogDescription>
              Atualize as informações da categoria
            </DialogDescription>
          </DialogHeader>
          {editingCategory && (
            <CategoryForm
              category={editingCategory}
              onSubmit={(data) => {
                if ('id' in data) {
                  return handleUpdateCategory(data as UpdateCategoryRequest);
                } else {
                  return handleCreateCategory(data as CreateCategoryRequest);
                }
              }}
              onCancel={() => setEditingCategory(null)}
              isLoading={updateCategoryMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}