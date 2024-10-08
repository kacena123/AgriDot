import { TouchableOpacity, StyleSheet, Text, View, Image, FlatList } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'

// Sample data with title and coordinates
const DATA = [
  { id: '1', title: 'Location 1', coordinates: 'Lat: 51.5074, Long: -0.1278' },
  { id: '2', title: 'Location 2', coordinates: 'Lat: 40.7128, Long: -74.0060' },
  { id: '3', title: 'Location 3', coordinates: 'Lat: 34.0522, Long: -118.2437' },
  { id: '4', title: 'Location 4', coordinates: 'Lat: 34.0522, Long: -118.2437' },
  { id: '5', title: 'Location 5', coordinates: 'Lat: 34.0522, Long: -118.2437' },
  { id: '6', title: 'Location 6', coordinates: 'Lat: 34.0522, Long: -118.2437' },
  { id: '7', title: 'Location 7', coordinates: 'Lat: 34.0522, Long: -118.2437' },
  { id: '8', title: 'Location 8', coordinates: 'Lat: 34.0522, Long: -118.2437' },
  { id: '9', title: 'Location 9', coordinates: 'Lat: 34.0522, Long: -118.2437' },
];

type ItemProps = {
  title: string;
  coordinates: string;
  onPress: () => void;
};

const Item: React.FC<ItemProps> = ({ title, coordinates, onPress }) => (
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
      <Text style={styles.subtitle}>{coordinates}</Text>
    </View>
  </View>
  </TouchableOpacity>
);

const Fields = () => {
  const navigation = useNavigation();

  const handleItemPress = (title: string) => {
    // Navigate to detailField and pass the title as a param
    navigation.navigate('(field)/detailField', { title });
  };
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaView className='bg-white h-full'>

        { /* FlatList to display the list of fields */ }
        <FlatList
          contentContainerStyle={{ flexGrow: 1 }}
          data={DATA}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Item 
              title={item.title} 
              coordinates={item.coordinates} 
              onPress={() => handleItemPress(item.title)} 
            />
          )}
        />
        
        { /* Button + to add field */ }
        <TouchableOpacity 
          style={styles.roundButton} 
          onPress={() => { navigation.navigate('(field)/addField') }}
          >
            <Text style={styles.plusIcon}>+</Text>
        </TouchableOpacity>

        <StatusBar
          style="light"
          backgroundColor='#145E2F'
        />
      
    </SafeAreaView>
    </GestureHandlerRootView>
  )
}

export default Fields

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