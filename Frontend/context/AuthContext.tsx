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
  refreshUser: () => Promise<void>;
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
      setUser(response.data.data.user || response.data.data);
    } catch (e) {
      console.error('Failed to load user', e);
      await AsyncStorage.removeItem('auth_token');
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string): Promise<boolean> {
    try {
      const res = await apiClient.post('/auth/login', { 
        email: email.trim(), 
        password: password.trim() 
      });
      const { user, token } = res.data.data;
      await AsyncStorage.setItem('auth_token', token);
      setUser(user);
      return true;
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      Alert.alert('Login Error', msg);
      console.error('Login error:', msg);
      return false;
    }
  }

  async function signup(name: string, email: string, password: string, role: UserRole, phone?: string): Promise<boolean> {
    try {
      const res = await apiClient.post('/auth/signup', { 
        name: name.trim(), 
        email: email.trim(), 
        password: password.trim(), 
        role, 
        phone: phone?.trim() 
      });
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
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, refreshUser: loadUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
