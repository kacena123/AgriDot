import { StyleSheet, Text, View, SafeAreaView, ScrollView, ImageBackground, Image } from 'react-native'
import React from 'react'

const CurrentWeather = () => {
  return (
    <ScrollView style={styles.wrapper}>
    <SafeAreaView>
      <View style={styles.imageRow}>
        <ImageBackground
          source={require('@/assets/images/Polygon1_1.png')}
          style={styles.sideImage}
          resizeMode="contain"
        />
        <ImageBackground
          source={require('@/assets/images/Polygon2_1.png')}
          style={styles.sideImage}
          resizeMode="contain"
        />
      </View>
      <View>
        <Text style={{marginTop: 450}}>Current Weather</Text>
      </View>
    </SafeAreaView>
    </ScrollView>
  )
}

export default CurrentWeather

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    flex: 1,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    position: 'absolute',
  },
  sideImage: {
    width: 180,
    height: 450,
  },
  
})