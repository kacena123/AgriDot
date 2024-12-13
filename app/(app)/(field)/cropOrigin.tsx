import React, { useLayoutEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import CustomButton from '@/components/CustomButton';
import ViewShot from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useRouter, useLocalSearchParams } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';


const cropOrigin = () => {
  const route = useRoute();
  const router = useRouter();
  const navigation = useNavigation();
  const { title } = useLocalSearchParams();

  // Dynamically set the header title
  useLayoutEffect(() => {
    navigation.setOptions({
    headerTitle: title,
    });
  }, [navigation, title]);

  // Update the type definition to include all passed params
  const { cropID } = route.params as { 
    cropID: string;
  };
  console.log('Crop ID:', cropID);

  const url = "https://kodadot.xyz/ahk/gallery/" + cropID;
  const base64Logo = '@/assets/images/logo_QR.png'

  const viewShotRef = useRef<ViewShot>(null);

  const shareImage = async () => {
      try {
        // Capture the image using ViewShot
        const uri = await viewShotRef.current?.capture?.();
        
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
      <View style={{marginBottom:30}}>
        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0 }} 
        onCapture={(uri) => console.log('Captured URI:', uri)}>
          <View style={{ backgroundColor: 'white'}}>
          <QRCode
            value={url}
            size={250}
            backgroundColor="white"
            color="black"
            logo={require(base64Logo)}
            logoSize={50}
            logoMargin={8}
            logoBorderRadius={10}
            quietZone={10}
          />
          </View>
        </ViewShot>
      </View>

      <CustomButton 
        title="Share QR Code" 
        onPress={shareImage}  // Correctly pass the downloadImage function
        containerStyles={{ borderRadius: 30, height: 50, width: 300 }}
        textStyles={{ fontSize: 18 }}
      />
      
      <Image 
        source={require('@/assets/images/Secured_by_polkadot_white.png')} 
        style={styles.bottomImage} 
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
    width: '60%',
    height: 50,
    position: 'absolute',
    bottom: 20,
  },
})