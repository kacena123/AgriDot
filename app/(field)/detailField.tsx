import { StyleSheet, Text, View } from 'react-native'
import React, { useLayoutEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native'


const detailField = () => {

    const route = useRoute();
    const navigation = useNavigation();
    const { title } = route.params as { title: string };  // Extract title from route params
    console.log('Title:', title); 

    // Dynamically set the header title
    useLayoutEffect(() => {
        navigation.setOptions({
        headerTitle: title,  // Set the header title to the item's title
        });
    }, [navigation, title]);
    
  
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