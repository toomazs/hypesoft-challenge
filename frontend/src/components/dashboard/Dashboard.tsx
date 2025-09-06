'use client';

import React from 'react';
import { DashboardStats } from './DashboardStats';
import { SalesChart } from './SalesChart';
import { CategoryChart } from './CategoryChart';
import { useDashboardStats } from '@/hooks/useDashboard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const mockSalesData = [
  { date: '2024-01-01', sales: 1200, orders: 15 },
  { date: '2024-01-02', sales: 1800, orders: 22 },
  { date: '2024-01-03', sales: 1500, orders: 18 },
  { date: '2024-01-04', sales: 2200, orders: 28 },
  { date: '2024-01-05', sales: 1900, orders: 24 },
  { date: '2024-01-06', sales: 2500, orders: 32 },
  { date: '2024-01-07', sales: 2100, orders: 26 },
];

const mockCategoryData = [
  { name: 'Eletrônicos', products: 45, sales: 12500 },
  { name: 'Roupas', products: 32, sales: 8500 },
  { name: 'Casa & Jardim', products: 28, sales: 6200 },
  { name: 'Livros', products: 18, sales: 3800 },
  { name: 'Esportes', products: 22, sales: 5500 },
];

export function Dashboard() {
  const { data: stats, isLoading, error } = useDashboardStats();

  const defaultStats = {
    totalProducts: 0,
    totalCategories: 0,
    totalRevenue: 0,
    totalOrders: 0,
    lowStockProducts: 0,
    recentSales: 0,
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar dados do dashboard. Tente novamente em alguns instantes.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Última atualização: {new Date().toLocaleString('pt-BR')}
        </div>
      </div>

      <DashboardStats 
        stats={stats || defaultStats} 
        isLoading={isLoading} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <SalesChart 
            data={mockSalesData} 
            isLoading={isLoading}
            type="area"
          />
        </div>
        
        <CategoryChart 
          data={mockCategoryData} 
          isLoading={isLoading}
          type="pie"
        />
        
        <CategoryChart 
          data={mockCategoryData} 
          isLoading={isLoading}
          type="bar"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Produtos em Alta</h3>
          <p className="text-blue-700">
            {mockCategoryData[0].name} lidera em vendas com {mockCategoryData[0].products} produtos
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900 mb-2">Performance</h3>
          <p className="text-green-700">
            {mockSalesData.reduce((acc, curr) => acc + curr.orders, 0)} pedidos nos últimos 7 dias
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-900 mb-2">Oportunidades</h3>
          <p className="text-purple-700">
            {stats?.lowStockProducts || 0} produtos precisam de reposição de estoque
          </p>
        </div>
      </div>
    </div>
  );
}