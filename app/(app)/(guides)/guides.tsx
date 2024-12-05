import { StyleSheet, Text, TouchableOpacity, FlatList, View, TextInput } from 'react-native'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar'
import { useNavigation } from '@react-navigation/native';


const DATA = [
  { id: '1', title: 'Guide 1', dateAdded: 'June 28, 2024', likes: '631' },
  { id: '2', title: 'Guide 2', dateAdded: 'June 28, 2024', likes: '629' },
  { id: '3', title: 'Guide 3', dateAdded: 'June 28, 2024', likes: '560' },
  { id: '4', title: 'Guide 4', dateAdded: 'June 28, 2024', likes: '559' },
  { id: '5', title: 'Guide 5', dateAdded: 'June 28, 2024', likes: '517' },
  { id: '6', title: 'Guide 6', dateAdded: 'June 28, 2024', likes: '475' },
  { id: '7', title: 'Guide 7', dateAdded: 'June 28, 2024', likes: '469' },
  { id: '8', title: 'Guide 8', dateAdded: 'June 28, 2024', likes: '456' },
  { id: '9', title: 'Guide 9', dateAdded: 'June 28, 2024', likes: '444' },
  { id: '10', title: 'Guide 10', dateAdded: 'June 28, 2024', likes: '420' },
  { id: '11', title: 'Guide 11', dateAdded: 'June 28, 2024', likes: '397' },
  { id: '12', title: 'Guide 12', dateAdded: 'June 28, 2024', likes: '384' },
];

type ItemProps = {
  title: string;
  dateAdded: string;
  likes: string;
  onPress: () => void;
};

const Item: React.FC<ItemProps> = ({ title, dateAdded, likes, onPress }) => (
  <TouchableOpacity onPress={onPress}>
  <View style={styles.itemContainer}>
    {/* Icon or Image on the Left */}
    <Ionicons name="book" color="#145E2F" size={40} style={styles.image} />
    
    {/* Title and details */}
    <View style={styles.textContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{dateAdded}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name="heart" size={18} color="#FD47B7" />
        <Text style={styles.likes}>{likes}</Text>
      </View>
    </View>
  </View>
  </TouchableOpacity>
);

const Guides = () => {
  const navigation = useNavigation();

  const handleItemPress = (title: string) => {
    // Navigate to detailField and pass the title as a param
    navigation.navigate('(guides)/detailGuide', { title });
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flex: 1 }}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchText}
            placeholder="search..."
          />
          <TouchableOpacity onPress={() => console.log('tap')}>
            <Ionicons name="search" size={24} color="#145E2F" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={DATA}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Item 
              title={item.title} 
              dateAdded={item.dateAdded}
              likes={item.likes}
              onPress={() => handleItemPress(item.title)} 
            />
          )}
        />
        
        <TouchableOpacity 
          style={styles.roundButton} 
          onPress={() => { navigation.navigate('(guides)/addGuide') }}
        >
          <Text style={styles.plusIcon}>+</Text>
        </TouchableOpacity>

        <StatusBar
          style="light"
          backgroundColor='#145E2F'
        />
      </View>
    </SafeAreaView>
  </GestureHandlerRootView>
  )
}

export default Guides

const styles = StyleSheet.create({
  container:{
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 40,
    height: 40,
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
    marginBottom: 2, 
  },
  subtitle: {
    fontSize: 12, 
    color: '#333', 
    fontFamily: 'DMSans', 
  },
  likes: {
    fontSize: 14, 
    color: '#333', 
    fontFamily: 'DMSans', 
  },
  itemContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(253, 71, 183, 0.23)',
    padding: 15,
    marginVertical: 8, 
    marginHorizontal: 16, 
    borderRadius: 20, 
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: 'rgba(20, 94, 47, 0.15)',
    backgroundColor: 'rgba(20, 94, 47, 0.15)',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginVertical: 10,
    minHeight: 50,
    marginHorizontal: 16,
  },
  searchText: {
    fontFamily: 'DMSans',
    fontSize: 16,
    color: '#000',
  },
})