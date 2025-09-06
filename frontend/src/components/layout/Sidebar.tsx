'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Package, 
  Tag,
  Store,
  AlertTriangle
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const navigation = [
  { name: 'nav.dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'nav.products', href: '/products', icon: Package },
  { name: 'nav.categories', href: '/categories', icon: Tag },
  { name: 'nav.lowStock', href: '/low-stock', icon: AlertTriangle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <div className="w-64 h-screen bg-white shadow-xl border-r border-gray-100 flex flex-col">
      <div className="px-6 py-8 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
            <Store className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {t('nav.brand')}
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              {t('nav.brandSubtitle')}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center px-4 py-3.5 text-sm font-semibold rounded-xl transition-all duration-300 ease-in-out relative overflow-hidden',
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-600/30'
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                )}
              >
                <item.icon 
                  className={cn(
                    'mr-3 h-5 w-5 transition-all duration-300',
                    isActive 
                      ? 'text-white' 
                      : 'text-gray-400 group-hover:text-purple-600'
                  )} 
                />
                <span className="tracking-wide">
                  {t(item.name)}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="px-4 pb-6">
        <div className="px-4 py-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="text-center space-y-1">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg mx-auto flex items-center justify-center mb-2">
              <Store className="w-4 h-4 text-white" />
            </div>
            <p className="text-xs font-bold text-gray-800">
              {t('nav.brand')}
            </p>
            <p className="text-xs text-gray-500 leading-tight">
              {t('nav.copyright')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}