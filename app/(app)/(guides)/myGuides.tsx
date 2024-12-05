import { StyleSheet, Text, TouchableOpacity, FlatList, View } from 'react-native'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar'
import { useNavigation } from '@react-navigation/native';


const DATA = [
  { id: '1', title: 'Guide 1', dateAdded: 'June 28, 2024', likes: '231' },
  { id: '2', title: 'Guide 2', dateAdded: 'June 28, 2024', likes: '23' },
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



const MyGuides = () => {
  const navigation = useNavigation();

  const handleItemPress = (title: string) => {
    // Navigate to detailField and pass the title as a param
    navigation.navigate('(guides)/detailGuide', { title });
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

export default MyGuides

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
})