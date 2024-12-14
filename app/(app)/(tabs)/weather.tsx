import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Picker } from '@react-native-picker/picker';
import { SecureStorage } from '@/services/secureStorage';
import { Keyring } from '@polkadot/api'
import { getClient } from '@kodadot1/uniquery'
import CryptoJS from "react-native-crypto-js";
import { LocationContext } from '@/context/LocationContext';

// Importing screens
import CurrentWeather from '@/app/(app)/(weather)/currentWeather';
import HourlyWeather from '@/app/(app)/(weather)/hourlyWeather';
import LongtermWeather from '@/app/(app)/(weather)/longtermWeather';

const weather = () => {
  const TopTab = createMaterialTopTabNavigator();

  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  //const locations = ['Location 1', 'Location 2', 'Location 3']; // Replace with your actual locations

  const [locations, setLocations] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLocations([]);
        //setFetchedData([]);
        const client = getClient("ahk" as any)
        const wallet = new Keyring({ type: 'sr25519' });
        const userWallet = wallet.addFromUri(await SecureStorage.getSecretPhrase() as string);
        //Convert to Kusama addr
        const kusamaAddr = wallet.encodeAddress(userWallet.address, 2) ;
        const query = client.collectionListByOwner(kusamaAddr);

        try{
          const result = await client.fetch<any>(query);
        
          console.log(result.data?.collections);
          //setFetchedData(result.data?.collections);

          const fetchedData = result.data?.collections;
          for (let i = 0; i < fetchedData.length; i++) {
            const item = fetchedData[i];
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
                  try {
                  const decriptTitle = CryptoJS.AES.decrypt(title, password).toString(CryptoJS.enc.Utf8);
                  const decriptDescription = CryptoJS.AES.decrypt(description, password).toString(CryptoJS.enc.Utf8);
                  let decriptImage = CryptoJS.AES.decrypt(image, password).toString(CryptoJS.enc.Utf8);
                  decriptImage = decriptImage.replace("ipfs://", "https://"+process.env.EXPO_PUBLIC_GATEWAY_URL+"/ipfs/");
                  if (decriptTitle && decriptDescription && decriptImage) {
                    setLocations(locations => [...locations, { id: item.id, title: decriptTitle, coordinates: decriptDescription, image: decriptImage }]);
                  }
                  } catch (error) {}
                }
              }
              // If the field is public
              else { 
                const image = metadata.image.replace("ipfs://", "https://"+process.env.EXPO_PUBLIC_GATEWAY_URL+"/ipfs/");
                setLocations(locations => [...locations, { id: item.id, title: metadata.name, coordinates: metadata.description, image: image }]);
              }
            }
          }

        } catch (error) {
          console.error('Error fetching data:', error);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <LocationContext.Provider value={{ coordinates: selectedLocation?.coordinates }}>
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>

        {/* Picker for selecting location */}
        <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
        <View style={styles.pickerContainer}>
            <Picker
                selectedValue={selectedLocation}
                onValueChange={(itemValue) => {
                    setSelectedLocation(itemValue)
                }}
                style={{ fontFamily: 'DMSans', fontSize: 15}}
                dropdownIconColor="#FD47B7"
            >
                <Picker.Item key="-1" label="Select field" value={null} />
                {locations.map((location, index) => (
                    <Picker.Item key={index} label={location.title} value={location} />
                ))}
            </Picker>
        </View>
        </View>

      {/* Top tab navigation */}
      <TopTab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 16, fontFamily: 'DMSans', color: '#145E2F', textTransform: 'none' },
          tabBarStyle: { backgroundColor: 'white' },
          tabBarIndicatorStyle: { backgroundColor: '#145E2F' },
        }}
      >
        <TopTab.Screen name="CcurrentWeather" component={CurrentWeather} options={{ title: 'Current' }} />
        <TopTab.Screen name="HourlyWeather" component={HourlyWeather} options={{ title: 'Hourly' }} />
        <TopTab.Screen name="LongtermWeather" component={LongtermWeather} options={{ title: 'Long-term' }} />
      </TopTab.Navigator>

      {/* Status bar */}
      <StatusBar
          style="light"
          backgroundColor='#145E2F'
          translucent={false}  // Prevents status bar from overlaying the app content
          animated={true}  // Smooth transition when changing status bar properties
        />
    </SafeAreaView>
    </LocationContext.Provider>
  )
}

export default weather

const styles = StyleSheet.create({
  container:{
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }, 
  pickerContainer: {
    borderColor: 'rgba(253, 71, 183, 0.23)',
    backgroundColor: 'rgba(253, 71, 183, 0.23)',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 0,
    marginVertical: 10,
    minHeight: 40,
  },
})