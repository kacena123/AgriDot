import { StyleSheet, Text, View, ScrollView, Image } from 'react-native'
import React, { useLayoutEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '@/components/CustomButton';

const detailGuide = () => {

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
      <View style={styles.container}>
        <Ionicons name="image" size={50} color="#145E2F" />   
      </View>

      <Text style={styles.text}>
        Aphids are small, soft-bodied insects that can cause significant damage to your plants by sucking the sap from leaves, stems, and roots. Fortunately, there are several effective strategies you can use to prevent and control aphid infestations. Follow this guide to keep your garden aphid-free. {'\n'}
        1. Choose Aphid-Resistant Plants {'\n'}
        Plant Selection: Start by choosing varieties of plants that are less attractive to aphids. Some species are naturally resistant, making them less likely to suffer from aphid damage. {'\n'}
        Companion Planting: Consider planting aphid-repelling plants such as garlic, onions, chives, or marigolds alongside your main crops. These plants release odors that aphids dislike. {'\n'}
        2. Encourage Beneficial Insects {'\n'}
        Natural Predators: Ladybugs, lacewings, and hoverflies are natural predators of aphids. Encourage these beneficial insects by planting nectar-rich flowers like dill, fennel, and yarrow. {'\n'}
        Provide Habitat: Create a welcoming environment for beneficial insects by incorporating diverse plant species and leaving some wild areas in your garden. 
      </Text>

      <CustomButton title="Report guide" 
        onPress={() => {navigation.navigate('(guides)/reportGuide')} }
        containerStyles={{ borderRadius: 20, height: 52, backgroundColor: '#145E2F', marginTop: 30, marginBottom: 10 }}
        textStyles={{ fontSize: 18 }}
      />

      <CustomButton title="Donate and like this guide" 
        onPress={() => {} }
        containerStyles={{ borderRadius: 20, height: 52 }}
        textStyles={{ fontSize: 18 }}
      />
      
    </ScrollView>
  )
}

export default detailGuide

const styles = StyleSheet.create({
  wrapper: {
    padding: 20
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(20, 94, 47, 0.2)',
    borderRadius: 20,
    height: 200,
    marginBottom: 20,
  },
  text: {
    fontFamily: 'DMSans',
    marginLeft: 10,
    fontSize: 16,
  },

})