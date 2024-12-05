import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Picker } from '@react-native-picker/picker';

// Importing screens
import CurrentWeather from '@/app/(app)/(weather)/currentWeather';
import HourlyWeather from '@/app/(app)/(weather)/hourlyWeather';
import LongtermWeather from '@/app/(app)/(weather)/longtermWeather';

const weather = () => {
  const TopTab = createMaterialTopTabNavigator();

  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const locations = ['Location 1', 'Location 2', 'Location 3']; // Replace with your actual locations

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>

        {/* Picker for selecting location */}
        <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
        <View style={styles.pickerContainer}>
            <Picker
                selectedValue={selectedLocation}
                onValueChange={(itemValue) => {
                    setSelectedLocation(itemValue)
                }}
                style={{ fontFamily: 'DMSans', fontSize: 15}}
                dropdownIconColor="#FD47B7"
            >
                {locations.map((location, index) => (
                    <Picker.Item key={index} label={location} value={location} />
                ))}
            </Picker>
        </View>
        </View>

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
  }, 
  pickerContainer: {
    borderColor: 'rgba(253, 71, 183, 0.23)',
    backgroundColor: 'rgba(253, 71, 183, 0.23)',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 0,
    marginVertical: 10,
    minHeight: 40,
  },
})