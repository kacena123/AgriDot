import { ScrollView, StyleSheet, Text, View, Image, FlatList } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

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
};

const Item: React.FC<ItemProps> = ({ title, coordinates }) => (
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
);

const Fields = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaView className='bg-white h-full'>
      
        <FlatList
          contentContainerStyle={{ flexGrow: 1 }}
          data={DATA}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <Item title={item.title} coordinates={item.coordinates} />}
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
    justifyContent: 'center'
  },
  itemContainer: {
    flexDirection: 'row', // Align image and text horizontally
    alignItems: 'center', // Center the text vertically with the image
    //backgroundColor: '#FD47B7', // Light pink background
    backgroundColor: 'rgba(253, 71, 183, 0.23)', // Transparent pink background
    padding: 15, // Space inside the item
    marginVertical: 8, // Space between each item
    marginHorizontal: 16, // Space on the sides
    borderRadius: 20, // Rounded corners
  },
  image: {
    width: 50, // Set width of the image
    height: 50, // Set height of the image
    //borderRadius: 25, // Make the image circular
    marginRight: 15, // Space between image and text
  },
  textContainer: {
    flex: 1, // Take up the remaining space
  },
  title: {
    fontSize: 18, // Larger font size for title
    //fontWeight: 'bold', // Bold text for title
    color: '#333', // Darker color for title
    fontFamily: 'DMSans', // Custom font for title
    marginBottom: 5, // Space between title and subtitle
  },
  subtitle: {
    fontSize: 14, // Smaller font size for subtitle
    color: '#666', // Lighter color for subtitle
    fontFamily: 'DMSans', // Custom font for subtitle
  },
})