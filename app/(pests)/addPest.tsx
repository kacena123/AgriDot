import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar'
import CustomButton from '@/components/CustomButton'
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';


const addPest = () => {

    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const [pickerTextColor, setPickerTextColor] = useState('#666');
    const locations = ['Location 1', 'Location 2', 'Location 3']; // Replace with your actual locations

  

  const [selectedImage, setSelectedImage] = useState(null);

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
      {/* Add Pest Name */}
      <Text style={{ fontFamily: 'DMSans', fontSize: 16 }}>Pest Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter pest name"
        placeholderTextColor="#666"
      />
      {/* Location */}
      <Text style={{ fontFamily: 'DMSans', fontSize: 16 }}>Location:</Text>
    
      <View style={styles.pickerContainer}>
        <Picker
            selectedValue={selectedLocation}
            onValueChange={(itemValue) => {
                setSelectedLocation(itemValue)
                setPickerTextColor('#000')
            }}
            style={{color: pickerTextColor, fontFamily: 'DMSans', fontSize: 16}}
            dropdownIconColor="#FD47B7"
        >
            <Picker.Item label="Select a location" value={null} />
            {locations.map((location, index) => (
                <Picker.Item key={index} label={location} value={location} />
            ))}
        </Picker>
      </View>

      {/* Add Pest Description */}
      <Text style={{ fontFamily: 'DMSans', fontSize: 16 }}>Description:</Text>
      <TextInput
        style={styles.input_description}
        placeholder="Enter description"
        placeholderTextColor="#666"
        multiline
      />

      {/* Add Crop Button */}
      <CustomButton title='Create Pest' 
        onPress={() => {console.log('tap')}}
        containerStyles={{ borderRadius: 20, height: 50, backgroundColor: '#145E2F' }}
        textStyles={{ fontSize: 18 }}
      />

      {/* Status bar */}
      <StatusBar style="light" backgroundColor='#145E2F'/>
    </ScrollView>
  )
}

export default addPest

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
      pickerContainer: {
        borderColor: 'rgba(253, 71, 183, 0.23)',
        backgroundColor: 'rgba(253, 71, 183, 0.23)',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10,
        marginVertical: 10,
        minHeight: 50,
    },
      fullImage: {
        width: '100%',   // Make image fit the entire container width
        height: '100%',  // Make image fit the entire container height
        borderRadius: 20,
      },
})