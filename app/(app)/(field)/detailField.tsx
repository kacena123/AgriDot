import { TouchableOpacity, StyleSheet, Text, View, Image, FlatList, ActivityIndicator } from 'react-native'
import React, { useLayoutEffect, useState, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SecureStorage } from '@/services/secureStorage';
import { useRouter } from 'expo-router';
import { Keyring } from '@polkadot/api'
import { getClient } from '@kodadot1/uniquery'
import CryptoJS from "react-native-crypto-js";

type ItemProps = {
  title: string;
  harvest: string;
  image: string;
  onPress: () => void;
};

const Item: React.FC<ItemProps> = ({ title, harvest, image, onPress }) => (
  <TouchableOpacity onPress={onPress}>
  <View style={styles.itemContainer}>
    {/* Icon or Image on the Left */}
    <Image
      source={{uri: image}}
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
  const navigation = useNavigation();
  const route = useRoute();
  const { fieldTitle, fieldID, isPrivate } = route.params as { fieldTitle: string, fieldID: string, isPrivate: string };
  const [loading, setLoading] = useState(true);

  const [storedPhrase, setStoredPhrase] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [isLenght, setIsLenght] = useState<boolean>(true);

  // Fetch the stored secret phrase
  useEffect(() => {
    const fetchStoredPhrase = async () => {
      const phrase = await SecureStorage.getSecretPhrase();
      setStoredPhrase(phrase);
      const password = await SecureStorage.getSecretPassword();
      setPassword(password);
    };
    fetchStoredPhrase();
  }, []);

  // Dynamically set the header title
  useLayoutEffect(() => {
    navigation.setOptions({
    headerTitle: fieldTitle,  // Set the header title to the item's title
    });
  }, [navigation, fieldTitle]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setData([]);
        const client = getClient("ahk" as any)
        const wallet = new Keyring({ type: 'sr25519' });
        const userWallet = wallet.addFromUri(await SecureStorage.getSecretPhrase() as string);
        //Convert to Kusama addr
        const kusamaAddr = wallet.encodeAddress(userWallet.address, 2) ;
        console.log("toto je field id " + fieldID);
        const query = client.itemListByCollectionIdAndOwner(fieldID, kusamaAddr);

        try{
          const result = await client.fetch<any>(query);

          const fetchedData = result.data?.items;

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
                  const decriptTitle = CryptoJS.AES.decrypt(title, password).toString(CryptoJS.enc.Utf8);
                  const decriptDescription = CryptoJS.AES.decrypt(description, password).toString(CryptoJS.enc.Utf8);
                  let decriptImage = CryptoJS.AES.decrypt(image, password).toString(CryptoJS.enc.Utf8);
                  decriptImage = decriptImage.replace("ipfs://", "https://"+process.env.EXPO_PUBLIC_GATEWAY_URL+"/ipfs/");

                  setData(data => [...data, { id: item.id, title: decriptTitle, harvest: decriptDescription, image: decriptImage }]);
                }
              }
              // If the field is public
              else { 
                const image = metadata.image.replace("ipfs://", "https://"+process.env.EXPO_PUBLIC_GATEWAY_URL+"/ipfs/");
                setData(data => [...data, { id: item.id, title: metadata.name, harvest: metadata.description, image: image }]);
              }
            }
          }
          if(fetchedData.length === 0){
            setIsLenght(false);
          }

        } catch (error) {
          console.error('Error fetching data:', error);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);


  const handleItemPress = (cropTitle: string, cropID: string) => {
    router.push({
      pathname: '/(app)/(field)/cropOrigin',
      params: { cropTitle, cropID }
    });
  };

  const handleAddCrop = (fieldID: string, isPrivate: string) => {
    router.push({
      pathname: '/(app)/(field)/addCrop',
      params: { fieldID, isPrivate }
    });
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
        {!isLenght && (
          <View style={styles.container}>
            <Text style={styles.title}>You have no crops for this field</Text>
          </View>
        )}
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Item 
              title={item.title} 
              harvest={item.harvest} 
              image={item.image}
              onPress={() => handleItemPress(item.title, item.id)} 
            />
          )}
        />
        
        <TouchableOpacity 
          style={styles.roundButton} 
          onPress={() => handleAddCrop(fieldID, isPrivate)}
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
    borderRadius: 5,
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