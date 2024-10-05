import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NearbyPests = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Nearby Pests</Text>
    </View>
  );
};

export default NearbyPests;

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