import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, ScrollView, Platform, Modal, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar'
import CustomButton from '@/components/CustomButton'
import { Ionicons } from '@expo/vector-icons';
import { SecureStorage } from '@/services/secureStorage';

import { ApiPromise, Keyring, WsProvider } from "@polkadot/api";
import "@polkadot/api-augment";
import { pinataService } from "@/services/pinata";
import { SubmittableExtrinsic } from "@polkadot/api-base/types";
import CryptoJS from "react-native-crypto-js";
import { router } from 'expo-router';


const addGuide = () => {

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);

  const [guideTitle, setGuideTitle] = useState("");
  const [guideDescription, setGuideDescription] = useState("");

  const [storedPhrase, setStoredPhrase] = useState<string | null>(null);
  const address = process.env.EXPO_PUBLIC_RECIPIENT_ADDRESS || "";

  const [showApprovaldModal, setShowApprovaldModal] = useState(false);
  const [showCreatingdModal, setShowCreatingdModal] = useState(false);
  const [showSuccesfuldModal, setShowSuccesfuldModal] = useState(false);

  const [feeAmount, setFeeAmount] = useState(0);

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
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);  
      setMimeType(result.assets[0].mimeType || "image/jpeg");
    }
  };

  const handleGuideCreate = async () => {
    if (!storedPhrase) {
      throw new Error("SECRET_KEY is not defined in the environment variables");
    }
    const wallet = new Keyring({ type: 'sr25519' });
    const AgriDotSigner = wallet.addFromUri(storedPhrase);

    const guideCollectionId = 29;

    //Guide title
    if (!guideTitle) {
      console.log("Guide title is required");
      return;
    }

    //Guide decsription
    if (!guideDescription) {
      console.log("Guide description is required");
      return;
    }

    try {
       // Generate a filename
       const filename = `upload-${Date.now()}${Platform.OS === "ios" ? ".jpg" : ""}`;
       console.log("Filename is", filename);
       console.log("Selected image is", selectedImage);
       console.log("Mime type is", mimeType);
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

       let body = JSON.stringify({
        name: guideTitle,
        description: guideDescription,
        image: "ipfs://"+res.ipfsHash, 
        attributes: [],
        external_url: "agridot-web3",
        type: mimeType,
      });

      const meta = await pinataService.uploadJSON(body);
      console.log("Uploaded to Pinata", meta);

        const wsProvider = new WsProvider('wss://asset-hub-paseo-rpc.dwellir.com');
        const api = await ApiPromise.create({ provider: wsProvider });

        let nextItemId = 0;
        const create = api.tx.nfts.mint(guideCollectionId,nextItemId, AgriDotSigner.address, null);
        const assignMetadata = api.tx.nfts.setMetadata(guideCollectionId,nextItemId, "ipfs://"+meta.ipfsHash);

        const calls: SubmittableExtrinsic<"promise">[] = [
          create,
          assignMetadata,
        ];

        const batchAllTx = api.tx.utility.batchAll(calls);
        const batchAllTxFee = await batchAllTx.paymentInfo(AgriDotSigner);
        const feeText = batchAllTxFee.partialFee.toHuman().replace(/,/g, '');
        const feeNumber = Math.ceil(parseFloat(feeText) * 1.05).toString();

        setShowApprovaldModal(true);
        

        if (!address) {
          throw new Error("Recipient address is not defined");
        }
        const call = api.tx.balances.transferKeepAlive(address, feeNumber);

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
                      console.log(txHash.toString());
                      console.log("HI");
                      //further will happen on the server
                  }
                }
              });
            });


    //Create guide NFT
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
      <View style={styles.wrapper}>
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

        {/* Add Guide Title */}
        <Text style={{ fontFamily: 'DMSans', fontSize: 16 }}>Guide Title:</Text>
        <TextInput
          style={styles.input}
          value={guideTitle}
          onChangeText={setGuideTitle}
          placeholder="Enter guide title"
          placeholderTextColor="#666"
        />

        {/* Add Guide Description */}
        <Text style={{ fontFamily: 'DMSans', fontSize: 16 }}>Text:</Text>
        <TextInput
          style={styles.input_description}
          value={guideDescription}
          onChangeText={setGuideDescription}
          placeholder="Enter text here"
          placeholderTextColor="#666"
          multiline
        />

        {/* Create Button */}
        <CustomButton title='Create Guide' 
          onPress={() => { setShowCreatingdModal(true), handleGuideCreate() }}
          containerStyles={{ borderRadius: 20, height: 50, backgroundColor: '#145E2F' }}
          textStyles={{ fontSize: 18 }}
        />
      </View>

      { /* Approval modal */}
      <Modal
          visible={showApprovaldModal}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>

              <Text style={styles.modalTitle}>Approval to send the fee for creating a guide</Text>
              <Text style={styles.modalText}>You are about to send {feeAmount} DOT to create a guide</Text>

              <View style={{paddingLeft: 10, paddingRight: 10}}>
              <CustomButton 
                  title="Reject"
                  onPress={() => {setShowApprovaldModal(false)}}
                  containerStyles={{ height: 50, backgroundColor: '#145E2F' }}
                  textStyles={{ fontSize: 16 }}
                />
                <CustomButton 
                  title="Approve"
                  onPress={() => {}}
                  containerStyles={{ height: 50 }}
                  textStyles={{ fontSize: 16 }}
                />
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

              <Text style={styles.modalTitle}>Please wait, your guide is creating...</Text>
              
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

              <Text style={styles.modalTitle}>Your guide has been successfully created</Text>
              
              <View style={{paddingLeft: 10, paddingRight: 10}}>
                <CustomButton 
                  title="Close and go to guides"
                  onPress={() => {setShowSuccesfuldModal(false), router.push('/(app)/(tabs)/guides')}}
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

export default addGuide

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  wrapper: {
    padding: 20,
    width: '100%',
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
    minHeight: 230,
    fontSize: 16,
    textAlignVertical: 'top',
    paddingVertical: 10,
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