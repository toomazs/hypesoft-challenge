'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useDevAuth } from '@/contexts/DevAuthProvider';
import MainLayout from '@/components/layout/MainLayout';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use the appropriate auth hook based on environment
  const isDevelopment = process.env.NODE_ENV === 'development';
  const auth = isDevelopment ? useDevAuth() : useAuth();
  const { isAuthenticated, isLoading } = auth;
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <MainLayout>{children}</MainLayout>;
}
