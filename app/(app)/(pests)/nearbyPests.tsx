import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Image, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Ionicons } from '@expo/vector-icons';

const DATA = [
    { id: '1', title: 'Pest 1', location: 'Location 1', dateAdded: 'June 28, 2024' },
    { id: '2', title: 'Pest 2', location: 'Location 2', dateAdded: 'June 28, 2024' },
    { id: '3', title: 'Pest 3', location: 'Location 3', dateAdded: 'June 28, 2024' },
    { id: '4', title: 'Pest 4', location: 'Location 4', dateAdded: 'June 28, 2024' },
    { id: '5', title: 'Pest 5', location: 'Location 5', dateAdded: 'June 28, 2024' },
  ];

type ItemProps = {
  title: string;
  location: string;
  dateAdded: string;
  onPress: () => void;
};

const Item: React.FC<ItemProps> = ({ title, location, dateAdded, onPress }) => (
    <TouchableOpacity onPress={onPress}>
    <View style={styles.itemContainer}>
      {/* Icon or Image on the Left */}
      <Ionicons name="bug" color="#145E2F" size={40} style={styles.image} />
      
      {/* Title and details */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{location}</Text>
        <Text style={styles.subtitle}>{dateAdded}</Text>
      </View>
    </View>
    </TouchableOpacity>
  );


const NearbyPests = () => {
  const navigation = useNavigation();

  const handleItemPress = (title: string) => {
      // Navigate to detailField and pass the title as a param
      navigation.navigate('(pests)/detailPest', { title });
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
                location={item.location} 
                dateAdded={item.dateAdded}
                onPress={() => handleItemPress(item.title)} 
              />
            )}
          />
          
          {/* Button + to add pest */}
          <TouchableOpacity 
            style={styles.roundButton} 
            onPress={() => { navigation.navigate('(pests)/addPest') }}
          >
            <Text style={styles.plusIcon}>+</Text>
          </TouchableOpacity>

          {/* Button filter */}
          <TouchableOpacity 
            style={styles.leftButton} 
            onPress={() => { navigation.navigate('(pests)/pestsFilter') }}
          >
            <Ionicons name="options" color="#fff" size={25} />
          </TouchableOpacity>

          <StatusBar
            style="light"
            backgroundColor='#145E2F'
          />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default NearbyPests;

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
        width: 40,
        height: 40,
        //borderRadius: 25, // Make the image circular
        marginRight: 15, 
      },
      textContainer: {
        flex: 1,
      },
      title: {
        fontSize: 19, 
        color: '#333', 
        fontFamily: 'DMSans',  
        marginBottom: 2,
      },
      subtitle: {
        fontSize: 14, 
        color: '#333', 
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
      leftButton: {
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
        left: 20,
      },
});