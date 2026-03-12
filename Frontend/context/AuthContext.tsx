import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserRole = 'customer' | 'barber' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  initials: string;
  color: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

const MOCK_USERS: Record<UserRole, User> = {
  customer: {
    id: 'c1', name: 'Ali Raza', email: 'customer@test.com',
    phone: '+92 300 1234567', role: 'customer', initials: 'AR', color: '#1E88E5',
  },
  barber: {
    id: 'b1', name: 'Ahmed Ali', email: 'barber@test.com',
    phone: '+92 311 9876543', role: 'barber', initials: 'AA', color: '#C9A84C',
  },
  admin: {
    id: 'a1', name: 'Shop Owner', email: 'admin@test.com',
    phone: '+92 321 5555555', role: 'admin', initials: 'SO', color: '#E53935',
  },
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const stored = await AsyncStorage.getItem('auth_user');
      if (stored) setUser(JSON.parse(stored));
    } catch (e) {
      console.error('Failed to load user', e);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string, role: UserRole): Promise<boolean> {
    // Mock auth – accept any non-empty email/password
    if (!email.trim() || !password.trim()) return false;
    const mockUser = { ...MOCK_USERS[role], email: email.trim() };
    setUser(mockUser);
    await AsyncStorage.setItem('auth_user', JSON.stringify(mockUser));
    return true;
  }

  async function logout() {
    setUser(null);
    await AsyncStorage.removeItem('auth_user');
  }

  function updateUser(data: Partial<User>) {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    AsyncStorage.setItem('auth_user', JSON.stringify(updated));
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
