import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Image, Platform, Modal, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar'
import CustomButton from '@/components/CustomButton'
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { SecureStorage } from '@/services/secureStorage';
import Checkbox from 'expo-checkbox';

import { ApiPromise, Keyring, WsProvider } from "@polkadot/api";
import "@polkadot/api-augment";
import { pinataService } from "@/services/pinata";
import { SubmittableExtrinsic } from "@polkadot/api-base/types";
import CryptoJS from "react-native-crypto-js";
import { router } from 'expo-router';

const addField = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);

  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const [fieldName, setFieldName] = useState("");

  const [storedPhrase, setStoredPhrase] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const address = process.env.EXPO_PUBLIC_RECIPIENT_ADDRESS;

  const [isPrivate, setIsPrivate] = useState(false); 

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showCreatingdModal, setShowCreatingdModal] = useState(false);
  const [showSuccesfuldModal, setShowSuccesfuldModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  
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

  // Function to handle field creation
  const handleFieldCreate = async () => {

    if (isPrivate) {
      if (!password) {
        setShowPasswordModal(true);
        return;
      }
      else {
        console.log("Password is set: ", password);
      }
    }

    if (!storedPhrase) {
      throw new Error("SECRET_KEY is not defined in the environment variables");
    }
    const wallet = new Keyring({ type: 'sr25519' });
    const AgriDotSigner = wallet.addFromUri(storedPhrase);

    console.log("creating field");
        //Choose field name
        if (fieldName === "" || fieldName === null || fieldName === undefined) {
          console.log("Field name is required");
          return;
        }
        console.log("Field name is", fieldName);

        //Choose field location
        if (latitude === "" || latitude === null || latitude === undefined) {
          console.log("Field name is required");
          return;
        }
        console.log("Field latitude", latitude);

        if (longitude === "" || longitude === null || longitude === undefined) {
          console.log("Field name is required");
          return;
        }
        console.log("Field longitude", longitude);

        //Upload the details to IPFS
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
            name: fieldName,
            description: latitude + " " + longitude,
            image: "ipfs://"+res.ipfsHash, 
            animation_url: "",
            attributes: [],
            external_url: "agridot-web3",
            type: mimeType,
          });

          if (isPrivate) {

            if (!password) {
              setShowPasswordModal(true);
              return;
            }

            const description = latitude + " " + longitude; 
            const img = "ipfs://" + res.ipfsHash; 
            const name = fieldName;
            const type = mimeType || '';

            let encryptedDesc = CryptoJS.AES.encrypt(description, password).toString();
            let encryptedImg = CryptoJS.AES.encrypt(img, password).toString();
            let encryptedName = CryptoJS.AES.encrypt(name, password).toString();
            let encryptedType = CryptoJS.AES.encrypt(type, password).toString();

           body = JSON.stringify({
             name: "[Private]"+encryptedName,
             description: "[Private]"+encryptedDesc,
             image: "[Private]"+encryptedImg,
             animation_url: "",
             attributes: [],
             external_url: "agridot-web3",
             type: "[Private]"+encryptedType,
           });
         }

        const meta = await pinataService.uploadJSON(body);
        console.log("Uploaded to Pinata", meta);

          const fetchedData = await fetch(meta.pinataUrl);
          const data = await fetchedData.json();
          
          if(isPrivate) {
            if (!password) {
              setShowPasswordModal(true);
              return;
            }

            let bytes = CryptoJS.AES.decrypt(data.name.replace("[Private]", ""), password);
            let originalName = bytes.toString(CryptoJS.enc.Utf8);
            bytes  = CryptoJS.AES.decrypt(data.description.replace("[Private]", ""), password);
            let originalDescription = bytes.toString(CryptoJS.enc.Utf8);
            bytes  = CryptoJS.AES.decrypt(data.image.replace("[Private]", ""), password);
            let originalImage = bytes.toString(CryptoJS.enc.Utf8);
            bytes  = CryptoJS.AES.decrypt(data.type.replace("[Private]", ""), password);
            let originalType = bytes.toString(CryptoJS.enc.Utf8);

            console.log("Decrypted name", originalName);
            console.log("Decrypted description", originalDescription);
            console.log("Decrypted image", originalImage);
            console.log("Decrypted type", originalType);
          }
          const wsProvider = new WsProvider(process.env.EXPO_PUBLIC_WS_ENDPOINT);
          const api = await ApiPromise.create({ provider: wsProvider });

          const config = {
            settings: 0,
            mintSettings: {
              mintType: { Issuer: null },
              defaultItemSettings: 0,
            },
          };

          const create = api.tx.nfts.create(AgriDotSigner.address,config);
          const nextCollectionId = await api.query.nfts.nextCollectionId();
          const collectionId = nextCollectionId.unwrap().toNumber();

          const asignMeta = api.tx.nfts.setCollectionMetadata(collectionId, "ipfs://"+meta.ipfsHash);

          const calls: SubmittableExtrinsic<"promise">[] = [
            create,
            asignMeta,
          ];

          const batchAllTx = api.tx.utility.batchAll(calls);

          await new Promise((resolve, reject) => {
            batchAllTx.signAndSend(AgriDotSigner, async ({ status, dispatchError }) => {
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
                  console.log("Field created");
                  setShowCreatingdModal(false);
                  setShowSuccesfuldModal(true);
                  setIsLoading(false);
                }
              }
            });
          });

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
      {/* Private Field Checkbox */}
      <View style={styles.checkboxContainer}>
        <Checkbox
          value={isPrivate}
          onValueChange={setIsPrivate}
          style={styles.checkbox}
          color={'#145E2F'}
        />
        <Text style={styles.label}>Make Field Private</Text>
      </View>
      {/* Add Field Name */}
      <Text style={{ fontFamily: 'DMSans', fontSize: 16 }}>Field Name:</Text>
      <TextInput
        style={styles.input}
        value={fieldName}
        onChangeText={setFieldName}
        placeholder="Enter field name"
        placeholderTextColor="#666"
      />
      {/* Add Field Coordinates */}
      <Text style={{ fontFamily: 'DMSans', fontSize: 16 }}>Latitude:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter field latitude"
        placeholderTextColor="#666"
        value={latitude} 
        onChangeText={setLatitude} 
      />
      <Text style={{ fontFamily: 'DMSans', fontSize: 16 }}>Longitude:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter field longitude"
        placeholderTextColor="#666"
        value={longitude} 
        onChangeText={setLongitude} 
      />
      {/* Use My Location button */}
      <CustomButton 
        title='Use My Lcation' 
        onPress={useMyLocation}
        containerStyles={{ borderRadius: 20, height: 50, marginBottom: 20 }}
        textStyles={{ fontSize: 16 }} 
      />
      
      {/* Add Field Button */}
      {isLoading ? (
        <View style={{ borderRadius: 20, height: 50, backgroundColor: '#145E2F', alignItems: 'center', marginTop: 10, width: '100%', padding: 5 }}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
          ) : (
        <CustomButton title='Add Field' 
          onPress={() => { setIsLoading(true), setShowCreatingdModal(true), handleFieldCreate() }}
          containerStyles={{ borderRadius: 20, height: 50, backgroundColor: '#145E2F' }}
          textStyles={{ fontSize: 18 }}
        />
      )}


      {/* Password modal */}
      <Modal
          visible={showPasswordModal}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              
              {/* Close button */}
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowPasswordModal(false)}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>

              <Text style={styles.modalTitle}>You have not created a password</Text>
              <Text style={styles.modalText}>To create a password to hash your private field, go to the profile screen</Text>
              
              <View style={{paddingLeft: 50, paddingRight: 50}}>
                <CustomButton 
                  title="Go to Profile"
                  onPress={() => router.push('/(app)/(tabs)/profile')}
                  containerStyles={{ height: 50,}}
                  textStyles={{ fontSize: 18 }}
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

              <Text style={styles.modalTitle}>Please wait, your field is creating...</Text>
              
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

              <Text style={styles.modalTitle}>Your field has been successfully created</Text>
              
              <View style={{paddingLeft: 10, paddingRight: 10}}>
                <CustomButton 
                  title="Close and go to my fields"
                  onPress={() => {setShowSuccesfuldModal(false), router.push('/(app)/(tabs)')}}
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

export default addField

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
  fullImage: {
    width: '100%',   
    height: '100%',
    borderRadius: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    fontFamily: 'DMSans',
    margin: 8,
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