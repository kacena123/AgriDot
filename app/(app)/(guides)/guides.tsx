import { StyleSheet, Text, TouchableOpacity, FlatList, View, TextInput, Image, ActivityIndicator } from 'react-native'
import React, {useEffect, useState} from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar'
import { useRouter } from 'expo-router';
import { getClient } from '@kodadot1/uniquery'
import { db } from '@/services/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

type ItemProps = {
  title: string;
  dateAdded: string;
  likes: string;
  image: string;
  onPress: () => void;
};

const Item: React.FC<ItemProps> = ({ title, dateAdded, likes, image, onPress }) => (
  <TouchableOpacity onPress={onPress}>
  <View style={styles.itemContainer}>
    <Image
      source={{uri: image}}
      style={styles.image}
    />
    
    
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
  const router = useRouter();
  const guideCollectionId = process.env.EXPO_PUBLIC_GUIDE_COLLECTION_ID;
 
  const [data, setData] = useState<any[]>([]);
  const [isLenght, setIsLenght] = useState<boolean>(true);

  const [loading, setLoading] = useState(true);

  const handleItemPress = (title: string, description: string, image: string, guideID: string, owner: string ) => {
    router.push({
      pathname: '/(app)/(guides)/detailGuide',
      params: { title, description, image, guideID, owner },
    });
  };

  const handleAddGuide = () => {
    router.push({
      pathname: '/(app)/(guides)/addGuide',
    });
  };

  const getLikesCount = async (guideId: string): Promise<number> => {
    try {
      const likeRef = doc(db, 'likes', guideId);
      const likeDoc = await getDoc(likeRef);
      return likeDoc.exists() ? likeDoc.data().count : 0;
    } catch (error) {
      console.error("Error fetching likes:", error);
      return 0;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setData([]);
        const client = getClient("ahk" as any)
        const query = client.itemListByCollectionId(guideCollectionId);

        try{
          const result = await client.fetch<any>(query);

          const fetchedData = result.data?.items;

          for (let i = 0; i < fetchedData.length; i++) {
            const item = fetchedData[i];
            const metdataIpfsUrl = item.metadata.replace("ipfs://", "https://"+process.env.EXPO_PUBLIC_GATEWAY_URL+"/ipfs/");
            const metadataResponse = await fetch(metdataIpfsUrl);
            const metadata = await metadataResponse.json();
            if (metadata.external_url === "agridot-web3") {
              const image = metadata.image.replace("ipfs://", "https://"+process.env.EXPO_PUBLIC_GATEWAY_URL+"/ipfs/");
              const likes = await getLikesCount(item.id);
              const owner = metadata.owner;
              setData(data => [...data, { 
                id: item.id, title: metadata.name, 
                dateAdded: new Date(item.createdAt).toLocaleDateString(), 
                description: metadata.description, 
                image: image, 
                likes: likes,
                owner: owner
              }]); 
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
        

        <FlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Item 
              title={item.title} 
              dateAdded={item.dateAdded}
              likes={item.likes}
              image={item.image}
              onPress={() => handleItemPress(item.title, item.description, item.image, item.id, item.owner)} 
            />
          )}
        />
        
        <TouchableOpacity 
          style={styles.roundButton} 
          onPress={() => { handleAddGuide() }}
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