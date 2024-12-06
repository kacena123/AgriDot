import { StyleSheet, Text, View, ScrollView, Image, Modal, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native'
import React, { useLayoutEffect, useEffect, useState  } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native'
import CustomButton from '@/components/CustomButton';
import { StatusBar } from 'expo-status-bar'
import { SecureStorage } from '@/services/secureStorage';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { useSession } from '@/context/ctx';
import { FontAwesome6 } from '@expo/vector-icons';

const detailPest = () => {
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
  
      const wsProvider = new WsProvider('wss://asset-hub-paseo-rpc.dwellir.com');
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
      
    }

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
        {/* Image of pest */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
            <Image source={require('@/assets/images/pest1.jpg')} style={{width: 350, height: 200}}  />
        </View>


        {/* Text */}
        <Text style={styles.text}>
            Crop: Lettuce{'\n'}
            Observation:{'\n'}
            Aphids detected on 10% of plants.
            Small clusters (5-15 aphids) mainly on leaf undersides.
            Some wilting and yellowing observed.{'\n'}
            Actions Taken:{'\n'}
            Manually removed aphids; pruned infested leaves.
            Applied neem oil to affected plants.
        </Text>

      {/* Mark fake pest report Button */}
      <CustomButton title='Mark fake pest report' 
        onPress={() => {navigation.navigate('(pests)/reportPest')}}
        containerStyles={{ borderRadius: 20, height: 50, backgroundColor: '#145E2F' }}
        textStyles={{ fontSize: 18 }}
      />

      {/* Send thank to reporter Button */}
      <CustomButton title='Send thank to reporter' 
        onPress={() => {setShowDonateModal(true)}}
        containerStyles={{ borderRadius: 20, height: 50, marginTop: 20 }}
        textStyles={{ fontSize: 18 }}
      />

      {/* Status bar */}
      <StatusBar style="light" backgroundColor='#145E2F'/>

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

              <Text style={styles.modalTitle}>Donate to to the pest reporter</Text>
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
              <Text style={styles.modalText}>Your donation has been send to the pest reporter.</Text>

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

export default detailPest

const styles = StyleSheet.create({
    wrapper: {
        padding: 20,
    },
    text: {
        fontFamily: 'DMSans',
        fontSize: 16,
        marginLeft: 10,
        marginBottom: 20,
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