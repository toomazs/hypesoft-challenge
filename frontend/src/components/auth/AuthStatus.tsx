import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const AuthStatus: React.FC = () => {
  const { isLoading, error, isAuthenticated, user } = useAuth();

  if (isLoading) {
    return (
      <Alert>
        <AlertDescription>
           Verificando autenticação...
        </AlertDescription>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Erro: {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (isAuthenticated && user) {
    return (
      <Alert>
        <AlertDescription>
           Autenticado como: {user.firstName} {user.lastName} ({user.email})
          <span className="text-xs text-green-600 ml-2">
            [Via Keycloak]
          </span>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert>
      <AlertDescription>
        ℹ Não autenticado - Clique em "Entrar" para autenticar via Keycloak
      </AlertDescription>
    </Alert>
  );
};