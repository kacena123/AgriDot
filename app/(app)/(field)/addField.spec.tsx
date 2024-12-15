import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddField from './addField'; // Adjust the path based on the file location
import * as ImagePicker from 'expo-image-picker';

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
        getSecretPassword: jest.fn().mockImplementation(() => Promise.resolve(null)),
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
                    create: jest.fn(() => ({ signAndSend: jest.fn() })),
                    setCollectionMetadata: jest.fn(() => ({ signAndSend: jest.fn() })),
                },
            },
            query: {
                nfts: {
                    nextCollectionId: jest.fn().mockResolvedValue({ unwrap: jest.fn().mockReturnValue({ toNumber: jest.fn().mockReturnValue(1) }) }),
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

describe('addField Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the component correctly', () => {
        const { getByText, getByPlaceholderText } = render(<AddField />);
        expect(getByText('Upload Image')).toBeTruthy();
        expect(getByText('Field Name:')).toBeTruthy();
        expect(getByText('Latitude:')).toBeTruthy();
        expect(getByText('Longitude:')).toBeTruthy();
        expect(getByPlaceholderText('Enter field name')).toBeTruthy();
        expect(getByText('Add Field')).toBeTruthy();
    });

    it('handles image picking correctly', async () => {
        const { getByText } = render(<AddField />);
        const uploadButton = getByText('Upload Image');
        (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
            canceled: false,
            assets: [{ uri: 'test-uri', mimeType: 'image/jpeg' }],
        });

        fireEvent.press(uploadButton);

        await waitFor(() => {
            expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
        });
    });


});