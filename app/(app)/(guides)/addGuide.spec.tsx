import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import * as ImagePicker from 'expo-image-picker';
import { SecureStorage } from '@/services/secureStorage';
import { pinataService } from '@/services/pinata';
import { ApiPromise } from "@polkadot/api";
import AddGuide from './addGuide';

jest.mock('@/services/secureStorage', () => ({
    SecureStorage: {
        getSecretPhrase: jest.fn(() => Promise.resolve('test-phrase')),
    },
}));

beforeEach(() => {
jest.mock('@/services/secureStorage', () => ({
    getSecretPhrase: jest.fn(() => Promise.resolve('test-phrase')),
}));
}, 15000); // Increase timeout to 15 seconds

beforeEach(() => {
    jest.clearAllMocks();
    (SecureStorage.getSecretPhrase as jest.Mock).mockResolvedValue('test-phrase');
});
jest.mock('expo-image-picker', () => ({
    requestMediaLibraryPermissionsAsync: jest.fn(),
    launchImageLibraryAsync: jest.fn(),
}));

jest.mock('expo-font', () => ({
    loadAsync: jest.fn(),
    isLoaded: jest.fn(() => true),
}));

jest.mock('@/services/pinata', () => ({
    pinataService: {
        uploadFile: jest.fn(),
        uploadJSON: jest.fn(),
    },
}));

jest.mock('@polkadot/api', () => {
    const actualApi = jest.requireActual('@polkadot/api');
    return {
        ...actualApi,
        ApiPromise: {
            create: jest.fn(),
        },
        Keyring: jest.fn().mockImplementation(() => ({
            addFromUri: jest.fn(),
        })),
        WsProvider: jest.fn(),
    };
});

jest.mock('react-native-crypto-js', () => ({
    AES: {
        encrypt: jest.fn(),
    },
}));

describe('addGuide', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly', async () => {
        const { getByText, getByPlaceholderText } = render(<AddGuide />);
        expect(getByText('Upload Image')).toBeTruthy();
        expect(getByPlaceholderText('Enter guide title')).toBeTruthy();
        expect(getByPlaceholderText('Enter text here')).toBeTruthy();
        expect(getByText('Create Guide')).toBeTruthy();
    });

    it('handles image picking and guide creation', async () => {
        (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
        (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
            canceled: false,
            assets: [{ uri: 'test-uri', mimeType: 'image/jpeg' }],
        });
    
        (ApiPromise.create as jest.Mock).mockResolvedValue({
            tx: {
                nfts: {
                    mint: jest.fn().mockReturnValue({}),
                    setMetadata: jest.fn().mockReturnValue({}),
                },
                utility: {
                    batchAll: jest.fn().mockReturnValue({
                        paymentInfo: jest.fn().mockResolvedValue({ partialFee: { toHuman: jest.fn().mockReturnValue('1') } }),
                    }),
                },
                balances: {
                    transferKeepAlive: jest.fn().mockReturnValue({}),
                },
            },
            registry: {
                findMetaError: jest.fn().mockReturnValue({ docs: [], name: '', section: '' }),
            },
        });
        (SecureStorage.getSecretPhrase as jest.Mock).mockResolvedValue('test-phrase');
        (pinataService.uploadFile as jest.Mock).mockResolvedValue({ ipfsHash: 'test-hash' });
        (pinataService.uploadJSON as jest.Mock).mockResolvedValue({ ipfsHash: 'test-meta-hash' });
    
        const { getByText, getByPlaceholderText } = render(<AddGuide />);
        fireEvent.press(getByText('Upload Image'));
    
        await waitFor(() => {
            expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
            expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
        });
    
        fireEvent.changeText(getByPlaceholderText('Enter guide title'), 'Test Guide');
        fireEvent.changeText(getByPlaceholderText('Enter text here'), 'Test Description');
        fireEvent.press(getByText('Create Guide'));
    
        await waitFor(() => {
            expect(SecureStorage.getSecretPhrase).toHaveBeenCalledTimes(1);
            expect(pinataService.uploadFile).toHaveBeenCalledTimes(1);
            expect(pinataService.uploadJSON).toHaveBeenCalledTimes(1);
        });
    });
    
    });
