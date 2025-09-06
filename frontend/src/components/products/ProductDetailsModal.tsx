'use client';

import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { Package, Calendar, DollarSign, Archive, Tag } from 'lucide-react';

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailsModal({ product, isOpen, onClose }: ProductDetailsModalProps) {
  if (!product) return null;

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) {
      return { label: 'Sem Estoque', color: 'destructive' as const };
    } else if (quantity < 10) {
      return { label: 'Estoque Baixo', color: 'secondary' as const };
    } else {
      return { label: 'Em Estoque', color: 'default' as const };
    }
  };

  const stockStatus = getStockStatus(product.stockQuantity);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-blue-600" />
            <span>Detalhes do Produto</span>
          </DialogTitle>
          <DialogDescription>
            Informações completas sobre o produto selecionado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Header */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
          </div>

          {/* Product Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <DollarSign className="h-4 w-4" />
                <span>Preço</span>
              </div>
              <p className="font-semibold text-lg text-gray-900">
                {formatCurrency(product.price)}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Archive className="h-4 w-4" />
                <span>Estoque</span>
              </div>
              <div className="flex items-center space-x-2">
                <p className="font-semibold text-lg text-gray-900">
                  {product.stockQuantity}
                </p>
                <Badge 
                  variant={stockStatus.color}
                  className={stockStatus.color === 'secondary' ? 'bg-orange-100 text-orange-800' : ''}
                >
                  {stockStatus.label}
                </Badge>
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Tag className="h-4 w-4" />
              <span>Categoria</span>
            </div>
            <Badge variant="outline" className="w-fit">
              {product.categoryName}
            </Badge>
          </div>

          {/* Timestamps */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2 text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Criado em</span>
              </div>
              <span className="text-gray-900">{formatDateTime(product.createdAt)}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2 text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Última atualização</span>
              </div>
              <span className="text-gray-900">{formatDateTime(product.updatedAt)}</span>
            </div>
          </div>

          {product.stockQuantity < 10 && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 text-xs">!</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-orange-800">
                    Alerta de Estoque
                  </h4>
                  <p className="text-sm text-orange-700 mt-1">
                    Este produto está com estoque baixo. Considere reabastecer em breve.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Valor total em estoque</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(product.price * product.stockQuantity)}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}