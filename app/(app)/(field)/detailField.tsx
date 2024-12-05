import { TouchableOpacity, StyleSheet, Text, View, Image, FlatList } from 'react-native'
import React, { useLayoutEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { useRouter, useLocalSearchParams } from 'expo-router';


// Sample data with title and coordinates
const DATA = [
    { id: '1', title: 'Corn', harvest: 'August 15 2024' },
    { id: '2', title: 'Currot', harvest: 'September 24 2023' },
    { id: '3', title: 'Wheat', harvest: 'July 24 2022' },
    { id: '4', title: 'Crop 4', harvest: 'September 24 2021' },
    { id: '5', title: 'Crop 5', harvest: 'September 24 2023' },
    { id: '6', title: 'Crop 6', harvest: 'September 24 2023' },
    { id: '7', title: 'Crop 7', harvest: 'September 24 2023' },
    { id: '8', title: 'Crop 8', harvest: 'September 24 2023' },
    { id: '9', title: 'Crop 9', harvest: 'September 24 2023' },
  ];

type ItemProps = {
  title: string;
  harvest: string;
  onPress: () => void;
};

const Item: React.FC<ItemProps> = ({ title, harvest, onPress }) => (
  <TouchableOpacity onPress={onPress}>
  <View style={styles.itemContainer}>
    {/* Icon or Image on the Left */}
    <Image
      source={require('@/assets/images/Sprout.png')}
      style={styles.image}
    />
    
    {/* Title and Coordinates */}
    <View style={styles.textContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{harvest}</Text>
    </View>
  </View>
  </TouchableOpacity>
);

const detailField = () => {

  const router = useRouter();
  // Get the title from search params explicitly with type
  const params = useLocalSearchParams<{ title: string }>();
  const fieldTitle = params.title;

  useLayoutEffect(() => {
      // Set header title as soon as component mounts
      router.setParams({
          headerTitle: fieldTitle || 'Field Details',
      });
  }, [fieldTitle]);

    const handleItemPress = (title: string) => {
      router.push({
        pathname: '/(app)/(field)/cropOrigin',
        params: { title }
      });
    };

    const handleAddCrop = () => {
      router.push({
        pathname: '/(app)/(field)/addCrop'
      });
    };
  
    return (
        
      <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flex: 1 }}>
          <FlatList
            data={DATA}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <Item 
                title={item.title} 
                harvest={item.harvest} 
                onPress={() => handleItemPress(item.title)} 
              />
            )}
          />
          
          <TouchableOpacity 
            style={styles.roundButton} 
            onPress={() => handleAddCrop()}
          >
            <Text style={styles.plusIcon}>+</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
        
    );
}

export default detailField

const styles = StyleSheet.create({
  container:{
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(253, 71, 183, 0.23)', // Transparent pink background
    padding: 15,
    marginVertical: 8, 
    marginHorizontal: 16, 
    borderRadius: 20, 
  },
  image: {
    width: 50,
    height: 50,
    //borderRadius: 25, // Make the image circular
    marginRight: 15, 
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18, 
    color: '#333', 
    fontFamily: 'DMSans', 
    marginBottom: 5, 
  },
  subtitle: {
    fontSize: 14, 
    color: '#666', 
    fontFamily: 'DMSans', 
  },
  roundButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#FD47B7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  plusIcon: {
    fontSize: 30,
    color: 'white',
    lineHeight: 30,
  },
})