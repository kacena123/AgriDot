import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

// Importing screens
import MyGuides from '@/app/(app)/(guides)/myGuides';
import Guides from '@/app/(app)/(guides)/guides';


const guides = () => {
  const TopTab = createMaterialTopTabNavigator();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Top tab navigation */}
      <TopTab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 16, fontFamily: 'DMSans', color: '#145E2F', textTransform: 'none' },
          tabBarStyle: { backgroundColor: 'white' },
          tabBarIndicatorStyle: { backgroundColor: '#145E2F' },
        }}
      >
        <TopTab.Screen name="Guides" component={Guides} options={{ title: 'Guides' }} />
        <TopTab.Screen name="MyGuides" component={MyGuides} options={{ title: 'My Guides' }} />
      </TopTab.Navigator>

      <StatusBar
          style="light"
          backgroundColor='#145E2F'
          translucent={false}  // Prevents status bar from overlaying the app content
          animated={true}  // Smooth transition when changing status bar properties
        />
    </SafeAreaView>
  )
}

export default guides

const styles = StyleSheet.create({
  ccontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})