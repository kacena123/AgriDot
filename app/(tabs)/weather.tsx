import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const weather = () => {
  return (
    <View style={styles.container}>
      <Text>Weather</Text>
    </View>
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