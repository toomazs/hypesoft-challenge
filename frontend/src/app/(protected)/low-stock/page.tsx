'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Package, Edit2, Plus } from 'lucide-react';
import { apiService } from '@/services/api';
import { Button } from '@/components/ui/button';

interface Product {
  id: string;
  name: string;
  description: string;
  stockQuantity: number;
  price: number;
  categoryId: string;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
}

export default function LowStockPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLowStockProducts();
  }, []);

  const loadLowStockProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getProducts(1, 100);
      console.log('API Response:', response);
      
      let allProducts = [];
      
      if (response && response.data && Array.isArray(response.data)) {
        allProducts = response.data;
      } else {
        console.warn('Estrutura de resposta inesperada:', response);
        allProducts = [];
      }
      
      console.log('All Products:', allProducts);
      
      // Filtrar produtos com estoque baixo (≤ 10 unidades)
      const lowStockProducts = allProducts.filter((product: Product) => {
        const isLowStock = product.stockQuantity <= 10;
        console.log(`Produto ${product.name}: estoque=${product.stockQuantity}, baixo=${isLowStock}`);
        return isLowStock;
      });
      
      console.log('Low Stock Products:', lowStockProducts);
      setProducts(lowStockProducts);
    } catch (err: any) {
      console.error('Erro ao carregar produtos com estoque baixo:', err);
      setError(`Erro ao carregar produtos com estoque baixo: ${err.message || err.toString()}`);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erro</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-8 w-8 text-orange-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Estoque Baixo</h1>
            <p className="text-sm text-gray-500 mt-1">
              {products.length} produto(s) com estoque baixo
            </p>
          </div>
        </div>
        <Button 
          onClick={loadLowStockProducts}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <Package className="h-4 w-4" />
          <span>Atualizar</span>
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Produtos com Estoque Baixo
          </h2>
          <p className="text-sm text-gray-500">
            Produtos que precisam de reabastecimento (estoque ≤ 10 unidades)
          </p>
        </div>

        <div className="p-6">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum produto com estoque baixo
              </h3>
              <p className="text-gray-500">
                Todos os produtos estão com estoque adequado.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estoque Atual
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.categoryName || 'Sem categoria'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`text-sm font-medium ${
                            product.stockQuantity === 0 
                              ? 'text-red-600' 
                              : product.stockQuantity <= 5 
                                ? 'text-orange-600' 
                                : 'text-yellow-600'
                          }`}>
                            {product.stockQuantity}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          R$ {product.price?.toFixed(2).replace('.', ',') || '0,00'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.stockQuantity === 0
                            ? 'bg-red-100 text-red-800'
                            : product.stockQuantity <= 5
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {product.stockQuantity === 0 
                            ? 'Esgotado' 
                            : product.stockQuantity <= 5 
                              ? 'Crítico' 
                              : 'Baixo'
                          }
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}