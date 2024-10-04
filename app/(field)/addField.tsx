import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar'
import CustomButton from '@/components/CustomButton'
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

const addField = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  // Function to handle image picking
  const pickImage = async () => {
    // Request permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    // Open image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      //aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);  // Access the correct field for the image URI
    }
  };

  // Function to get user's current location
  const useMyLocation = async () => {
    // Request permission to access location
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }

    // Get current location
    let location = await Location.getCurrentPositionAsync({});
    setLatitude(location.coords.latitude.toString());
    setLongitude(location.coords.longitude.toString());
  };

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      {/* Upload Image */}
      <TouchableOpacity style={styles.container} onPress={pickImage}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.fullImage} />
        ) : (
          <>
            <Ionicons name="cloud-upload" size={32} color="green" />
            <Text style={styles.text}>Upload Image</Text>
          </>
        )}
      </TouchableOpacity>
      {/* Add Field Name */}
      <Text style={{ fontFamily: 'DMSans', fontSize: 16 }}>Field Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter field name"
        placeholderTextColor="#666"
      />
      {/* Add Field Coordinates */}
      <Text style={{ fontFamily: 'DMSans', fontSize: 16 }}>Latitude:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter field latitude"
        placeholderTextColor="#666"
        value={latitude} // Update TextInput with latitude
        onChangeText={setLatitude} // Update latitude with TextInput value
      />
      <Text style={{ fontFamily: 'DMSans', fontSize: 16 }}>Longitude:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter field longitude"
        placeholderTextColor="#666"
        value={longitude} // Update TextInput with longitude
        onChangeText={setLongitude} // Update longitude with TextInput value
      />
      {/* Use My Location button */}
      <CustomButton 
        title='Use My Lcation' 
        onPress={useMyLocation}
        containerStyles={{ borderRadius: 20, height: 50, marginBottom: 20 }}
        textStyles={{ fontSize: 16 }} 
      />
      {/* Add Field Description */}
      <Text style={{ fontFamily: 'DMSans', fontSize: 16 }}>Description:</Text>
      <TextInput
        style={styles.input_description}
        placeholder="Enter description"
        placeholderTextColor="#666"
        multiline
      />
      {/* Add Field Button */}
      <CustomButton title='Add Field' 
        onPress={() => {console.log('tap')}}
        containerStyles={{ borderRadius: 20, height: 50, backgroundColor: '#145E2F' }}
        textStyles={{ fontSize: 18 }}
      />

      {/* Status bar */}
      <StatusBar style="light" backgroundColor='#145E2F'/>
    </ScrollView>
  )
}

export default addField

const styles = StyleSheet.create({
  wrapper: {
    padding: 20,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(20, 94, 47, 0.2)',
    borderRadius: 20,
    height: 160,
    marginBottom: 20,
  },
  text: {
    fontFamily: 'DMSans',
    marginLeft: 10,
    fontSize: 16,
  },
  input: {
    fontFamily: 'DMSans',
    borderColor: 'rgba(253, 71, 183, 0.23)',
    backgroundColor: 'rgba(253, 71, 183, 0.23)',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginVertical: 10,
    minHeight: 50,
    fontSize: 16,
  },
  input_description: {
    height: 180,
    fontFamily: 'DMSans',
    borderColor: 'rgba(253, 71, 183, 0.23)',
    backgroundColor: 'rgba(253, 71, 183, 0.23)',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginVertical: 10,
    minHeight: 180,
    fontSize: 16,
    textAlignVertical: 'top',
    paddingVertical: 10,
  },
  fullImage: {
    width: '100%',   // Make image fit the entire container width
    height: '100%',  // Make image fit the entire container height
    borderRadius: 20,
  },
})