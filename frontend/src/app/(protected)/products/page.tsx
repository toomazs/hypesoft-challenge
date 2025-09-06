'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { Product, CreateProductRequest, Category } from '@/types';
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Filter,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<CreateProductRequest>({
    name: '',
    description: '',
    price: 0,
    categoryId: '',
    stockQuantity: 0,
  });

  const { data: productsData, isLoading } = useProducts(currentPage, 10, searchTerm, selectedCategory);
  const { data: categoriesData } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const products = productsData?.data || [];
  const totalPages = productsData?.totalPages || 1;
  const categories = categoriesData || [];

  const handleCreateProduct = async () => {
    if (!formData.name || !formData.description || formData.price <= 0 || !formData.categoryId || formData.stockQuantity < 0) {
      toast({
        title: 'Erro de validação',
        description: 'Por favor, preencha todos os campos corretamente.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createProduct.mutateAsync(formData);
      setIsCreateModalOpen(false);
      setFormData({
        name: '',
        description: '',
        price: 0,
        categoryId: '',
        stockQuantity: 0,
      });
    } catch (error) {
      console.error('Erro ao criar produto:', error);
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    try {
      await updateProduct.mutateAsync({
        id: editingProduct.id,
        ...formData,
      });
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        categoryId: '',
        stockQuantity: 0,
      });
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await deleteProduct.mutateAsync(id);
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
      }
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId,
      stockQuantity: product.stockQuantity,
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      stockQuantity: 0,
    });
    setEditingProduct(null);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
          <p className="text-gray-600">Gerencie seu catálogo de produtos</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Novo Produto</span>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="">Todas as categorias</option>
              {categories.map((category: Category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setCurrentPage(1);
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Produtos</CardTitle>
          <CardDescription>
            {productsData?.totalCount || 0} produtos encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
              <p className="text-gray-500">Comece criando seu primeiro produto.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product: Product) => (
                <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{product.name}</h4>
                      <p className="text-sm text-gray-500">{product.description}</p>
                      <p className="text-xs text-gray-400">{product.categoryName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-gray-500">Estoque:</span>
                        <span className={`text-sm font-medium ${
                          product.stockQuantity < 10 ? 'text-red-600' : 'text-gray-900'
                        }`}>
                          {product.stockQuantity}
                        </span>
                        {product.stockQuantity < 10 && (
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              
              <span className="text-sm text-gray-600">
                Página {currentPage} de {totalPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Próxima
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      {(isCreateModalOpen || editingProduct) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome do produto"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição do produto"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((category: Category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade em Estoque
                </label>
                <Input
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button
                  onClick={editingProduct ? handleUpdateProduct : handleCreateProduct}
                  className="flex-1"
                  disabled={createProduct.isPending || updateProduct.isPending}
                >
                  {editingProduct ? 'Atualizar' : 'Criar'}
                </Button>
                <Button variant="outline" onClick={resetForm} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
