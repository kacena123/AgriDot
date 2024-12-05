import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar'
import CustomButton from '@/components/CustomButton'
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';


const addCrop = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

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
      {/* Add Crop Name */}
      <Text style={{ fontFamily: 'DMSans', fontSize: 16 }}>Crop Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter crop name"
        placeholderTextColor="#666"
      />
      {/* Harvest date */}
      <Text style={{ fontFamily: 'DMSans', fontSize: 16 }}>Harvest date:</Text>
      <View style={styles.datePickerContainer}>
        <TextInput
          style={styles.datePickerText}
          value={date.toLocaleDateString()}
          editable={false}
        />
        <TouchableOpacity onPress={showDatepicker}>
          <Ionicons name="calendar-outline" size={24} color="#145E2F" />
        </TouchableOpacity>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            display="default"
            onChange={onChange}
            themeVariant="light"  // Ensure it's light theme (or you can use 'dark' based on preference)
            accentColor="#145E2F" // Set the accent color to green
          />
        )}
      </View>
      {/* Add Crop Button */}
      <CustomButton title='Add Crop' 
        onPress={() => {console.log('tap')}}
        containerStyles={{ borderRadius: 20, height: 50, backgroundColor: '#145E2F' }}
        textStyles={{ fontSize: 18 }}
      />

      {/* Status bar */}
      <StatusBar style="light" backgroundColor='#145E2F'/>
    </ScrollView>
  )
}

export default addCrop

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
    datePickerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderColor: 'rgba(253, 71, 183, 0.23)',
      backgroundColor: 'rgba(253, 71, 183, 0.23)',
      borderWidth: 1,
      borderRadius: 20,
      paddingHorizontal: 10,
      marginVertical: 10,
      minHeight: 50,
    },
    datePickerText: {
      fontFamily: 'DMSans',
      fontSize: 16,
      color: '#000',
    },
    fullImage: {
      width: '100%',   // Make image fit the entire container width
      height: '100%',  // Make image fit the entire container height
      borderRadius: 20,
    },
})