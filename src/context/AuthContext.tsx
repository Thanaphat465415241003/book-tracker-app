// src/context/AuthContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type AuthContextType = {
  userToken: string | null;
  loading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = 'auth_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const t = await AsyncStorage.getItem(TOKEN_KEY);
        setUserToken(t);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signIn = async (token: string) => {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    setUserToken(token);
    // ตัวอย่าง: เข้าสู่แท็บหลักหลังล็อกอิน
    router.replace('/(tabs)/HomeScreen');
  };

  const signOut = async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    setUserToken(null);
    // พาไปหน้า Login
    router.replace('/(auth)/login');
  };

  const value = useMemo(() => ({ userToken, loading, signIn, signOut }), [userToken, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
