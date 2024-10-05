import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MyPests = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>My Pests</Text>
    </View>
  );
};

export default MyPests;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});