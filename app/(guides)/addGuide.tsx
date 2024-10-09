import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native'
import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar'
import CustomButton from '@/components/CustomButton'
import { Ionicons } from '@expo/vector-icons';


const addGuide = () => {

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
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);  // Access the correct field for the image URI
    }
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
      <View style={styles.wrapper}>
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

        {/* Add Guide Title */}
        <Text style={{ fontFamily: 'DMSans', fontSize: 16 }}>Guide Title:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter guide title"
          placeholderTextColor="#666"
        />

        {/* Add Guide Description */}
        <Text style={{ fontFamily: 'DMSans', fontSize: 16 }}>Text:</Text>
        <TextInput
          style={styles.input_description}
          placeholder="Enter text here"
          placeholderTextColor="#666"
          multiline
        />

        {/* Create Button */}
        <CustomButton title='Create Guide' 
          onPress={() => {console.log('tap')}}
          containerStyles={{ borderRadius: 20, height: 50, backgroundColor: '#145E2F' }}
          textStyles={{ fontSize: 18 }}
        />
      </View>

      {/* Status bar */}
      <StatusBar style="light" backgroundColor='#145E2F'/>
    </ScrollView>
  )
}

export default addGuide

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  wrapper: {
    padding: 20,
    width: '100%',
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
    minHeight: 230,
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