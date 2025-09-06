'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface DashboardStatsProps {
  stats: {
    totalProducts: number;
    totalCategories: number;
    totalRevenue: number;
    totalOrders: number;
    lowStockProducts: number;
    recentSales: number;
  };
  isLoading?: boolean;
}

export function DashboardStats({ stats, isLoading }: DashboardStatsProps) {
  const statCards = [
    {
      title: 'Total de Produtos',
      value: stats.totalProducts,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Categorias',
      value: stats.totalCategories,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Receita Total',
      value: formatCurrency(stats.totalRevenue),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      isMonetary: true,
    },
    {
      title: 'Pedidos',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium bg-gray-200 h-4 w-24 rounded"></CardTitle>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-200 h-8 w-16 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stat.isMonetary ? stat.value : stat.value.toLocaleString()}
              </div>
              {stat.title === 'Total de Produtos' && stats.lowStockProducts > 0 && (
                <p className="text-xs text-red-600 mt-1">
                  {stats.lowStockProducts} produto(s) com estoque baixo
                </p>
              )}
              {stat.title === 'Receita Total' && (
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.recentSales} vendas recentes
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}