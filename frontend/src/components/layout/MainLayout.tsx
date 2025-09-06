'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './Sidebar';
import { Button } from '@/components/ui/button';
import { LogOut, User, ChevronDown, Bell, Search } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="hidden lg:block">
                <h1 className="text-2xl font-bold text-gray-900">
                  UnitedMen
                </h1>
                <p className="text-sm text-gray-600">
                  Gestão de Produtos
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Search className="w-4 h-4" />
                <span className="hidden lg:inline">Buscar</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="relative text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left hidden sm:block">
                        <p className="text-sm font-semibold text-gray-900">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-56 bg-white border-gray-200 shadow-lg"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  <DropdownMenuItem className="text-gray-700 hover:bg-gray-100 cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-700 hover:bg-gray-100 cursor-pointer">
                    <Bell className="mr-2 h-4 w-4" />
                    <span>Notificações</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-200" />
                  <DropdownMenuItem 
                    className="text-red-600 hover:bg-red-50 cursor-pointer"
                    onClick={logout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
