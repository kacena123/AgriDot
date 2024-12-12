// Import dependencies
import * as SecureStore from 'expo-secure-store';
import { SecureStorage } from './secureStorage';

// Mock SecureStore
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

describe('SecureStorage', () => {
  const secretPhrase = 'mySecretPhrase';
  const secretPassword = 'mySecretPassword';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test storeSecretPhrase
  test('storeSecretPhrase stores a secret phrase and returns true', async () => {
    (SecureStore.setItemAsync as jest.Mock).mockResolvedValueOnce(undefined);

    const result = await SecureStorage.storeSecretPhrase(secretPhrase);

    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('secretPhrase', secretPhrase);
    expect(result).toBe(true);
  });

  test('storeSecretPhrase handles errors and returns false', async () => {
    (SecureStore.setItemAsync as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));

    const result = await SecureStorage.storeSecretPhrase(secretPhrase);

    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('secretPhrase', secretPhrase);
    expect(result).toBe(false);
  });

  // Test getSecretPhrase
  test('getSecretPhrase retrieves the stored secret phrase', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(secretPhrase);

    const result = await SecureStorage.getSecretPhrase();

    expect(SecureStore.getItemAsync).toHaveBeenCalledWith('secretPhrase');
    expect(result).toBe(secretPhrase);
  });

  test('getSecretPhrase handles errors and returns null', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockRejectedValueOnce(new Error('Retrieval error'));

    const result = await SecureStorage.getSecretPhrase();

    expect(SecureStore.getItemAsync).toHaveBeenCalledWith('secretPhrase');
    expect(result).toBeNull();
  });

  // Test updateSecretPhrase
  test('updateSecretPhrase updates the secret phrase', async () => {
    (SecureStore.setItemAsync as jest.Mock).mockResolvedValueOnce(undefined);

    const result = await SecureStorage.updateSecretPhrase(secretPhrase);

    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('secretPhrase', secretPhrase);
    expect(result).toBe(true);
  });

  // Test removeSecretPhrase
  test('removeSecretPhrase removes the secret phrase and returns true', async () => {
    (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValueOnce(undefined);

    const result = await SecureStorage.removeSecretPhrase();

    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('secretPhrase');
    expect(result).toBe(true);
  });

  test('removeSecretPhrase handles errors and returns false', async () => {
    (SecureStore.deleteItemAsync as jest.Mock).mockRejectedValueOnce(new Error('Deletion error'));

    const result = await SecureStorage.removeSecretPhrase();

    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('secretPhrase');
    expect(result).toBe(false);
  });

  // Test storeSecretPassword
  test('storeSecretPassword stores a secret password and returns true', async () => {
    (SecureStore.setItemAsync as jest.Mock).mockResolvedValueOnce(undefined);

    const result = await SecureStorage.storeSecretPassword(secretPassword);

    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('password', secretPassword);
    expect(result).toBe(true);
  });

  test('storeSecretPassword handles errors and returns false', async () => {
    (SecureStore.setItemAsync as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));

    const result = await SecureStorage.storeSecretPassword(secretPassword);

    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('password', secretPassword);
    expect(result).toBe(false);
  });

  // Test getSecretPassword
  test('getSecretPassword retrieves the stored password', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(secretPassword);

    const result = await SecureStorage.getSecretPassword();

    expect(SecureStore.getItemAsync).toHaveBeenCalledWith('password');
    expect(result).toBe(secretPassword);
  });

  test('getSecretPassword handles errors and returns null', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockRejectedValueOnce(new Error('Retrieval error'));

    const result = await SecureStorage.getSecretPassword();

    expect(SecureStore.getItemAsync).toHaveBeenCalledWith('password');
    expect(result).toBeNull();
  });

  // Test updateSecretPassword
  test('updateSecretPassword updates the password', async () => {
    (SecureStore.setItemAsync as jest.Mock).mockResolvedValueOnce(undefined);

    const result = await SecureStorage.updateSecretPassword(secretPassword);

    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('password', secretPassword);
    expect(result).toBe(true);
  });

  // Test removeSecretPassword
  test('removeSecretPassword removes the password and returns true', async () => {
    (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValueOnce(undefined);

    const result = await SecureStorage.removeSecretPassword();

    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('password');
    expect(result).toBe(true);
  });

  test('removeSecretPassword handles errors and returns false', async () => {
    (SecureStore.deleteItemAsync as jest.Mock).mockRejectedValueOnce(new Error('Deletion error'));

    const result = await SecureStorage.removeSecretPassword();

    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('password');
    expect(result).toBe(false);
  });
});
