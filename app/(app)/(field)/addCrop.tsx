import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Image, Platform, Modal, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar'
import CustomButton from '@/components/CustomButton'
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

import { SecureStorage } from '@/services/secureStorage';
import { ApiPromise, Keyring, WsProvider } from "@polkadot/api";
import "@polkadot/api-augment";
import { getClient } from "@kodadot1/uniquery";
import { pinataService } from "@/services/pinata";
import { SubmittableExtrinsic } from "@polkadot/api-base/types";
import CryptoJS from "react-native-crypto-js";
import { router } from 'expo-router';


const addCrop = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);

  const [cropName, setCropName] = useState("");

  const [storedPhrase, setStoredPhrase] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const address = process.env.EXPO_PUBLIC_RECIPIENT_ADDRESS;

  const [isLoading, setIsLoading] = useState(false);
  const [showCreatingdModal, setShowCreatingdModal] = useState(false);
  const [showSuccesfuldModal, setShowSuccesfuldModal] = useState(false);

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

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

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
      //aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);  // Access the correct field for the image URI
      setMimeType(result.assets[0].mimeType || "image/jpeg"); // Set the MIME type of the image
    }
  };

  const handleCropCreate = async () => {

    if (!storedPhrase) {
      throw new Error("SECRET_KEY is not defined in the environment variables");
    }
    const wallet = new Keyring({ type: 'sr25519' });
    const AgriDotSigner = wallet.addFromUri(storedPhrase);

    console.log("creating crop");

    //Get field collection ID (Pass it from the UI)
    //Na teraz hardkodnem
    const fieldCollectionId = 29; //Vytiahneme z metadat fieldu ktory si pouzivatel zvoli (Ked nan klikne posles si do druheho komponentu jeho id z metadat)
    const privateCol = true; //Tiez sa zisti z metadat kolekcie.


    //Choose crop name
    if(!cropName) {
      console.log("Crop name is required");
      return;
    }
    //Add crop description
    if(!date) {
      console.log("Crop description is required");
      return;
    }

    
    //Add crop photo
        //Upload the details to IPFS
        try {
        
          //Load image from the device
          

          //Tu by mozno bolo dat aj daky error ked cancelol ze image je povinny.
  
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
            name: cropName,
            description: date.toLocaleDateString(),
            image: "ipfs://"+res.ipfsHash, //Tu tiez pri obrazkoch treba dat ipfs://ipfs_hash a potom hodit nazad na env.EXPO_PUBLIC_GATEWAY_URL/ipfs/ipfs_hash
            animation_url: "",
            attributes: [],
            external_url: "agridot-web3",
            type: mimeType,
          });

        //See if field is private (Ma privatny tag [Private] v hashoch) (If private then create private crops else create public crops)
        if (privateCol) {
          if (!password) {
            throw new Error("Password is required for private collections");
          }

          const description = date.toLocaleDateString(); // Message to hash
          const img = "ipfs://" + res.ipfsHash; // Image URL
          const name = cropName;
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
            if(privateCol) {
              if (!password) {
                throw new Error("Password is required for private collections");
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
            const wsProvider = new WsProvider('wss://asset-hub-paseo-rpc.dwellir.com');
            const api = await ApiPromise.create({ provider: wsProvider });

            let nextItemId = 0;

            //Get next empty item id:
              try {
            
                const items = await api.query.nfts.item.entries(fieldCollectionId.toString());
                const formattedItems = items.map(([key, value]) => {
                  const itemId = key.args.map(arg => arg.toHuman());
                  const itemDetails = value.unwrap().toHuman();
                  return [itemId, itemDetails];
                });
                
                // Ensure the next item id does not already exist
                while (formattedItems.some(item => (item[0] as string[])[1] === nextItemId.toString())) {
                  nextItemId += 1;
                }
            
              } catch (error) {
                console.log("Error getting NFT id", error);
              }

            const create = api.tx.nfts.mint(fieldCollectionId,nextItemId, AgriDotSigner.address, null);
            const assignMetadata = api.tx.nfts.setMetadata(fieldCollectionId,nextItemId, "ipfs://"+meta.ipfsHash);

            const calls: SubmittableExtrinsic<"promise">[] = [
              create,
              assignMetadata,
            ];

            console.log(nextItemId)

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
                    console.log("Crop created");
                    setShowCreatingdModal(false);
                    setShowSuccesfuldModal(true);
                  }
                }
              });
            });


        //Create crop NFT
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
      {/* Add Crop Name */}
      <Text style={{ fontFamily: 'DMSans', fontSize: 16 }}>Crop Name:</Text>
      <TextInput
        style={styles.input}
        value={cropName}
        onChangeText={setCropName}
        placeholder="Enter crop name"
        placeholderTextColor="#666"
      />
      {/* Harvest date */}
      <Text style={{ fontFamily: 'DMSans', fontSize: 16 }}>Harvest date:</Text>
      <View style={styles.datePickerContainer}>
        <TextInput
          style={styles.datePickerText}
          value={date.toLocaleDateString()}
          editable={false}
        />
        <TouchableOpacity onPress={showDatepicker}>
          <Ionicons name="calendar-outline" size={24} color="#145E2F" />
        </TouchableOpacity>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            display="default"
            onChange={onChange}
            themeVariant="light"  // Ensure it's light theme (or you can use 'dark' based on preference)
            accentColor="#145E2F" // Set the accent color to green
          />
        )}
      </View>
      {/* Add Crop Button */}
      <CustomButton title='Add Crop' 
        onPress={() => {setShowCreatingdModal(true), handleCropCreate()}}
        containerStyles={{ borderRadius: 20, height: 50, backgroundColor: '#145E2F' }}
        textStyles={{ fontSize: 18 }}
      />

      
      {/* Creating modal */}
      <Modal
          visible={showCreatingdModal}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>

              <Text style={styles.modalTitle}>Please wait, your crop is creating...</Text>
              
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

              <Text style={styles.modalTitle}>Your crop has been successfully created</Text>
              
              <View style={{paddingLeft: 10, paddingRight: 10}}>
                <CustomButton 
                  title="Close and go to my crops"
                  onPress={() => {setShowSuccesfuldModal(false), router.push('/(app)/(field)/detailField')}}
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

export default addCrop

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
    datePickerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderColor: 'rgba(253, 71, 183, 0.23)',
      backgroundColor: 'rgba(253, 71, 183, 0.23)',
      borderWidth: 1,
      borderRadius: 20,
      paddingHorizontal: 10,
      marginVertical: 10,
      minHeight: 50,
    },
    datePickerText: {
      fontFamily: 'DMSans',
      fontSize: 16,
      color: '#000',
    },
    fullImage: {
      width: '100%',   // Make image fit the entire container width
      height: '100%',  // Make image fit the entire container height
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