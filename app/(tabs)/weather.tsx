import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

// Importing screens
import CurrentWeather from '@/app/(weather)/currentWeather';
import HourlyWeather from '@/app/(weather)/hourlyWeather';
import LongtermWeather from '@/app/(weather)/longtermWeather';

const weather = () => {
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
        <TopTab.Screen name="CcurrentWeather" component={CurrentWeather} options={{ title: 'Current' }} />
        <TopTab.Screen name="HourlyWeather" component={HourlyWeather} options={{ title: 'Hourly' }} />
        <TopTab.Screen name="LongtermWeather" component={LongtermWeather} options={{ title: 'Long-term' }} />
      </TopTab.Navigator>

      {/* Status bar */}
      <StatusBar
          style="light"
          backgroundColor='#145E2F'
          translucent={false}  // Prevents status bar from overlaying the app content
          animated={true}  // Smooth transition when changing status bar properties
        />
    </SafeAreaView>
  )
}

export default weather

const styles = StyleSheet.create({
  container:{
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})