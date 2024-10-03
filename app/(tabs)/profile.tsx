import { ScrollView, StyleSheet, Text, View, Image, ImageBackground  } from 'react-native'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { Link } from 'expo-router'
import CustomButton from '@/components/CustomButton'



const profile = () => {

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className='bg-white h-full'>
        
        <ScrollView contentContainerStyle={{height: '100%'}}>
        <ImageBackground source={require('@/assets/images/profil_screen2.png')} >
          
          <View className="w-full h-full items-center py-20">
            <View className='items-center'>
              <Text style={styles.text}>Don't know what Polkadot is?</Text>
              <Text style={styles.textLink}> <Link href='https://polkadot.network/'>Click here to learn more.</Link></Text>
            </View>
            <View className="w-full" style={{ flex: 1, justifyContent: 'flex-end' }}>
              <View className='items-center w-full px-6'>
                <Text style={styles.text2}>Want to support our app?</Text>
                <CustomButton 
                  title='Donate' 
                  onPress={() => {console.log('tap')} }
                  containerStyles={{ height: 55 }}
                  textStyles={{ fontSize: 18, fontFamily: 'DMSans' }}
                />
                <CustomButton 
                  title='Log out' 
                  onPress={() => {console.log('tap')}} 
                  containerStyles={{ backgroundColor: '#145E2F', height: 55 }}
                  textStyles={{ fontSize: 18, fontFamily: 'DMSans' }}
                />
              </View>
            </View>
          </View>
          <StatusBar style="light" backgroundColor='#145E2F'/>
          </ImageBackground>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default profile

const styles = StyleSheet.create({
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
  
})