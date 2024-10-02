import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar'
import CustomButton from '@/components/CustomButton'

const addField = () => {
  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      {/* Upload Image */}
      <TouchableOpacity style={styles.container}>
        <Ionicons name="cloud-upload" size={32} color="green" />
        <Text style={styles.text}>Upload Image</Text>
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
      />
      <Text style={{ fontFamily: 'DMSans', fontSize: 16 }}>Longitude:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter field longitude"
        placeholderTextColor="#666"
      />
      {/* Use My Location button */}
      <CustomButton title='Use My Lcation' 
        onPress={() => {console.log('tap')}}
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
})