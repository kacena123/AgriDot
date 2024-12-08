import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, SafeAreaView, ImageBackground, Image, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar'
import { Link, useRouter } from 'expo-router'
import CustomButton from '@/components/CustomButton';

import { SecureStorage } from '@/services/secureStorage';
import { useSession } from '@/context/ctx';


const LogInScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [secretPhrase, setSecretPhrase] = useState('');
  const router = useRouter();
  const { signIn, logIn } = useSession();

  // Add useEffect to check stored phrase
  useEffect(() => {
    const checkStoredPhrase = async () => {
      const storedPhrase = await SecureStorage.getSecretPhrase();
      if (storedPhrase) {
        console.log('Found stored secret phrase');
        logIn();
        router.replace('/(app)');
      }
    };

    checkStoredPhrase();
  }, []); // Empty dependency array - runs once on mount


  const handleConnectWallet = () => {
    setIsModalVisible(true);
  };

  const handleSavePhrase = async () => {
    const words = secretPhrase.trim().split(' ');
    if (words.length == 12 || words.length == 24) {
      alert('Please enter exactly 12 to 24 words');
      return;
    }

    const success = await SecureStorage.storeSecretPhrase(secretPhrase);
    if (success) {
      console.log('Secret phrase saved');
      setIsModalVisible(false);
      signIn();
      router.replace('/(app)');
      console.log('Secret phrase saved');
    }
    else {
      alert('Error saving secret phrase');
      console.error('Error saving secret phrase');
    }
  };

  return (
    <ScrollView style={styles.wrapper}>
      <SafeAreaView>
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

        <View style={{ alignItems: 'center', marginTop: 350 }}>
          <Image
            source={require('@/assets/images/Agridot_logo.png')}
            style={{ width: 350, height: 90 }}
            resizeMode="contain"
          />
        </View>

        <View style={styles.container}>
          <CustomButton
            onPress={handleConnectWallet}
            title={"Connect Wallet"}
            containerStyles={{ backgroundColor: '#145E2F', height: 55, marginTop: 30 }}
            textStyles={{ fontSize: 20, fontFamily: 'DMSans' }}
          />
          <Text style={{ marginTop: 30, fontFamily: 'DMSans', fontSize: 18 }}>
            Don't know what wallet is?
          </Text>
          <Text style={styles.textLink}>
            <Link href='https://polkadot.com/get-started/wallets'>Click here to find out.</Link>
          </Text>
          <View style={{ alignItems: 'center' }}>
          <Image
            source={require('@/assets/images/Secured_by_polkadot_white.png')}
            style={{ width: 200, height: 80 }}
            resizeMode="contain"
          />
        </View>
        </View>

        <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Enter Secret Key</Text>
            <Text style={styles.subtitle}>Please enter your 12-24 word secret key of your wallet</Text>

            <TextInput
              style={styles.input}
              multiline
              numberOfLines={4}
              value={secretPhrase}
              onChangeText={setSecretPhrase}
              placeholder="Enter 12 to 24 words separated by spaces"
              secureTextEntry
              autoCorrect={false}
            />

            <View style={styles.buttonColumn}>
              <CustomButton
                title="Cancel"
                onPress={() => setIsModalVisible(false)}
                textStyles={{ fontSize: 16}}
                containerStyles={{ backgroundColor: '#145E2F', height: 48 }}
              />
              <CustomButton
                title="Confirm"
                onPress={handleSavePhrase}
                textStyles={{ fontSize: 16}}
                containerStyles={{ height: 48 }}
              />
            </View>
          </View>
        </View>
      </Modal>
        
        <StatusBar style="light" backgroundColor='#145E2F'/>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    flex: 1,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    position: 'absolute',
    marginTop: -130,
  },
  sideImage: {
    width: 180,
    height: 550,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    padding: 20,
  },
  textLink: {
    fontSize: 18,
    fontFamily: 'DMSans',
    color: '#FD47B7',
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'DMSans',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'DMSans',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    minHeight: 100,
    textAlignVertical: 'top',
    fontFamily: 'DMSans',
  },
  buttonColumn: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
  }
});

export default LogInScreen;