import { StyleSheet, Text, View, TextInput } from 'react-native'
import React, { useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import CustomButton from '@/components/CustomButton'
import RNPickerSelect from 'react-native-picker-select'
import { Picker } from '@react-native-picker/picker';

const pestsFilter = () => {
  const [distance, setDistance] = useState('')

  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const locations = ['Location 1', 'Location 2', 'Location 3']; // Replace with your actual locations
  
  return (
    <GestureHandlerRootView style={{ flex: 1, padding: 20 }}>

        {/* Distance */}
        <Text style={styles.text}>Distance:</Text>
        <TextInput
            style={styles.input}
            placeholder="0 km"
            placeholderTextColor="#666"
        />

        {/* From field*/}
        <Text style={styles.text}>From:</Text>
        <View style={styles.pickerContainer}>
            <Picker
                selectedValue={selectedLocation}
                onValueChange={(itemValue) => {
                    setSelectedLocation(itemValue)
                }}
                style={{ fontFamily: 'DMSans', fontSize: 16}}
                dropdownIconColor="#FD47B7"
            >
                <Picker.Item label="All Fields" value={null} />
                {locations.map((location, index) => (
                    <Picker.Item key={index} label={location} value={location} />
                ))}
            </Picker>
        </View>

        <CustomButton title="Apply" 
            onPress={() => {console.log('Tap')}} 
            containerStyles={{ borderRadius: 20, height: 55, backgroundColor: '#145E2F', marginTop: 20 }}
            textStyles={{ fontSize: 18 }}
        />
    </GestureHandlerRootView>
  )
}

export default pestsFilter

const styles = StyleSheet.create({
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
        paddingLeft: 20,
    },
    text: {
        fontFamily: 'DMSans',
        marginLeft: 10,
        fontSize: 16,
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
})
