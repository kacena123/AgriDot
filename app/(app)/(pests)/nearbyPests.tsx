import React, { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Image, FlatList, ActivityIndicator, Modal, TextInput } from 'react-native';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SecureStorage } from '@/services/secureStorage';
import { Keyring } from '@polkadot/api'
import { getClient } from '@kodadot1/uniquery'
import CryptoJS from "react-native-crypto-js";
import CustomButton from '@/components/CustomButton';

type ItemProps = {
  title: string;
  location: string;
  dateAdded: string;
  image: string;
  onPress: () => void;
};

const Item: React.FC<ItemProps> = ({ title, location, dateAdded, image, onPress }) => (
    <TouchableOpacity onPress={onPress}>
    <View style={styles.itemContainer}>
      {/* Icon or Image on the Left */}
      <Image
        source={{uri: image}}
        style={styles.image}
      />
      
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
  const router = useRouter();
  const route = useRoute();

  const [fields, setFields] = React.useState<any[]>([]);
  const [fieldsNames, setFieldsNames] = React.useState<string[]>([]);
  const [locations, setLocations] = React.useState<string[]>([]);

  const [threshold, setThreshold] = React.useState<string>("500");

  const [pests, setPests] = React.useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const [showFilterModal, setShowFilterModal] = useState(false);

  const handleItemPress = (title: string, description: string, fields: string[], distances: any, date: string, image: string, pestID: string, owner: string) => {
      router.push({
        pathname: '/(app)/(pests)/detailPest',
        params: { title, description, fields, distances, date, image, pestID, owner },
      });
  };

  useEffect(() => {
    
    const fetchFieldsAndPests = async () => {
      try {
        setLoading(true);
        // Reset states
        setFields([]);
        setLocations([]);
        setPests([]);
        setFieldsNames([]);
        // Fetch fields first
        const client = getClient("ahk" as any);
        const wallet = new Keyring({ type: 'sr25519' });
        const userWallet = wallet.addFromUri(await SecureStorage.getSecretPhrase() as string);
        const kusamaAddr = wallet.encodeAddress(userWallet.address, 2);
        const query = client.collectionListByOwner(kusamaAddr);
  
        const result = await client.fetch<any>(query);
        const fetchedFields = result.data?.collections;
        
        // Temporary arrays to avoid multiple state updates
        const newFields = [];
        const newLocations = [];
        const fieldsNames = [];
  
        // Process fields
        for (let i = 0; i < fetchedFields.length; i++) {
          const item = fetchedFields[i];
          const metdataIpfsUrl = item.metadata.replace("ipfs://", "https://"+process.env.EXPO_PUBLIC_GATEWAY_URL+"/ipfs/");
          const metadataResponse = await fetch(metdataIpfsUrl);
          const metadata = await metadataResponse.json();
          if (metadata.external_url === "agridot-web3") {
            
            // Decryption if the field is private
            if (metadata.name.startsWith("[Private]")) {
              const title = metadata.name.replace("[Private]", "");
              const description = metadata.description.replace("[Private]", "");
              const image = metadata.image.replace("[Private]", "");
              const password = await SecureStorage.getSecretPassword();
              if (password) {
                try{
                  const decriptTitle = CryptoJS.AES.decrypt(title, password).toString(CryptoJS.enc.Utf8);
                  const decriptDescription = CryptoJS.AES.decrypt(description, password).toString(CryptoJS.enc.Utf8);
                  let decriptImage = CryptoJS.AES.decrypt(image, password).toString(CryptoJS.enc.Utf8);
                  decriptImage = decriptImage.replace("ipfs://", "https://"+process.env.EXPO_PUBLIC_GATEWAY_URL+"/ipfs/");
                  if (decriptTitle && decriptDescription && decriptImage) {
                    newFields.push({ id: item.id, title: decriptTitle, coordinates: decriptDescription, image: decriptImage });
                    newLocations.push(decriptDescription);
                    fieldsNames.push(decriptTitle);
                  }
                } catch (error) {}
              }
            }
            // If the field is public
            else { 
              const image = metadata.image.replace("ipfs://", "https://"+process.env.EXPO_PUBLIC_GATEWAY_URL+"/ipfs/");
              const loc = metadata.description;
              
              newFields.push({ id: item.id, title: metadata.name, coordinates: loc, image: image });
              newLocations.push(loc);
              fieldsNames.push(metadata.name);
            }
        }
  
        // Update fields and locations once
        setFields(newFields);
        setLocations(newLocations);
        setFieldsNames(fieldsNames);
  
        // Now fetch pests with the complete locations array
        const resp = await fetch(process.env.EXPO_PUBLIC_SERVER_URL+'/agridot/nearby/pests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            locations: newLocations, 
          }), 
        });
  
        // Check if response is ok and has content
        if (!resp.ok) {
          throw new Error(`HTTP error! status: ${resp.status}`);
        }
        
        const text = await resp.text(); // Get response as text first
        if (!text) {
          console.log('Empty response received');
          setPests([]); // Set empty pests array
          setLoading(false);
          return;
        }

        // Try to parse the JSON
        const respJson = JSON.parse(text);
        if (!Array.isArray(respJson)) {
          console.log('Invalid response format');
          setPests([]);
          setLoading(false);
          return;
        }
        const newPests = [];

        const decryptKey = process.env.EXPO_PUBLIC_ENCRYPT_PHRASE;
  
        for (let i = 0; i < respJson.length; i++) {
          const item = respJson[i];
          const description = CryptoJS.AES.decrypt(item.description, decryptKey).toString(CryptoJS.enc.Utf8);
          const [distancesPart, descriptionPart] = description.split('[Description]');
          const distances = distancesPart.split(',').map(num => parseFloat(num));
          const descriptionPest = descriptionPart.trim();
  
          let nearestLocationName = '';
          let nearestDistance = '0';

          const closestFieldIndex = distances.indexOf(Math.min(...distances));
          if (closestFieldIndex >= 0 && newFields[closestFieldIndex]) {
            nearestLocationName = newFields[closestFieldIndex].title;
            nearestDistance = Math.min(...distances).toFixed(2);
          } else {
            // Provide default values if no valid field is found
            nearestLocationName = "Unknown location";
            nearestDistance = "0";
          }
  
          if (parseFloat(nearestDistance) < parseFloat(threshold)) {
            const title = CryptoJS.AES.decrypt(item.name, decryptKey).toString(CryptoJS.enc.Utf8);
            let decriptImage = CryptoJS.AES.decrypt(item.image, decryptKey).toString(CryptoJS.enc.Utf8);
            decriptImage = decriptImage.replace("ipfs://", "https://"+process.env.EXPO_PUBLIC_GATEWAY_URL+"/ipfs/");
            let dateAdded = CryptoJS.AES.decrypt(item.date, decryptKey).toString(CryptoJS.enc.Utf8);
            dateAdded = new Date(dateAdded).toLocaleDateString();
            let owner = CryptoJS.AES.decrypt(item.owner, decryptKey).toString(CryptoJS.enc.Utf8);
            let ID = CryptoJS.AES.decrypt(item.id, decryptKey).toString(CryptoJS.enc.Utf8);

            newPests.push({
              id: ID, // More unique ID
              title,
              distances,
              description: descriptionPest,
              image: decriptImage,
              nearestLocationName,
              nearestDistance,
              dateAdded,
              owner
            });
          }
        }
        // Update pests once
        setPests(newPests);
  
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };
    fetchFieldsAndPests();
  }, []);

  const fetchFieldsAndPests = async () => {
    try {
      setLoading(true);
      // Reset states
      setFields([]);
      setLocations([]);
      setPests([]);
      setFieldsNames([]);
      // Fetch fields first
      const client = getClient("ahk" as any);
      const wallet = new Keyring({ type: 'sr25519' });
      const userWallet = wallet.addFromUri(await SecureStorage.getSecretPhrase() as string);
      const kusamaAddr = wallet.encodeAddress(userWallet.address, 2);
      const query = client.collectionListByOwner(kusamaAddr);

      const result = await client.fetch<any>(query);
      const fetchedFields = result.data?.collections;
      
      // Temporary arrays to avoid multiple state updates
      const newFields = [];
      const newLocations = [];
      const fieldsNames = [];

      // Process fields
      for (let i = 0; i < fetchedFields.length; i++) {
        const item = fetchedFields[i];
        const metdataIpfsUrl = item.metadata.replace("ipfs://", "https://"+process.env.EXPO_PUBLIC_GATEWAY_URL+"/ipfs/");
        const metadataResponse = await fetch(metdataIpfsUrl);
        const metadata = await metadataResponse.json();
        if (metadata.external_url === "agridot-web3") {
          
          // Decryption if the field is private
          if (metadata.name.startsWith("[Private]")) {
            const title = metadata.name.replace("[Private]", "");
            const description = metadata.description.replace("[Private]", "");
            const image = metadata.image.replace("[Private]", "");
            const password = await SecureStorage.getSecretPassword();
            if (password) {
              try{
              const decriptTitle = CryptoJS.AES.decrypt(title, password).toString(CryptoJS.enc.Utf8);
              const decriptDescription = CryptoJS.AES.decrypt(description, password).toString(CryptoJS.enc.Utf8);
              let decriptImage = CryptoJS.AES.decrypt(image, password).toString(CryptoJS.enc.Utf8);
              decriptImage = decriptImage.replace("ipfs://", "https://"+process.env.EXPO_PUBLIC_GATEWAY_URL+"/ipfs/");
              if (decriptTitle && decriptDescription && decriptImage) {
                newFields.push({ id: item.id, title: decriptTitle, coordinates: decriptDescription, image: decriptImage });
                newLocations.push(decriptDescription);
                fieldsNames.push(decriptTitle);
              }
              } catch (error) {}
            }
          }
          // If the field is public
          else { 
            const image = metadata.image.replace("ipfs://", "https://"+process.env.EXPO_PUBLIC_GATEWAY_URL+"/ipfs/");
            const loc = metadata.description;
            
            newFields.push({ id: item.id, title: metadata.name, coordinates: loc, image: image });
            newLocations.push(loc);
            fieldsNames.push(metadata.name);
          }
      }

      // Update fields and locations once
      setFields(newFields);
      setLocations(newLocations);
      setFieldsNames(fieldsNames);

      // Now fetch pests with the complete locations array
      const resp = await fetch(process.env.EXPO_PUBLIC_SERVER_URL+'/agridot/nearby/pests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          locations: newLocations, 
        }), 
      });

      // Check if response is ok and has content
      if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
      }
      
      const text = await resp.text(); // Get response as text first
      if (!text) {
        console.log('Empty response received');
        setPests([]); // Set empty pests array
        setLoading(false);
        return;
      } 

      // Try to parse the JSON
      const respJson = JSON.parse(text);
      if (!Array.isArray(respJson)) {
        console.log('Invalid response format');
        setPests([]); 
        setLoading(false); 
        return;
      }
      const newPests = [];

      const decryptKey = process.env.EXPO_PUBLIC_ENCRYPT_PHRASE;

      for (let i = 0; i < respJson.length; i++) {
        const item = respJson[i];
        const description = CryptoJS.AES.decrypt(item.description, decryptKey).toString(CryptoJS.enc.Utf8);
        const [distancesPart, descriptionPart] = description.split('[Description]');
        const distances = distancesPart.split(',').map(num => parseFloat(num));
        const descriptionPest = descriptionPart.trim();

        let nearestLocationName = '';
        let nearestDistance = '0';

        const closestFieldIndex = distances.indexOf(Math.min(...distances));
        if (closestFieldIndex >= 0 && newFields[closestFieldIndex]) {
          nearestLocationName = newFields[closestFieldIndex].title;
          nearestDistance = Math.min(...distances).toFixed(2);
        } else {
          // Provide default values if no valid field is found
          nearestLocationName = "Unknown location";
          nearestDistance = "0";
        }

        if (parseFloat(nearestDistance) < parseFloat(threshold)) {
          const title = CryptoJS.AES.decrypt(item.name, decryptKey).toString(CryptoJS.enc.Utf8);
          let decriptImage = CryptoJS.AES.decrypt(item.image, decryptKey).toString(CryptoJS.enc.Utf8);
          decriptImage = decriptImage.replace("ipfs://", "https://"+process.env.EXPO_PUBLIC_GATEWAY_URL+"/ipfs/");
          let dateAdded = CryptoJS.AES.decrypt(item.date, decryptKey).toString(CryptoJS.enc.Utf8);
          dateAdded = new Date(dateAdded).toLocaleDateString();
          let owner = CryptoJS.AES.decrypt(item.owner, decryptKey).toString(CryptoJS.enc.Utf8);
          let ID = CryptoJS.AES.decrypt(item.id, decryptKey).toString(CryptoJS.enc.Utf8);

          newPests.push({
            id: ID, // More unique ID
            title,
            distances,
            description: descriptionPest,
            image: decriptImage,
            nearestLocationName,
            nearestDistance,
            dateAdded,
            owner
          });
        }
      }
      // Update pests once
      setPests(newPests);

      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
      <ActivityIndicator size="large" color="#FD47B7"/>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flex: 1 }}>
        {pests.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No pests in {threshold} km from your fields.</Text>
            <Text style={styles.emptyText}>Increase the distance to see more pests.</Text>
          </View>
        ) : (
          <FlatList
            data={pests}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <Item 
                title={item.title} 
                location={item.nearestDistance + " km from " + item.nearestLocationName} 
                dateAdded={item.dateAdded}
                image={item.image}
                onPress={() => handleItemPress(item.title, item.description, fieldsNames, item.distances, item.dateAdded, item.image, item.id, item.owner)} 
              />
            )}
          />
        )}
          
          {/* Button + to add pest */}
          <TouchableOpacity 
            style={styles.roundButton} 
            onPress={() => { router.push({ pathname: '/(app)/(pests)/addPest' }) }}
          >
            <Text style={styles.plusIcon}>+</Text>
          </TouchableOpacity>

          {/* Button filter */}
          <TouchableOpacity 
            style={styles.leftButton} 
            onPress={() => { setShowFilterModal(true) }}
          >
            <Ionicons name="options" color="#fff" size={25} />
          </TouchableOpacity>

          {/* Filter modal */}
          <Modal
              visible={showFilterModal}
              transparent={true}
              animationType="fade"
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  
                  {/* Close button */}
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setShowFilterModal(false)}
                  >
                    <Text style={styles.closeButtonText}>×</Text>
                  </TouchableOpacity>

                  <Text style={styles.modalTitle}>Distance from your fields</Text>
                  <Text style={styles.modalText}>Enter the number of km to see pests around your fields:</Text>

                  <TextInput
                    style={styles.input}
                    value={threshold.toString()}
                    onChangeText={setThreshold}
                    keyboardType="numeric"
                    placeholder="50 km"
                  />
                  
                  <View style={{paddingLeft: 50, paddingRight: 50}}>
                    <CustomButton 
                      title="Filter"
                      onPress={() => {
                        setShowFilterModal(false);
                        // Fetch pests again
                        fetchFieldsAndPests();
                      }}
                      containerStyles={{ height: 50,}}
                      textStyles={{ fontSize: 18 }}
                    />
                  </View>
                </View>
              </View>
            </Modal>

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
    borderRadius: 5,
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

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    paddingTop: 40,
    paddingBottom: 40
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'DMSans',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    fontFamily: 'DMSans',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontFamily: 'DMSans',
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
  },

  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
    fontWeight: 'bold',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'DMSans',
  },
});