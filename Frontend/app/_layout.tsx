import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/Colors';

function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuth = segments[0] === '(auth)';
    const inCustomer = segments[0] === '(customer)';
    const inBarber = segments[0] === '(barber)';
    const inAdmin = segments[0] === '(admin)';

    if (!user) {
      if (!inAuth) router.replace('/(auth)/onboarding' as any);
    } else if (user.role === 'customer' && !inCustomer) {
      router.replace('/(customer)' as any);
    } else if (user.role === 'barber' && !inBarber) {
      router.replace('/(barber)' as any);
    } else if (user.role === 'admin' && !inAdmin) {
      router.replace('/(admin)' as any);
    }
  }, [user, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.gold} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
