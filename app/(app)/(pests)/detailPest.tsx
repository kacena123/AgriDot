import { StyleSheet, Text, View, ScrollView, Image } from 'react-native'
import React, { useLayoutEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native'
import CustomButton from '@/components/CustomButton';
import { StatusBar } from 'expo-status-bar'

const detailPest = () => {
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
    <ScrollView contentContainerStyle={styles.wrapper}>
        {/* Image of pest */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
            <Image source={require('@/assets/images/pest1.jpg')} style={{width: 350, height: 200}}  />
        </View>


        {/* Text */}
        <Text style={styles.text}>
            Crop: Lettuce{'\n'}
            Observation:{'\n'}
            Aphids detected on 10% of plants.
            Small clusters (5-15 aphids) mainly on leaf undersides.
            Some wilting and yellowing observed.{'\n'}
            Actions Taken:{'\n'}
            Manually removed aphids; pruned infested leaves.
            Applied neem oil to affected plants.
        </Text>

      {/* Mark fake pest report Button */}
      <CustomButton title='Mark fake pest report' 
        onPress={() => {navigation.navigate('(pests)/reportPest')}}
        containerStyles={{ borderRadius: 20, height: 50, backgroundColor: '#145E2F' }}
        textStyles={{ fontSize: 18 }}
      />

      {/* Send thank to reporter Button */}
      <CustomButton title='Send thank to reporter' 
        onPress={() => {console.log('tap')}}
        containerStyles={{ borderRadius: 20, height: 50, marginTop: 20 }}
        textStyles={{ fontSize: 18 }}
      />

      {/* Status bar */}
      <StatusBar style="light" backgroundColor='#145E2F'/>
    </ScrollView>
  )
}

export default detailPest

const styles = StyleSheet.create({
    wrapper: {
        padding: 20,
    },
    text: {
        fontFamily: 'DMSans',
        fontSize: 16,
        marginLeft: 10,
        marginBottom: 20,
    }

})