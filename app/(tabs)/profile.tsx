import { ScrollView, StyleSheet, Text, View, Image, ImageBackground, SafeAreaView } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { Link } from 'expo-router'
import CustomButton from '@/components/CustomButton'



const profile = () => {

  return (
    <ScrollView style={styles.wrapper}>
    <SafeAreaView>
      <View style={{ width: '100%' }}>
        <Image
          source={require('@/assets/images/green_rectangle.png')}
          style={styles.topImage}
          resizeMode="cover"
        />
        <Image
          source={require('@/assets/images/secured_by_polkadot.png')}
          style={styles.topImageOverlay}
          resizeMode="contain"
        />
      </View>

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

      <View style={styles.textContainer}>
        <Text style={styles.text}>Don't know what Polkadot is?</Text>
        <Text style={styles.textLink}> <Link href='https://polkadot.network/'>Click here to learn more.</Link></Text>
      </View>

      <View style={{ alignItems: 'center', marginTop: 200 }}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={{ width: 300, height: 70 }}
          resizeMode="contain"
        />
      </View>

      <View style={styles.textContainer2}>
                <Text style={styles.text2}>Want to support our app?</Text>
                <CustomButton 
                  title='Donate' 
                  onPress={() => {console.log('tap')} }
                  containerStyles={{ height: 55, marginTop: 10 }}
                  textStyles={{ fontSize: 18, fontFamily: 'DMSans' }}
                />
                <CustomButton 
                  title='Log out' 
                  onPress={() => {console.log('tap')}} 
                  containerStyles={{ backgroundColor: '#145E2F', height: 55, marginTop: 30 }}
                  textStyles={{ fontSize: 18, fontFamily: 'DMSans' }}
                />
              </View>
      <StatusBar style="light" backgroundColor='#145E2F'/>
    </SafeAreaView>
    </ScrollView>
  )
}

export default profile

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    flex: 1,
  },
  textContainer: {
    marginTop: 60,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  textContainer2: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 18,
    fontFamily: 'DMSans',
  },
  text2: {
    fontSize: 18,
    fontFamily: 'DMSans',
    marginTop: 40,
  },
  textLink: {
    fontSize: 18,
    fontFamily: 'DMSans',
    color: '#FD47B7',
    textDecorationLine: 'underline',
  },
  topImage: {
    width: '100%',
    height: 100,
    position: 'absolute',
    top: 0,
  },
  topImageOverlay: {
    alignSelf: 'center',
    top: 40,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    position: 'absolute',
    marginTop: 50,
  },
  sideImage: {
    width: 150,
    height: 450,
  },
})