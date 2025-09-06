'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface SalesData {
  date: string;
  sales: number;
  orders: number;
}

interface SalesChartProps {
  data: SalesData[];
  isLoading?: boolean;
  type?: 'line' | 'area';
}

export function SalesChart({ data, isLoading, type = 'area' }: SalesChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border rounded-lg shadow-lg p-3">
          <p className="font-medium">{`Data: ${label}`}</p>
          <p className="text-blue-600">
            {`Vendas: ${formatCurrency(payload[0].value)}`}
          </p>
          <p className="text-green-600">
            {`Pedidos: ${payload[1]?.value || 0}`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="bg-gray-200 h-6 w-32 rounded animate-pulse"></CardTitle>
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
        <CardTitle>Vendas dos Últimos 30 Dias</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            {type === 'area' ? (
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getDate()}/${date.getMonth() + 1}`;
                  }}
                />
                <YAxis 
                  yAxisId="sales"
                  orientation="left"
                  tickFormatter={(value) => `R$ ${value}`}
                />
                <YAxis 
                  yAxisId="orders"
                  orientation="right"
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  yAxisId="sales"
                  type="monotone"
                  dataKey="sales"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </AreaChart>
            ) : (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getDate()}/${date.getMonth() + 1}`;
                  }}
                />
                <YAxis 
                  yAxisId="sales"
                  orientation="left"
                  tickFormatter={(value) => `R$ ${value}`}
                />
                <YAxis 
                  yAxisId="orders"
                  orientation="right"
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  yAxisId="sales"
                  type="monotone"
                  dataKey="sales"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  yAxisId="orders"
                  type="monotone"
                  dataKey="orders"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}