'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import Keycloak from 'keycloak-js';
import { apiService } from '@/services/api';

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: () => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [keycloak, setKeycloak] = useState<Keycloak | null>(null);

  const initializeKeycloak = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const keycloakConfig = {
        url: 'http://localhost:8080', // Acesso direto ao Keycloak
        realm: 'hypesoft',
        clientId: 'hypesoft-frontend'
      };

      console.log('Initializing Keycloak with config:', keycloakConfig);

      const keycloakInstance = new Keycloak(keycloakConfig);
      const authenticated = await keycloakInstance.init({
        onLoad: 'check-sso',
        checkLoginIframe: false,
        checkLoginIframeInterval: 5,
        pkceMethod: 'S256',
        enableLogging: true
      });

      console.log('Keycloak initialized:', { authenticated });

      setKeycloak(keycloakInstance);
      
      apiService.setKeycloak(keycloakInstance);

      if (authenticated) {
        setIsAuthenticated(true);
        
        const tokenParsed = keycloakInstance.tokenParsed;
        
        const userData: User = {
          id: tokenParsed?.sub || '',
          username: tokenParsed?.preferred_username || '',
          email: tokenParsed?.email || '',
          firstName: tokenParsed?.given_name || '',
          lastName: tokenParsed?.family_name || '',
          roles: tokenParsed?.realm_access?.roles || []
        };

        setUser(userData);
        console.log('User authenticated:', userData);
      } else {
        console.log('User not authenticated');
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (err) {
      console.error('Keycloak initialization error:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    if (keycloak) {
      try {
        await keycloak.login({
          redirectUri: window.location.origin + '/dashboard'
        });
      } catch (err) {
        console.error('Login error:', err);
        setError(err instanceof Error ? err.message : 'Login failed');
      }
    }
  };

  const logout = async () => {
    if (keycloak) {
      try {
        await keycloak.logout({
          redirectUri: window.location.origin
        });
      } catch (err) {
        console.error('Logout error:', err);
        setError(err instanceof Error ? err.message : 'Logout failed');
      }
    }
  };

  const checkAuth = async (): Promise<boolean> => {
    if (keycloak) {
      try {
        const authenticated = await keycloak.updateToken(30);
        if (authenticated) {
          setIsAuthenticated(true);
          return true;
        } else {
          setIsAuthenticated(false);
          setUser(null);
          return false;
        }
      } catch (err) {
        console.error('Token update error:', err);
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }
    }
    return false;
  };

  const getToken = async (): Promise<string | null> => {
    if (keycloak && keycloak.authenticated) {
      try {
        await keycloak.updateToken(30);
        return keycloak.token || null;
      } catch (err) {
        console.error('Token refresh error:', err);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    initializeKeycloak();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    checkAuth,
    getToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};