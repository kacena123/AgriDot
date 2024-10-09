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
        
        {/* New field */}
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

        {/* Detail field */}
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

        {/* New crop */}
        <Stack.Screen 
          name="(field)/addCrop" 
          options={{ headerShown: true, title: 'New Crop', 
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

        {/* Crop origin */}
        <Stack.Screen 
          name="(field)/cropOrigin" 
          options={{ headerShown: true, title: 'Crop Origin', 
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

        {/* Pest detail */}
        <Stack.Screen 
          name="(pests)/detailPest" 
          options={{ headerShown: true, title: 'Detail Pest', 
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

        {/* Add Pest */}
        <Stack.Screen 
          name="(pests)/addPest" 
          options={{ headerShown: true, title: 'New Pest', 
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

        {/* Report Pest */}
        <Stack.Screen 
          name="(pests)/reportPest" 
          options={{ headerShown: true, title: 'Mark fake pest report', 
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

        {/* My Pests Filter */}
        <Stack.Screen 
          name="(pests)/myPestsFilter" 
          options={{ headerShown: true, title: 'My Pests Filter', 
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

        {/* All Pests Filter */}
        <Stack.Screen 
          name="(pests)/pestsFilter" 
          options={{ headerShown: true, title: 'Pests Filter', 
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
