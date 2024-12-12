import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import React from 'react';
import AddPest from './addPest';
import { SecureStorage } from '@/services/secureStorage';
import { pinataService } from "@/services/pinata";
import * as ImagePicker from 'expo-image-picker';

jest.mock('@/services/secureStorage');
jest.mock('@/services/pinata');
jest.mock('expo-image-picker');
jest.mock('expo-router');
jest.mock('expo-font', () => ({
    isLoaded: jest.fn(() => true),
    loadAsync: jest.fn()
}));

describe('addPest', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders all form elements', () => {
        const { getByText, getByPlaceholderText } = render(<AddPest />);
        
        expect(getByText('Upload Image')).toBeTruthy();
        expect(getByText('Pest Name:')).toBeTruthy();
        expect(getByText('Location:')).toBeTruthy();
        expect(getByText('Description:')).toBeTruthy();
        expect(getByPlaceholderText('Enter pest name')).toBeTruthy();
        expect(getByPlaceholderText('Enter description')).toBeTruthy();
    });

    it('handles image upload', async () => {
        const { getByText } = render(<AddPest />);
        
        const mockResult = {
            canceled: false,
            assets: [{uri: 'test-uri', mimeType: 'image/jpeg'}]
        };
        
        (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue(mockResult);
        (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });

        fireEvent.press(getByText('Upload Image'));

        await waitFor(() => {
            expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
        });
    });

    it('handles form input changes', () => {
        const { getByPlaceholderText } = render(<AddPest />);
        
        const nameInput = getByPlaceholderText('Enter pest name');
        const descInput = getByPlaceholderText('Enter description');

        fireEvent.changeText(nameInput, 'Test Pest');
        fireEvent.changeText(descInput, 'Test Description');

        expect(nameInput.props.value).toBe('Test Pest');
        expect(descInput.props.value).toBe('Test Description');
    });
});