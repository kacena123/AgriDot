import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native'


const detailField = () => {

    const route = useRoute();
    const { title } = route.params as { title: string };  // Extract title from route params
    console.log('Title:', title); 
    
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Field Details</Text>
        <Text style={styles.fieldTitle}>{title}</Text> 
      </View>
    );
}

export default detailField

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
      },
      fieldTitle: {
        fontSize: 20,
        marginTop: 10,
      },
})