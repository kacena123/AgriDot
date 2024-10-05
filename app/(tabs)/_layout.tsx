import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
    screenOptions={{
      // Set the background color of the tab bar
      tabBarStyle: {
        backgroundColor: '#145E2F', // Custom background color
        borderTopWidth: 0, // Remove tab bar border
      },
      // Set the color for active and inactive icons
      tabBarActiveTintColor: '#ffff', // Active icon color
      tabBarInactiveTintColor: '#a2bdac', // Inactive icon color
      // Set the active and inactive text color (same as icon color)
      tabBarLabelStyle: {
        fontSize: 11,
        fontFamily: 'DMSans',
      },
      // Hide the header if desired
      headerShown: false,
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Fields',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? 'flower' : 'flower-outline'}
              color={focused ? '#ffff' : '#a2bdac'} // Different colors for focused/unfocused
            />
          ),
        }}
      />
      <Tabs.Screen
        name="weather"
        options={{
          title: 'Weather',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? 'partly-sunny' : 'partly-sunny-outline'}
              color={focused ? '#ffff' : '#a2bdac'} // Different colors for focused/unfocused
            />
          ),
        }}
      />
      <Tabs.Screen
        name="pests"
        options={{
          title: 'Pests',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? 'bug' : 'bug-outline'}
              color={focused ? '#ffff' : '#a2bdac'} // Different colors for focused/unfocused
            />
          ),
        }}
      />
      <Tabs.Screen
        name="guides"
        options={{
          title: 'Guides',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? 'book' : 'book-outline'}
              color={focused ? '#ffff' : '#a2bdac'} // Different colors for focused/unfocused
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? 'person' : 'person-outline'}
              color={focused ? '#ffff' : '#a2bdac'} // Different colors for focused/unfocused
            />
          ),
        }}
      />
    </Tabs>
  );
}
