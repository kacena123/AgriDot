import { StyleSheet, Text, View, ScrollView, Image, Modal, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native'
import React, { useLayoutEffect, useEffect, useState  } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native'
import CustomButton from '@/components/CustomButton';
import { StatusBar } from 'expo-status-bar'
import { SecureStorage } from '@/services/secureStorage';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { db } from '@/services/firebaseConfig';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const detailPest = () => {
    const route = useRoute();
    const router = useRouter();
    const navigation = useNavigation();
    const { title } = route.params as { title: string };  // Extract title from route params
    console.log('Title:', title); 

    const [storedPhrase, setStoredPhrase] = useState<string | null>(null);

    const [showDonateModal, setShowDonateModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showThankingModal, setShowThankingModal] = useState(false);
    const [donationAmount, setDonationAmount] = useState('1');
    const [showReportModal, setShowReportModal] = useState(false);
    
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

    // Update the type definition to include all passed params
    const { description, fields, distances, date, image, pestID, owner } = route.params as { 
      title: string;
      description: string;
      fields: string | string[];
      distances: string;
      date: string;
      image: string;
      pestID: string;
      owner: string;
    };

    // get the fields and distances to arrays
    const fieldsArray = Array.isArray(fields) ? fields : fields.split(',');
    const distancesArray = Array.isArray(distances) ? distances : distances.split(',');
    // get distances from fields to string for description
    let stringFieldsDistance = "";
    const getFieldsDistance = async () => {
      for (let i = 0; i < fieldsArray.length; i++) {
      const field = fieldsArray[i];
      const distance = parseFloat(distancesArray[i]).toFixed(2); // Round to 2 decimal places
      stringFieldsDistance = stringFieldsDistance + (field + ": " + distance +  " km\n");
      }
    }

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
  getFieldsDistance();

  const sendReportPest = async (pestID: string) => {
    try {
      const reportRef = doc(db, 'reports-pests', pestID);
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
      console.log(`Successfully reported pest: ${pestID}`);
    } catch (error) {
      console.error("Error reporting pest:", error);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
        {/* Image of pest */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
            <Image source={{uri: image}} style={{width: '100%', height: 200, borderRadius: 20}}  />
        </View>

        {/* Date */}
        <Text style={styles.text}>
            <Text style={styles.textBold}>Date of creation:</Text>  
            {date}
        </Text>

        {/* Distances from fields */}
        <Text style={styles.textBold}>
            Distances from fields: {'\n'}
        </Text>
        <Text style={styles.text}>
          {stringFieldsDistance}
        </Text>

        {/* Text */}
        <Text style={styles.textBold}>
            Description:
        </Text>
        <Text style={styles.text}>
            {description}
        </Text>

      {/* Mark fake pest report Button */}
      <CustomButton title='Mark fake pest report' 
        onPress={() => {setShowReportModal(true)}}
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
            
              <Text style={styles.modalTitle}>Are you sure you want to report this pest?</Text>

              <View style={{paddingLeft: 50, paddingRight: 50}}>
                <CustomButton 
                  title="Report"
                  onPress={() => {setShowReportModal(false), sendReportPest(pestID)}}
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
    textBold: { 
        fontSize: 16,
        marginLeft: 10,
        fontWeight: 'bold',
        fontFamily: 'DMSans',
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