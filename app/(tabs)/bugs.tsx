import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const bugs = () => {
  return (
    <View style={styles.container}>
      <Text>Bugs</Text>
    </View>
  )
}

export default bugs

const styles = StyleSheet.create({
  container:{
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})