import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useAuthStore } from '@/stores/authStore';
import "../global.css";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useAuth();
  useSubscription();
  const { session, isLoading, profile } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      // Redirect to welcome if not signed in and not in auth group
      router.replace('/(auth)/welcome');
    } else if (session && inAuthGroup) {
      // If we are in auth group but have a session, check onboarding
      if (profile && !profile.onboarding_completed) {
        router.replace('/(auth)/onboarding/step-1');
      } else if (profile?.onboarding_completed) {
        router.replace('/(tabs)/today');
      }
    } else if (session && !inAuthGroup && profile && !profile.onboarding_completed) {
      // If signed in but not finished onboarding, force onboarding
      router.replace('/(auth)/onboarding/step-1');
    }
  }, [session, segments, isLoading, profile?.onboarding_completed]);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
