import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    DMSans: require('../assets/fonts/DMSans.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        
        {/* Tabs Navigator */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* Field stack - No bottom tab navigation here */}
        <Stack.Screen 
          name="(field)/addField" 
          options={{ headerShown: true, title: 'New Field', 
            headerStyle: {
              backgroundColor: '#145E2F',
            },
            headerTintColor: '#fff', 
            headerTitleStyle: {
              fontFamily: 'DMSans', 
              fontSize: 20, 
            },
           }} 
        />

        {/* Field stack - No bottom tab navigation here */}
        <Stack.Screen 
          name="(field)/detailField" 
          options={{ headerShown: true, title: 'Detail Field', 
            headerStyle: {
              backgroundColor: '#145E2F',
            },
            headerTintColor: '#fff', 
            headerTitleStyle: {
              fontFamily: 'DMSans', 
              fontSize: 20, 
            },
           }} 
        />
          
        {/* Not Found */}
        <Stack.Screen name="+not-found" />

      </Stack>
    </ThemeProvider>
  );
}
