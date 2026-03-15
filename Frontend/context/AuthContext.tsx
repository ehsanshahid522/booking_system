import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '@/api/client';
import { Alert } from 'react-native';

export type UserRole = 'customer' | 'barber' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  profileImage?: string;
  shopName?: string;
  shopLocation?: string;
  specialization?: string;
  rating?: number;
  reviewCount?: number;
  experience?: number;
  workingHours?: string;
  bio?: string;
  daysAvailable?: string[];
  status?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: UserRole, phone?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      const response = await apiClient.get('/auth/me');
      setUser(response.data.data);
    } catch (e) {
      console.error('Failed to load user', e);
      await AsyncStorage.removeItem('auth_token');
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string): Promise<boolean> {
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      const { user, token } = res.data.data;
      await AsyncStorage.setItem('auth_token', token);
      setUser(user);
      return true;
    } catch (error: any) {
      console.error('Login error:', error.response?.data?.message || error.message);
      return false;
    }
  }

  async function signup(name: string, email: string, password: string, role: UserRole, phone?: string): Promise<boolean> {
    try {
      const res = await apiClient.post('/auth/signup', { name, email, password, role, phone });
      const { user, token } = res.data.data;
      await AsyncStorage.setItem('auth_token', token);
      setUser(user);
      return true;
    } catch (error: any) {
      Alert.alert('Signup Error', error.response?.data?.message || 'Something went wrong');
      return false;
    }
  }

  async function logout() {
    setUser(null);
    await AsyncStorage.removeItem('auth_token');
  }

  function updateUser(data: Partial<User>) {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
