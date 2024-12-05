// app/_layout.tsx
import React from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFonts } from 'expo-font';
import { SessionProvider, useSession } from '@/context/ctx';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

function useProtectedRoute(session: string | null | undefined) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0]?.includes('(auth)');
    
    if (!session && !inAuthGroup) {
      router.replace('/login');
    } else if (session && inAuthGroup) {
      router.replace('/(app)/(tabs)');
    }
  }, [session, segments]);
}

function RootLayoutNav() {
  const { session } = useSession();
  useProtectedRoute(session);
  
  return <Slot />;
}

export default function Root() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    DMSans: require('../assets/fonts/DMSans.ttf'),
  });
  if (!loaded) return null;

  return (
    <SessionProvider>
      <RootLayoutNav />
    </SessionProvider>
  );
}
