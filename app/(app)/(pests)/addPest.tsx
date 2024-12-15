import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Image, Modal, ActivityIndicator, ListRenderItem, Platform } from 'react-native'
import React, {useEffect} from 'react'
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar'
import CustomButton from '@/components/CustomButton'
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Picker } from '@react-native-picker/picker';
import { SecureStorage } from '@/services/secureStorage';

import { ApiPromise, Keyring, WsProvider } from "@polkadot/api";
import "@polkadot/api-augment";
import { pinataService } from "@/services/pinata";
import { SubmittableExtrinsic } from "@polkadot/api-base/types";
import CryptoJS from "react-native-crypto-js";
import { router } from 'expo-router';


const addPest = () => {
    const [pestName, setPestName] = useState<string>('');
    const [pestDescription, setPestDescription] = useState<string>('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [mimeType, setMimeType] = useState<string | null>(null);

    const [storedPhrase, setStoredPhrase] = useState<string | null>(null);
    const address = process.env.EXPO_PUBLIC_RECIPIENT_ADDRESS || '';

    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [showCreatingdModal, setShowCreatingdModal] = useState(false);
    const [showSuccesfuldModal, setShowSuccesfuldModal] = useState(false);
    const [showFaileddModal, setShowFaileddModal] = useState(false);

    const [feeAmount, setFeeAmount] = useState(0);
    const [approvalHandlers, setApprovalHandlers] = useState<{
      handleApprove: () => void;
      handleReject: () => void;
    } | null>(null);

  // Fetch the stored secret phrase
  useEffect(() => {
    const fetchStoredPhrase = async () => {
      const phrase = await SecureStorage.getSecretPhrase();
      setStoredPhrase(phrase);
    };

    fetchStoredPhrase();
  }, []);

  // Function to handle image picking
  const pickImage = async () => {
    // Request permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }
    // Open image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);  
      setMimeType(result.assets[0].mimeType || "image/jpeg"); 
    }
  };

  // Function to get user's current location
  const useMyLocation = async () => {
    // Request permission to access location
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }
    // Get current location
    let location = await Location.getCurrentPositionAsync({});
    setLatitude(location.coords.latitude.toString());
    setLongitude(location.coords.longitude.toString());
  };

  // Function to wait for user approval
  const waitForApproval = () => {
    return new Promise<boolean>((resolve) => {
      setShowApprovalModal(true);
      
      const handleApprove = () => {
        setShowApprovalModal(false);
        resolve(true);
      };
  
      const handleReject = () => {
        setShowApprovalModal(false);
        resolve(false);
      };
  
      setApprovalHandlers({ handleApprove, handleReject });
    });
  };

  const handlePestReport = async () => {
    if (!storedPhrase) {
      throw new Error("SECRET_KEY is not defined in the environment variables");
    }
    const wallet = new Keyring({ type: 'sr25519' });
    const AgriDotSigner = wallet.addFromUri(storedPhrase);

    console.log("creating pest");
   
    //Collection ID
    const pestCollectionId = 29; 

    //Pest name
    if (!pestName) {
      console.log("Pest name is required");
      return;
    }

    //Pest description
    if (!pestDescription) {
      console.log("Pest description is required");
      return;
    }

    if (!latitude || !longitude) {
      console.log("Pest location is required");
      return;
    }

    try {
      // Generate a filename
      const filename = `upload-${Date.now()}${Platform.OS === "ios" ? ".jpg" : ""}`;
      // Check if an image is selected
      if (!selectedImage) {
        throw new Error("No image selected");
      }
      // Upload to Pinata
      const res = await pinataService.uploadFile(
        selectedImage,
        filename,
        mimeType || "image/jpeg",
      );
       
      const description = '[Location]' +latitude + " " + longitude + '[Description]' + pestDescription; 
      const img = "ipfs://" + res.ipfsHash; 
      const name = pestName;
      const type = mimeType || '';

      let body = JSON.stringify({
        name: name,
        description: description,
        image: img, 
        animation_url: "",
        attributes: [],
        external_url: "agridot-web3",
        type: type,
      });


      const meta = await pinataService.uploadJSON(body);

      const fetchedData = await fetch(meta.pinataUrl);
      const data = await fetchedData.json();

        const wsProvider = new WsProvider(process.env.EXPO_PUBLIC_WS_ENDPOINT);
        const api = await ApiPromise.create({ provider: wsProvider });

        let nextItemId = 0;
        const create = api.tx.nfts.mint(pestCollectionId,nextItemId, AgriDotSigner.address, null);
        const assignMetadata = api.tx.nfts.setMetadata(pestCollectionId,nextItemId, "ipfs://"+meta.ipfsHash);

        const calls: SubmittableExtrinsic<"promise">[] = [
          create,
          assignMetadata,
        ];

        const batchAllTx = api.tx.utility.batchAll(calls);
        const batchAllTxFee = await batchAllTx.paymentInfo(AgriDotSigner);
        const feeText = batchAllTxFee.partialFee.toHuman().replace(/,/g, '');
        const feeNumber = Math.ceil(parseFloat(feeText) * 1.05).toString();

        setFeeAmount(Number(feeNumber) / 1000000000000);

        // Wait for user approval to send the fee
        const userApproval = await waitForApproval();

        if (!userApproval) {
          setShowCreatingdModal(false)
          console.log("Transaction rejected");
          return;
        }
        
        console.log("Transaction approved");
        setShowTransactionModal(true)
  
        const call = api.tx.balances.transferKeepAlive(address, feeNumber);
        
        //Encrypt metadata for secure communication
        if (!process.env.EXPO_PUBLIC_ENCRYPT_PHRASE) {
          throw new Error("EXPO_PUBLIC_ENCRYPT_PHRASE is not defined in the environment variables");
        }
        const encryptedMeta = CryptoJS.AES.encrypt('ipfs://'+meta.ipfsHash, process.env.EXPO_PUBLIC_ENCRYPT_PHRASE).toString();

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
                      setShowTransactionModal(false);
                      setShowCreatingdModal(true)
                      //further will happen on the server
                      const resp = await fetch(process.env.EXPO_PUBLIC_SERVER_URL+'/agridot/pest', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          owner: AgriDotSigner.address,
                          metadata: encryptedMeta,
                        }),
                      }
                      )
                      const respJson = await resp.json();

                      setShowCreatingdModal(false);
                      if (respJson.status === "Success") {
                        console.log("Pest report creation successful");
                        setShowSuccesfuldModal(true);
                      }
                      else if (respJson.status === "Failed") {
                        console.log("Pest report creation failed");
                        setShowFaileddModal(true);
                      }
                  }
                }
              });
            });

    //Create pest NFT
  } catch (error) {
    console.log(error);
  }
  };

  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      {/* Upload Image */}
      <TouchableOpacity style={styles.container} onPress={pickImage}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.fullImage} />
        ) : (
          <>
            <Ionicons name="cloud-upload" size={32} color="green" />
            <Text style={styles.text}>Upload Image</Text>
          </>
        )}
      </TouchableOpacity>
      {/* Add Pest Name */}
      <Text style={{ fontFamily: 'DMSans', fontSize: 16 }}>Pest Name:</Text>
      <TextInput
        style={styles.input}
        value={pestName}
        onChangeText={setPestName}
        placeholder="Enter pest name"
        placeholderTextColor="#666"
      />
      {/* Add Pest Coordinates */}
      <Text style={{ fontFamily: 'DMSans', fontSize: 16 }}>Latitude:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter pest latitude"
        placeholderTextColor="#666"
        value={latitude} 
        onChangeText={setLatitude} 
      />
      <Text style={{ fontFamily: 'DMSans', fontSize: 16 }}>Longitude:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter pest longitude"
        placeholderTextColor="#666"
        value={longitude} 
        onChangeText={setLongitude} 
      />
      {/* Use My Location button */}
      <CustomButton 
        title='Use My Location' 
        onPress={useMyLocation}
        containerStyles={{ borderRadius: 20, height: 50, marginBottom: 20 }}
        textStyles={{ fontSize: 16 }} 
      />

      {/* Add Pest Description */}
      <Text style={{ fontFamily: 'DMSans', fontSize: 16 }}>Description:</Text>
      <TextInput
        style={styles.input_description}
        value={pestDescription}
        onChangeText={setPestDescription}
        placeholder="Enter description"
        placeholderTextColor="#666"
        multiline
      />

      {/* Add Crop Button */}
      <CustomButton title='Create Pest' 
        onPress={() => { setShowCreatingdModal(true), handlePestReport()}}
        containerStyles={{ borderRadius: 20, height: 50, backgroundColor: '#145E2F' }}
        textStyles={{ fontSize: 18 }}
      />

{ /* Approval modal */}
      <Modal
          visible={showApprovalModal}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>

              <Text style={styles.modalTitle}>Approval to send the fee for creating a pest</Text>
              <Text style={styles.modalText}>You are about to send {feeAmount} KSM to create a pest</Text>

              <View style={{paddingLeft: 10, paddingRight: 10}}>
              <CustomButton 
                  title="Reject"
                  onPress={() => {approvalHandlers?.handleReject()}}
                  containerStyles={{ height: 50, backgroundColor: '#145E2F' }}
                  textStyles={{ fontSize: 16 }}
                />
                <CustomButton 
                  title="Approve"
                  onPress={() => {approvalHandlers?.handleApprove()}}
                  containerStyles={{ height: 50 }}
                  textStyles={{ fontSize: 16 }}
                />
              </View>
            </View>
          </View>
      </Modal>

      {/* Transaction modal */}
      <Modal
          visible={showTransactionModal}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>

              <Text style={styles.modalTitle}>Please wait, transaction is in progress...</Text>
              
              <View style={{alignItems: 'center'}}>
                <ActivityIndicator size="large" color="#FD47B7" />
              </View>
            </View>
          </View>
      </Modal>

      {/* Creating modal */}
      <Modal
          visible={showCreatingdModal}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>

              <Text style={styles.modalTitle}>Please wait, your pest is creating...</Text>
              
              <View style={{alignItems: 'center'}}>
                <ActivityIndicator size="large" color="#FD47B7" />
              </View>
            </View>
          </View>
      </Modal>

      { /* Successful modal */}
      <Modal
          visible={showSuccesfuldModal}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>

              <Text style={styles.modalTitle}>Your pest has been successfully created</Text>
              
              <View style={{paddingLeft: 10, paddingRight: 10}}>
                <CustomButton 
                  title="Close and go to pests"
                  onPress={() => {setShowSuccesfuldModal(false), router.push('/(app)/(tabs)/pests')}}
                  containerStyles={{ height: 50,}}
                  textStyles={{ fontSize: 16 }}
                />
              </View>
            </View>
          </View>
      </Modal>

      { /* Failed modal */}
      <Modal
          visible={showFaileddModal}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>

              <Text style={styles.modalTitle}>Something went wrong, your guide has not been created</Text>
              
              <View style={{paddingLeft: 10, paddingRight: 10}}>
                <CustomButton 
                  title="Close and go to guides"
                  onPress={() => {setShowSuccesfuldModal(false), router.push('/(app)/(tabs)/pests')}}
                  containerStyles={{ height: 50,}}
                  textStyles={{ fontSize: 16 }}
                />
              </View>
            </View>
          </View>
      </Modal>

      {/* Status bar */}
      <StatusBar style="light" backgroundColor='#145E2F'/>
    </ScrollView>
  )
}

export default addPest

const styles = StyleSheet.create({
    wrapper: {
        padding: 20,
      },
      container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(20, 94, 47, 0.2)',
        borderRadius: 20,
        height: 160,
        marginBottom: 20,
      },
      text: {
        fontFamily: 'DMSans',
        marginLeft: 10,
        fontSize: 16,
      },
      input: {
        fontFamily: 'DMSans',
        borderColor: 'rgba(253, 71, 183, 0.23)',
        backgroundColor: 'rgba(253, 71, 183, 0.23)',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10,
        marginVertical: 10,
        minHeight: 50,
        fontSize: 16,
      },
      input_description: {
        height: 180,
        fontFamily: 'DMSans',
        borderColor: 'rgba(253, 71, 183, 0.23)',
        backgroundColor: 'rgba(253, 71, 183, 0.23)',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10,
        marginVertical: 10,
        minHeight: 180,
        fontSize: 16,
        textAlignVertical: 'top',
        paddingVertical: 10,
      },
      pickerContainer: {
        borderColor: 'rgba(253, 71, 183, 0.23)',
        backgroundColor: 'rgba(253, 71, 183, 0.23)',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10,
        marginVertical: 10,
        minHeight: 50,
    },
      fullImage: {
        width: '100%',   
        height: '100%', 
        borderRadius: 20,
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