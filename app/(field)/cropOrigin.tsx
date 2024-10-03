import { TouchableOpacity, StyleSheet, Text, View, Image, FlatList } from 'react-native'
import React, { useLayoutEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native'
import CustomButton from '@/components/CustomButton';
import RNFS from 'react-native-fs';

const cropOrigin = () => {

    const route = useRoute();
    const navigation = useNavigation();
    const { title } = route.params as { title: string };  // Extract title from route params
    console.log('Title:', title); 

    // Dynamically set the header title
    useLayoutEffect(() => {
        navigation.setOptions({
        headerTitle: title,  // Set the header title to the item's title
        });
    }, [navigation, title]);
    

  return (

    <View style={styles.container}>
      <Text style={styles.text}>Immutable proof of crop origin</Text>
      <Image 
        source={require('@/assets/images/QRcode.png')} 
        style={styles.image} 
        resizeMode="contain"
      />
      <CustomButton 
        title="Download" 
        onPress={() => { /* Your button press logic here */ }}
        containerStyles={{ borderRadius: 30, height: 50, width: 300 }}
        textStyles={{ fontSize: 18 }}
      />
      <Image 
        source={require('@/assets/images/green_rectangle.png')} 
        style={styles.bottomImage} 
        resizeMode="cover"
      />
      <Image 
        source={require('@/assets/images/secured_by_polkadot.png')} 
        style={styles.bottomImageOverlay} 
        resizeMode="contain"
      />
    </View>
  )
}

export default cropOrigin

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'DMSans',
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  bottomImage: {
    width: '100%',
    height: 70,
    position: 'absolute',
    bottom: 0,
  },
  bottomImageOverlay: {
    position: 'absolute',
    bottom: 5,
  },
})