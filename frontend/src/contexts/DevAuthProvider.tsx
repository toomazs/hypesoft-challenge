'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types';

const DevAuthContext = createContext<AuthContextType | undefined>(undefined);

interface DevAuthProviderProps {
  children: React.ReactNode;
}

// Fake user for development
const DEV_USER: User = {
  id: 'dev-user-1',
  email: 'dev@hypesoft.com',
  name: 'Developer User',
  roles: ['admin', 'user']
};

export const DevAuthProvider: React.FC<DevAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      console.log('Development mode: Using fake authentication');
      setIsLoading(false);
      // Auto-login in dev mode
      setUser(DEV_USER);
      setIsAuthenticated(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const login = async () => {
    console.log('Development login - automatically authenticated');
    setUser(DEV_USER);
    setIsAuthenticated(true);
    setError(null);
  };

  const logout = () => {
    console.log('Development logout');
    setUser(null);
    setIsAuthenticated(false);
  };

  const checkAuth = async () => {
    if (!user) {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
    error,
    keycloak: null, 
  };

  return (
    <DevAuthContext.Provider value={value}>
      {children}
    </DevAuthContext.Provider>
  );
};

export const useDevAuth = (): AuthContextType => {
  const context = useContext(DevAuthContext);
  if (context === undefined) {
    throw new Error('useDevAuth must be used within a DevAuthProvider');
  }
  return context;
};