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
              <Text className='text-xl'>Don't know what Polkadot is?</Text>
              <Text className='text-xl text-pink-500 underline'> <Link href='https://polkadot.network/'>Click here to learn more.</Link></Text>
            </View>
            <View className="w-full" style={{ flex: 1, justifyContent: 'flex-end' }}>
              <View className='items-center w-full px-6'>
                <Text className='text-xl'>Want to support our app?</Text>
                <CustomButton title='Donate' onPress={() => {console.log('tap')}}/>
                <CustomButton title='Log out' onPress={() => {console.log('tap')}} containerStyles={{ backgroundColor: '#145E2F' }}/>
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
  
})