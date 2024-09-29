import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const profile = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView>
        <ScrollView contentContainerStyle={{height: '100%'}}>
          <View style={styles.container}>
            <Text>Profile</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default profile

const styles = StyleSheet.create({
  container:{
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 80,
  },
})