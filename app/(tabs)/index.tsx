import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Fields = () => {
  return (
    <View style={styles.container}>
      <Text>Fields</Text>
    </View>
  )
}

export default Fields

const styles = StyleSheet.create({
  container:{
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})