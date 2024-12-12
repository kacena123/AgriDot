import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddCrop from './addCrop'; // Adjust the path based on the file location
import * as ImagePicker from 'expo-image-picker';
import { SecureStorage } from '@/services/secureStorage';
import { pinataService } from '@/services/pinata';

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  launchImageLibraryAsync: jest.fn(),
}));

jest.mock('expo-font', () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn().mockReturnValue(true),
  isLoading: jest.fn().mockReturnValue(false),
}));

jest.mock('@/services/secureStorage', () => ({
  SecureStorage: {
    getSecretPhrase: jest.fn(),
    getSecretPassword: jest.fn(),
  },
}));

jest.mock('@/services/pinata', () => ({
  pinataService: {
    uploadFile: jest.fn(),
    uploadJSON: jest.fn(),
  },
}));

jest.mock('@polkadot/api', () => ({
  ApiPromise: {
    create: jest.fn().mockResolvedValue({
      tx: {
        nfts: {
          mint: jest.fn(() => ({ signAndSend: jest.fn() })),
          setMetadata: jest.fn(() => ({ signAndSend: jest.fn() })),
        },
      },
      query: {
        nfts: {
          item: { entries: jest.fn().mockResolvedValue([]) },
        },
      },
      registry: {
        findMetaError: jest.fn(),
      },
    }),
  },
  Keyring: jest.fn().mockImplementation(() => ({
    addFromUri: jest.fn(() => ({ address: 'mockAddress' })),
  })),
}));

describe('addCrop Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component correctly', () => {
    const { getByText, getByPlaceholderText } = render(<AddCrop />);
    expect(getByText('Upload Image')).toBeTruthy();
    expect(getByText('Crop Name:')).toBeTruthy();
    expect(getByText('Harvest date:')).toBeTruthy();
    expect(getByPlaceholderText('Enter crop name')).toBeTruthy();
    expect(getByText('Add Crop')).toBeTruthy();
  });

  });
