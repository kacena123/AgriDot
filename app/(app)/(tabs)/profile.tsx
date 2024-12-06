import { ScrollView, StyleSheet, Text, View, Image, ImageBackground, SafeAreaView, Modal, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Link } from 'expo-router'
import CustomButton from '@/components/CustomButton'
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { useSession } from '@/context/ctx';
import { SecureStorage } from '@/services/secureStorage'
import { FontAwesome6 } from '@expo/vector-icons'


const profile = () => {

  const { signOut } = useSession();

  const [storedPhrase, setStoredPhrase] = useState<string | null>(null);

  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showThankingModal, setShowThankingModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState('1');

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchStoredPhrase = async () => {
      const phrase = await SecureStorage.getSecretPhrase();
      setStoredPhrase(phrase);
    };

    fetchStoredPhrase();
  }, []);

  const donate = async () => {
    setIsLoading(true);

    const wsProvider = new WsProvider('wss://asset-hub-paseo-rpc.dwellir.com');
    const api = await ApiPromise.create({ provider: wsProvider });

    const address = process.env.EXPO_PUBLIC_RECIPIENT_ADDRESS;
    console.log(address, "address")

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
    <ScrollView style={styles.wrapper}>
    <SafeAreaView>
      <View style={{ width: '100%' }}>
        <Image
          source={require('@/assets/images/green_rectangle.png')}
          style={styles.topImage}
          resizeMode="cover"
        />
        <Image
          source={require('@/assets/images/secured_by_polkadot.png')}
          style={styles.topImageOverlay}
          resizeMode="contain"
        />
      </View>

      <View style={styles.imageRow}>
        <ImageBackground
          source={require('@/assets/images/Polygon1.png')}
          style={styles.sideImage}
          resizeMode="contain"
        />
        <ImageBackground
          source={require('@/assets/images/Polygon2.png')}
          style={styles.sideImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.text}>Don't know what Polkadot is?</Text>
        <Text style={styles.textLink}> <Link href='https://polkadot.network/'>Click here to learn more.</Link></Text>
      </View>

      <View style={{ alignItems: 'center', marginTop: 200 }}>
        <Image
          source={require('@/assets/images/Agridot_logo.png')}
          style={{ width: 300, height: 70 }}
          resizeMode="contain"
        />
      </View>

      <View style={styles.textContainer2}>
                <Text style={styles.text2}>Want to support our app?</Text>
                <CustomButton 
                  title='Donate' 
                  onPress={() => {console.log('donate'), setShowDonateModal(true) } }
                  containerStyles={{ height: 55, marginTop: 10 }}
                  textStyles={{ fontSize: 18, fontFamily: 'DMSans' }}
                />
                <CustomButton 
                  title='Log out' 
                  onPress={() => {
                    console.log('logout');
                    signOut();
                  }} 
                  containerStyles={{ backgroundColor: '#145E2F', height: 55, marginTop: 30 }}
                  textStyles={{ fontSize: 18, fontFamily: 'DMSans' }}
                />
              </View>

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

              <Text style={styles.modalTitle}>Donate to AgriDot</Text>
              <Text style={styles.modalText}>AgriDot is a non-profit app, so every amount helps us improve the app.</Text>
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
            
              <Text style={styles.modalTitle}>Thank you for your support 
                <Text>  </Text>
                <FontAwesome6 name="heart" size={24} color="#FD47B7" />
              </Text>
              <Text style={styles.modalText}>Your donation has been received.</Text>

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

      <StatusBar style="light" backgroundColor='#145E2F'/>
    </SafeAreaView>
    </ScrollView>
  )
}

export default profile

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    flex: 1,
  },
  textContainer: {
    marginTop: 60,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  textContainer2: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 18,
    fontFamily: 'DMSans',
  },
  text2: {
    fontSize: 18,
    fontFamily: 'DMSans',
    marginTop: 40,
  },
  textLink: {
    fontSize: 18,
    fontFamily: 'DMSans',
    color: '#FD47B7',
    textDecorationLine: 'underline',
  },
  topImage: {
    width: '100%',
    height: 100,
    position: 'absolute',
    top: 0,
  },
  topImageOverlay: {
    alignSelf: 'center',
    top: 40,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    position: 'absolute',
    marginTop: 50,
  },
  sideImage: {
    width: 150,
    height: 450,
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