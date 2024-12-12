import { StyleSheet, Text, View, ScrollView, Image , Modal, TextInput, TouchableOpacity, ActivityIndicator} from 'react-native'
import React, { useLayoutEffect, useEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '@/components/CustomButton';
import { SecureStorage } from '@/services/secureStorage';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { useSession } from '@/context/ctx';
import { FontAwesome6 } from '@expo/vector-icons';

const detailGuide = () => {

  const route = useRoute();
  const navigation = useNavigation();
  const { title } = route.params as { title: string };  // Extract title from route params
  console.log('Title:', title); 

  const [storedPhrase, setStoredPhrase] = useState<string | null>(null);

  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showThankingModal, setShowThankingModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState('1');


  const [isLoading, setIsLoading] = useState(false);

  // Fetch the stored secret phrase
  useEffect(() => {
    const fetchStoredPhrase = async () => {
      const phrase = await SecureStorage.getSecretPhrase();
      setStoredPhrase(phrase);
    };
    fetchStoredPhrase();
  }, []);

  // Dynamically set the header title
  useLayoutEffect(() => {
      navigation.setOptions({
      headerTitle: title,  // Set the header title to the item's title
      });
  }, [navigation, title]);

  const donate = async () => {
    setIsLoading(true);

    const wsProvider = new WsProvider(process.env.EXPO_PUBLIC_WS_ENDPOINT);
    const api = await ApiPromise.create({ provider: wsProvider });

    const address = process.env.EXPO_PUBLIC_RECIPIENT_ADDRESS;

    const amount = Math.floor(parseFloat(donationAmount) * 10000000000);

    const call = api.tx.balances.transferKeepAlive(address, amount);

    
    if (!storedPhrase) {
      throw new Error("SECRET_KEY is not defined in the environment variables");
    }
    const wallet = new Keyring({ type: 'sr25519' });
    const AgriDotSigner = wallet.addFromUri(storedPhrase);

    try {
      await new Promise((resolve, reject) => {
        call.signAndSend(AgriDotSigner, async ({ txHash, status, dispatchError }) => {
          if (status.isFinalized) {
            if (dispatchError) {
              if (dispatchError.isModule) {
                const decoded = api.registry.findMetaError(dispatchError.asModule);
                const { docs, name, section } = decoded;
                reject(new Error(`${section}.${name}: ${docs.join(' ')}`));
              } else {
                reject(new Error(dispatchError.toString()));
              }
            } else {
              console.log("HI");
              console.log(txHash.toString());
              setShowDonateModal(false);
              setShowConfirmModal(false);
              console.log("Transaction passed")
              setShowThankingModal(true);
            }
          }
        });
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
    
  };
  
  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <View style={styles.container}>
        <Ionicons name="image" size={50} color="#145E2F" />   
      </View>

      <Text style={styles.text}>
        Aphids are small, soft-bodied insects that can cause significant damage to your plants by sucking the sap from leaves, stems, and roots. Fortunately, there are several effective strategies you can use to prevent and control aphid infestations. Follow this guide to keep your garden aphid-free. {'\n'}
        1. Choose Aphid-Resistant Plants {'\n'}
        Plant Selection: Start by choosing varieties of plants that are less attractive to aphids. Some species are naturally resistant, making them less likely to suffer from aphid damage. {'\n'}
        Companion Planting: Consider planting aphid-repelling plants such as garlic, onions, chives, or marigolds alongside your main crops. These plants release odors that aphids dislike. {'\n'}
        2. Encourage Beneficial Insects {'\n'}
        Natural Predators: Ladybugs, lacewings, and hoverflies are natural predators of aphids. Encourage these beneficial insects by planting nectar-rich flowers like dill, fennel, and yarrow. {'\n'}
        Provide Habitat: Create a welcoming environment for beneficial insects by incorporating diverse plant species and leaving some wild areas in your garden. 
      </Text>

      <CustomButton title="Report guide" 
        onPress={() => {navigation.navigate('(guides)/reportGuide')} }
        containerStyles={{ borderRadius: 20, height: 52, backgroundColor: '#145E2F', marginTop: 30, marginBottom: 10 }}
        textStyles={{ fontSize: 18 }}
      />

      <CustomButton title="Donate and like this guide" 
        onPress={() => {setShowDonateModal(true)} }
        containerStyles={{ borderRadius: 20, height: 52 }}
        textStyles={{ fontSize: 18 }}
      />

      {/* Donate modal */}
      <Modal
          visible={showDonateModal}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              
              {/* Close button */}
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowDonateModal(false)}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>

              <Text style={styles.modalTitle}>Donate to to the guide</Text>
              <Text style={styles.modalText}>Enter the amount you wish to donate:</Text>

              <TextInput
                style={styles.input}
                value={donationAmount}
                onChangeText={setDonationAmount}
                keyboardType="numeric"
                placeholder="1 DOT"
              />
              
              <View style={{paddingLeft: 50, paddingRight: 50}}>
                <CustomButton 
                  title="Proceed"
                  onPress={() => {
                    setShowConfirmModal(true);
                  }}
                  containerStyles={{ height: 50,}}
                  textStyles={{ fontSize: 18 }}
                />
              </View>
            </View>
          </View>
        </Modal>

        {/* Confirm donation modal */}
        <Modal
          visible={showConfirmModal}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
            
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            
              <Text style={styles.modalTitle}>Confirm Donation</Text>
              <Text style={styles.modalText}>
                {isLoading ? (
                  <Text>Please wait while we process your donation...</Text>
                  ) : (
                    <Text>Are you sure you want to donate {donationAmount} DOT?</Text>
                  )
                }
              </Text>
              <View style={{paddingLeft: 50, paddingRight: 50}}>
                {isLoading ? (
                  <ActivityIndicator size="large" color="#FD47B7" />
                ) : (
                  <CustomButton 
                    title="Approve"
                    onPress={donate}
                    containerStyles={{ height: 50}}
                    textStyles={{ fontSize: 16 }}
                  />
                )}
              </View>
            </View>
          </View>
        </Modal>

        {/* Thanking modal */}
        <Modal
          visible={showThankingModal}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
            
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            
              <Text style={styles.modalTitle}>Thank you  
                <Text>  </Text>
                <FontAwesome6 name="heart" size={24} color="#FD47B7" />
              </Text>
              <Text style={styles.modalText}>Your donation has been send to the guide.</Text>

              <View style={{paddingLeft: 50, paddingRight: 50}}>
                <CustomButton 
                  title="Close"
                  onPress={() => setShowThankingModal(false)}
                  containerStyles={{ height: 50}}
                  textStyles={{ fontSize: 16 }}
                />
              </View>
            </View>
          </View>
        </Modal>
      
    </ScrollView>
  )
}

export default detailGuide

const styles = StyleSheet.create({
  wrapper: {
    padding: 20
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(20, 94, 47, 0.2)',
    borderRadius: 20,
    height: 200,
    marginBottom: 20,
  },
  text: {
    fontFamily: 'DMSans',
    marginLeft: 10,
    fontSize: 16,
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

})