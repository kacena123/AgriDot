import React, { useLayoutEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import CustomButton from '@/components/CustomButton';
import ViewShot from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useRouter, useLocalSearchParams } from 'expo-router';

const cropOrigin = () => {

  const router = useRouter();
  const { title } = useLocalSearchParams();

  useLayoutEffect(() => {
      // Instead of navigation.setOptions, use router.setParams
      router.setParams({
          headerTitle: title || 'Field Details',
      });
  }, [title]);

    const viewShotRef = useRef<ViewShot>(null);

    const shareImage = async () => {
        try {
          // Capture the image using ViewShot
          const uri = await viewShotRef.current?.capture();
          
          if (uri) {
            // Create a file path for the saved image
            const fileUri = `${FileSystem.documentDirectory}QRcode.png`;
    
            // Move the captured image to the file system
            await FileSystem.moveAsync({
              from: uri,
              to: fileUri,
            });
    
            // Check if sharing is available, then share the image
            if (await Sharing.isAvailableAsync()) {
              await Sharing.shareAsync(fileUri);
            } else {
              Alert.alert('Success', 'Image saved to file system!');
            }
          } else {
            Alert.alert('Error', 'Failed to capture image.');
          }
        } catch (error) {
          Alert.alert('Error', 'Failed to download image.');
          console.error(error);
        }
    };
    

  return (

    <View style={styles.container}>
      <Text style={styles.text}>Immutable proof of crop origin</Text>
      {/* Wrap the Image in ViewShot to capture it */}
      <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0 }} 
      onCapture={(uri) => console.log('Captured URI:', uri)}>
        <Image 
          source={require('@/assets/images/QRcode.png')} 
          style={styles.image} 
          resizeMode="contain"
        />
      </ViewShot>

      <CustomButton 
        title="Share QR Code" 
        onPress={shareImage}  // Correctly pass the downloadImage function
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