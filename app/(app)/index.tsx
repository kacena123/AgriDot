import { View, Text, StyleSheet, ImageBackground, SafeAreaView, Image } from 'react-native';
import { router } from 'expo-router';
import React from 'react';
import CustomButton from '@/components/CustomButton';

export default function WelcomeScreen() {
  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.imageRow}>
        <ImageBackground
          source={require('@/assets/images/Polygon1.png')}
          style={styles.sideImage}
          resizeMode="contain"
        />
        <ImageBackground
          source={require('@/assets/images/Polygon2.png')}
          style={styles.sideImage}
          resizeMode="contain"
          />
      </View>
      <View style={styles.container}>
        {/* <Text style={styles.title}>Welcome to</Text> */}
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <Image
            source={require('@/assets/images/Welcome_logo.png')}
            style={{ width: 400, height: 160 }}
            resizeMode="contain"
          />
        </View>
        <CustomButton
          title='Continue to app'
          onPress={() => router.replace('/(app)/(tabs)')}
          containerStyles={{ height: 55, marginBottom: 20 }}
          textStyles={{ fontSize: 20, fontFamily: 'DMSans' }}
          />
      </View>
      <View style={{ alignItems: 'center' }}>
          <Image
            source={require('@/assets/images/Secured_by_polkadot_white.png')}
            style={{ width: 200, height: 80 }}
            resizeMode="contain"
          />
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 300,
    padding: 25,
  },
  title: {
    fontSize: 35,
    marginBottom: 20,
    fontFamily: 'DMSans',
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    position: 'absolute',
    marginTop: -130,
  },
  sideImage: {
    width: 180,
    height: 550,
  },
});