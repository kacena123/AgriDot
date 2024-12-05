import { StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

// Importing screens
import MyPests from '@/app/(app)/(pests)/myPests';
import NearbyPests from '@/app/(app)/(pests)/nearbyPests';


const pests = () => {
  const TopTab = createMaterialTopTabNavigator();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Top tab navigation for "My Pests" and "Nearby Pests" */}
      <TopTab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 16, fontFamily: 'DMSans', color: '#145E2F', textTransform: 'none' },
          tabBarStyle: { backgroundColor: 'white' },
          tabBarIndicatorStyle: { backgroundColor: '#145E2F' },
        }}
      >
        <TopTab.Screen name="NearbyPests" component={NearbyPests} options={{ title: 'Nearby Pests' }} />
        <TopTab.Screen name="MyPests" component={MyPests} options={{ title: 'My Pests' }} />
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

export default pests

const styles = StyleSheet.create({
  ccontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})