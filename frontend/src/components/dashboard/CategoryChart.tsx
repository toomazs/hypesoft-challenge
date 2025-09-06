'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

interface CategoryData {
  name: string;
  products: number;
  sales: number;
  color?: string;
}

interface CategoryChartProps {
  data: CategoryData[];
  isLoading?: boolean;
  type?: 'pie' | 'bar';
}

const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
];

export function CategoryChart({ data, isLoading, type = 'pie' }: CategoryChartProps) {
  const dataWithColors = data.map((item, index) => ({
    ...item,
    color: item.color || COLORS[index % COLORS.length]
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border rounded-lg shadow-lg p-3">
          <p className="font-medium">{data.name}</p>
          <p className="text-blue-600">{`Produtos: ${data.products}`}</p>
          <p className="text-green-600">{`Vendas: R$ ${data.sales.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white border rounded-lg shadow-lg p-3">
          <p className="font-medium">{data.name}</p>
          <p className="text-blue-600">{`Produtos: ${data.value}`}</p>
          <p className="text-gray-600">{`${data.percent.toFixed(1)}% do total`}</p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="bg-gray-200 h-6 w-40 rounded animate-pulse"></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-gray-100 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {type === 'pie' ? 'Distribuição por Categoria' : 'Produtos por Categoria'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            {type === 'pie' ? (
              <PieChart>
                <Pie
                  data={dataWithColors}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="products"
                >
                  {dataWithColors.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            ) : (
              <BarChart data={dataWithColors} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="products" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {type === 'pie' && (
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {dataWithColors.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="truncate">{item.name}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}