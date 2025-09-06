'use client';

import React, { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryName: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface DashboardStats {
  totalProducts: number;
  totalValue: number;
}

export default function TestDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data...');
        
        // Fetch products
        const productsResponse = await fetch('http://localhost:3000/api/products');
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          console.log('Products data:', productsData);
          if (productsData.success && productsData.data && productsData.data.data) {
            setProducts(productsData.data.data);
          }
        } else {
          console.error('Products fetch failed:', productsResponse.status);
        }

        // Fetch categories
        const categoriesResponse = await fetch('http://localhost:3000/api/categories');
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          console.log('Categories data:', categoriesData);
          if (categoriesData.success && categoriesData.data) {
            setCategories(categoriesData.data);
          }
        } else {
          console.error('Categories fetch failed:', categoriesResponse.status);
        }

        // Fetch dashboard stats
        const dashboardResponse = await fetch('http://localhost:3000/api/dashboard/stats');
        if (dashboardResponse.ok) {
          const dashboardData = await dashboardResponse.json();
          console.log('Dashboard data:', dashboardData);
          if (dashboardData.success && dashboardData.data) {
            setDashboardStats(dashboardData.data);
          }
        } else {
          console.error('Dashboard fetch failed:', dashboardResponse.status);
        }

      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Dashboard (Sem Auth)</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Erro: {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total de Produtos</h3>
            <p className="text-2xl font-bold text-gray-900">{dashboardStats?.totalProducts || products.length}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total de Categorias</h3>
            <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Valor Total</h3>
            <p className="text-2xl font-bold text-gray-900">
              R$ {dashboardStats?.totalValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Categorias ({categories.length})</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div key={category.id} className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.description}</p>
                  <p className="text-sm text-blue-600 mt-2">
                    Criado em: {new Date(category.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Produtos ({products.length})</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.slice(0, 9).map((product) => (
                <div key={product.id} className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-green-600">
                      R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-sm text-gray-500">
                      Estoque: {product.stockQuantity}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    Categoria: {product.categoryName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-8 bg-gray-100 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Debug Info</h3>
          <div className="text-sm text-gray-600">
            <p>Produtos carregados: {products.length}</p>
            <p>Categorias carregadas: {categories.length}</p>
            <p>Dashboard stats: {dashboardStats ? 'Carregado' : 'Não carregado'}</p>
            <p>API URL: http://localhost:3000/api</p>
          </div>
        </div>
      </div>
    </div>
  );
}