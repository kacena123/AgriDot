// Import dependencies
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { useStorageState } from './useStorageState';
import { renderHook, act, waitFor } from '@testing-library/react-native';


// Mock SecureStore
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  getItemAsync: jest.fn().mockResolvedValue(null),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

const key = 'testKey';
const value = 'testValue';

describe('useStorageState', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Platform.OS = 'ios'; // Default to non-web platform for tests
  });

  afterEach(() => {
    if (global.localStorage) {
      (global as Partial<typeof global>).localStorage = undefined;
    }
  });

  test('retrieves value from SecureStore on non-web platforms', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValueOnce(value);

    const { result } = renderHook(() => useStorageState(key));

    await waitFor(() => expect(result.current[0]).toEqual([false, value]));

    expect(SecureStore.getItemAsync).toHaveBeenCalledWith(key);
  });

  test('retrieves value from localStorage on web platforms', async () => {
    Platform.OS = 'web';
    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: jest.fn(() => value),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      configurable: true,
    });

    const { result } = renderHook(() => useStorageState(key));

    await waitFor(() => {
      expect(global.localStorage.getItem).toHaveBeenCalledWith(key);
      expect(result.current[0]).toEqual([false, value]);
    });
  });

  test('sets value using localStorage on web platforms', async () => {
    Platform.OS = 'web';
    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      configurable: true,
    });

    const { result } = renderHook(() => useStorageState(key));

    await act(() => {
      result.current[1](value);
    });

    expect(global.localStorage.setItem).toHaveBeenCalledWith(key, value);
    expect(result.current[0]).toEqual([false, value]);
  });

  test('deletes value using SecureStore on non-web platforms', async () => {
    const { result } = renderHook(() => useStorageState(key));

    await act(() => {
      result.current[1](null);
    });

    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(key);
    expect(result.current[0]).toEqual([false, null]);
  });

  test('deletes value using localStorage on web platforms', async () => {
    Platform.OS = 'web';
    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      configurable: true,
    });

    const { result } = renderHook(() => useStorageState(key));

    await act(async () => {
      result.current[1](null);
    });

    expect(global.localStorage.removeItem).toHaveBeenCalledWith(key);
    expect(result.current[0]).toEqual([false, null]);
  });
});
