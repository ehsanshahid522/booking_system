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
    } else {
      // User is logged in, direct them based on role
      if (user.role === 'admin') {
        if (!inAdmin) { // Check if not in admin
          router.replace('/(admin)' as any);
        }
      } else if (user.role === 'barber') {
        // Direct new barbers to setup their shop info
        if (!user.shopName) {
          if (!inBarber || segments[1] !== 'onboarding') { // Check if not in barber or not on onboarding
            router.replace('/(barber)/onboarding' as any);
          }
        } else {
          if (!inBarber || segments.length === 1) { // If in barber but not on a specific route, or not in barber at all
            router.replace('/(barber)' as any);
          }
        }
      } else if (user.role === 'customer') {
        if (!inCustomer) {
          router.replace('/(customer)' as any);
        }
      }
      // Add more role-based redirection logic here if needed
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
