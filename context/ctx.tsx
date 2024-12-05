import React, { useContext, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from './useStorageState';
import { SecureStorage } from '@/services/secureStorage';
import * as LocalAuthentication from 'expo-local-authentication';
import { Alert, Platform } from 'react-native';

interface AuthContextType {
  signIn: () => Promise<void>;
  logIn: () => Promise<void>;
  signOut: () => Promise<void>;
  session?: string | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  signIn: async () => {},
  logIn: async () => {},
  signOut: async () => {},
  session: null,
  isLoading: false,
});

export function useSession() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useSession must be wrapped in a <SessionProvider />');
  }
  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');

  const authenticateWithBiometrics = async (): Promise<boolean> => {
    try {
      // Add small delay to ensure UI is ready
      await new Promise(resolve => setTimeout(resolve, 500));

      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        return true;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Verify your identity',
        fallbackLabel: 'Use device passcode',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      return result.success;
    } catch (error) {
      return new Promise((resolve) => {
        Alert.alert(
          'Authentication Failed',
          'Would you like to try again?',
          [
            { 
              text: 'Cancel', 
              onPress: () => resolve(false),
              style: 'cancel'
            },
            { 
              text: 'Retry', 
              onPress: async () => resolve(await authenticateWithBiometrics()) 
            }
          ],
          { cancelable: false }
        );
      });
    }
  };

  const signIn = async () => {
    try {
      const storedPhrase = await SecureStorage.getSecretPhrase();
      if (!storedPhrase) {
        Alert.alert('Error', 'No secret phrase found. Please set up your wallet first.');
        throw new Error('No secret phrase found');
      }

      setSession(storedPhrase);
    } catch (error) {
      console.error('Sign in failed:', error);
      await signOut();
    }
  };

  const logIn = async () => {
    try {
      const storedPhrase = await SecureStorage.getSecretPhrase();
      if (!storedPhrase) {
        Alert.alert('Error', 'No secret phrase found. Please set up your wallet first.');
        return;
      }

      const isAuthenticated = await authenticateWithBiometrics();
      if (!isAuthenticated) {
        //Alert.alert('Authentication Required', 'Please authenticate to access the app');
        return;
      }

      setSession(storedPhrase);
    } catch (error) {
      console.error('Sign in failed:', error);
      // Don't sign out immediately, give chance to retry
      Alert.alert(
        'Authentication Failed',
        'Would you like to try again?',
        [
          { text: 'Cancel', onPress: () => signOut() },
          { text: 'Retry', onPress: () => logIn() }
        ]
      );
    }
  };

  const signOut = async () => {
    try {
      await SecureStorage.removeSecretPhrase();
      setSession(null);
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ signIn, logIn, signOut, session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
