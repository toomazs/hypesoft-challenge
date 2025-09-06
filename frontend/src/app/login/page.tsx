'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, Shield, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login, isLoading, error } = useAuth();
  const router = useRouter();
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleKeycloakLogin = async () => {
    setLoginError(null);
    try {
      await login();
    } catch (err) {
      setLoginError('Erro ao fazer login. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Features */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">ShopSense</h1>
                  <p className="text-lg text-gray-600">Sistema de Gestão de Produtos</p>
                </div>
              </div>
              
              <p className="text-gray-600 text-lg leading-relaxed">
                Gerencie seu estoque, produtos e categorias com uma interface moderna e intuitiva. 
                Controle total sobre seu negócio com relatórios em tempo real.
              </p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center space-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Bem-vindo de volta
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Faça login para acessar o ShopSense Dashboard
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {(error || loginError) && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>{error || loginError}</span>
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  <Button
                    onClick={handleKeycloakLogin}
                    disabled={isLoading}
                    className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-medium text-base shadow-lg shadow-purple-600/25 transition-all duration-200"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Entrando...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Shield className="w-5 h-5" />
                        <span>Entrar</span>
                      </div>
                    )}
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Desafio Técnico Hypesoft
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Sistema de Gestão de Produtos
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}