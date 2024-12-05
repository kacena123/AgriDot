import { StyleSheet, Text, TextInput } from 'react-native'
import React from 'react'
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'
import CustomButton from '@/components/CustomButton'
import { useNavigation } from '@react-navigation/native';

const reportPest = () => {
    const navigation = useNavigation();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={styles.wrapper}>
        <Text style={styles.text}>Why are you reporting?</Text>
        
        {/* Description */}
        <TextInput
            style={styles.input_description}
            placeholder="Enter reason of reporting"
            placeholderTextColor="#666"
            multiline
        />

        {/* Send report Button */}
        <CustomButton title='Send Report' 
            onPress={() => {console.log('tap')}}
            containerStyles={{ borderRadius: 20, height: 50, backgroundColor: '#145E2F' }}
            textStyles={{ fontSize: 18 }}
        />

        {/* Status bar */}
        <StatusBar style="light" backgroundColor='#145E2F'/>
    </ScrollView>
    </GestureHandlerRootView>
  )
}

export default reportPest

const styles = StyleSheet.create({
    wrapper: {
        padding: 20,
    },
    text: {
        fontFamily: 'DMSans',
        fontSize: 16,
        marginLeft: 8,
        marginBottom: 5,
        marginTop: 10,
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
        marginBottom: 20,
    },
})