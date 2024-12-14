import { Redirect, Stack } from 'expo-router';
import { Text } from 'react-native';
import React from 'react';
import { useFonts } from 'expo-font';
import LogInScreen from '@/app/login';

import { useSession } from '@/context/ctx';


export default function AppLayout() {
  
  const [loaded] = useFonts({
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
    DMSans: require('@/assets/fonts/DMSans.ttf'),
  });
  
  if (!loaded) return null;
  
  

  const { session, isLoading } = useSession();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/login" />;
  }

  // If authenticated, allow access to the protected routes.
  return (
    <Stack>
      {/* Protected routes go here */}

      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }} 
      />

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

        {/* Add Guide */}
        <Stack.Screen 
          name="(guides)/addGuide" 
          options={{ headerShown: true, title: 'New Guide', 
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

        {/* Detail Guide */}
        <Stack.Screen 
          name="(guides)/detailGuide" 
          options={{ headerShown: true, title: 'Detail Guide', 
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

        {/* Report Guide */}
        <Stack.Screen 
          name="(guides)/reportGuide" 
          options={{ headerShown: true, title: 'Report Guide', 
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
  );
}