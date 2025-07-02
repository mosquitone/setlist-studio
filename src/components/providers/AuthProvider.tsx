'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { secureAuthClient } from '@/lib/client/secure-auth-client';
import { User } from '@/types/entities';
import { AuthResponse } from '@/types/api';

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: User | null;
  login: (token: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 既存の認証状態を取得（重複APIコールを避けるため）
    const currentState = secureAuthClient.getState();
    setIsLoggedIn(currentState.authenticated);
    setUser(currentState.user);
    setIsLoading(currentState.loading);

    // 認証状態の変更をリッスン
    const unsubscribe = secureAuthClient.subscribe((authState) => {
      setIsLoggedIn(authState.authenticated);
      setUser(authState.user);
      setIsLoading(authState.loading);
    });

    return unsubscribe;
  }, []);

  const login = async (token: string) => {
    // secureAuthClientが状態を更新し、subscribeで自動的に反映される
    return await secureAuthClient.login(token);
  };

  const logout = async () => {
    await secureAuthClient.logout();
    // 状態はsecureAuthClientのsubscribeで自動的に更新される
    window.location.reload();
  };

  const value = {
    isLoggedIn,
    isLoading,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
