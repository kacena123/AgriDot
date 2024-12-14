import { StyleSheet, Text, View, ScrollView, Image , Modal, TextInput, TouchableOpacity, ActivityIndicator} from 'react-native'
import React, { useLayoutEffect, useEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native'
import CustomButton from '@/components/CustomButton';
import { SecureStorage } from '@/services/secureStorage';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { db } from '@/services/firebaseConfig';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const detailGuide = () => {


  const router = useRouter();
  const route = useRoute();
  const navigation = useNavigation();
  const { title } = route.params as { title: string };  // Extract title from route params

  const [storedPhrase, setStoredPhrase] = useState<string | null>(null);

  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showThankingModal, setShowThankingModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState('1');
  const [showReportModal, setShowReportModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  // Update the type definition to include all passed params
  const { description, image, guideID, owner } = route.params as { 
    title: string;
    description: string;
    image: string;
    guideID: string;
    owner: string;
  };

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

    const address = owner;

    const amount = Math.floor(parseFloat(donationAmount) * 1000000000000);

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
              setShowDonateModal(false);
              setShowConfirmModal(false);
              console.log("Transaction passed")
              setShowThankingModal(true);
              giveLike(guideID);
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

  // Add this function to your component
  const giveLike = async (guideID: string) => {
    try {
      const likeRef = doc(db, 'likes', guideID);
      const likeDoc = await getDoc(likeRef);

      if (likeDoc.exists()) {
        // Document exists - increment likes
        await updateDoc(likeRef, {
          count: (likeDoc.data().count || 0) + 1
        });
      } else {
        // Document doesn't exist - create with count 1
        await setDoc(likeRef, {
          count: 1
        });
      }
      console.log(`Successfully liked guide`);
    } catch (error) {
      console.error("Error giving like:", error);
    }
  };

  const sendReportGuide = async (guideID: string) => {
    try {
      const reportRef = doc(db, 'reports-guides', guideID);
      const reportDoc = await getDoc(reportRef);

      if (reportDoc.exists()) {
        // Document exists - increment reports
        await updateDoc(reportRef, {
          count: (reportDoc.data().count || 0) + 1
        });
      } else {
        // Document doesn't exist - create with count 1
        await setDoc(reportRef, {
          count: 1
        });
      }
      console.log(`Successfully reported guide`);
    } catch (error) {
      console.error("Error reporting guide:", error);
    }
  }
  
  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <View style={styles.container}>
        <Image source={{ uri: image }} style={{ width: '100%', height: '100%', borderRadius: 20 }} />  
      </View>

      <Text style={styles.text}>
        {description}
      </Text>

      <CustomButton title="Report guide" 
        onPress={() => {setShowReportModal(true)} }
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
                placeholder="1 KSM"
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
                    <Text>Are you sure you want to donate {donationAmount} KSM?</Text>
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

        {/* Report modal */}
        <Modal
          visible={showReportModal}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
            
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowReportModal(false)}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            
              <Text style={styles.modalTitle}>Are you sure you want to report this guide?</Text>

              <View style={{paddingLeft: 50, paddingRight: 50}}>
                <CustomButton 
                  title="Report"
                  onPress={() => {setShowReportModal(false), sendReportGuide(guideID)}}
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