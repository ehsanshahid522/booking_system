import { Redirect } from 'expo-router';

// Redirect to auth flow — the _layout.tsx auth guard will handle routing
// based on login state (logged in → dashboard, logged out → onboarding)
export default function Index() {
  return <Redirect href="/(auth)/onboarding" />;
}
