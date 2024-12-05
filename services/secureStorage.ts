import * as SecureStore from 'expo-secure-store';

const STORAGE_KEY = 'secretPhrase';

export const SecureStorage = {
  async storeSecretPhrase(phrase: string): Promise<boolean> {
    try {
      await SecureStore.setItemAsync(STORAGE_KEY, phrase);
      return true;
    } catch (error) {
      console.error('Error storing secret phrase:', error);
      return false;
    }
  },

  async getSecretPhrase(): Promise<string | null> {
    try {
      const phrase = await SecureStore.getItemAsync(STORAGE_KEY);
      return phrase;
    } catch (error) {
      console.error('Error retrieving secret phrase:', error);
      return null;
    }
  },

  async updateSecretPhrase(newPhrase: string): Promise<boolean> {
    return await this.storeSecretPhrase(newPhrase);
  },

  async removeSecretPhrase(): Promise<boolean> {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error removing secret phrase:', error);
      return false;
    }
  }
};