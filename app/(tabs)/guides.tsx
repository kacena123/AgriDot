import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const guides = () => {
  return (
    <View style={styles.container}>
      <Text>Guides</Text>
    </View>
  )
}

export default guides

const styles = StyleSheet.create({
  container:{
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})