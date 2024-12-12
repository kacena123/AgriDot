import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useSession } from '@/context/ctx';
import { useRouter } from 'expo-router';
import { SecureStorage } from '@/services/secureStorage';
import LogInScreen from '../login';

jest.mock('@/context/ctx', () => ({
  useSession: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@/services/secureStorage', () => ({
  SecureStorage: {
    getSecretPhrase: jest.fn().mockReturnValue(Promise.resolve(null)),
    storeSecretPhrase: jest.fn(),
  },
}));

beforeAll(() => {
  global.alert = jest.fn();
});

describe('LogInScreen', () => {
  const mockLogIn = jest.fn();
  const mockSignIn = jest.fn();
  const mockRouterReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useSession as jest.Mock).mockReturnValue({
      signIn: mockSignIn,
      logIn: mockLogIn,
      replace: mockRouterReplace,
    });

    (useRouter as jest.Mock).mockReturnValue({
      replace: mockRouterReplace,
    });
  });

  it('renders the LogInScreen correctly', () => {
    const { getByText } = render(<LogInScreen />);
    expect(getByText('Connect Wallet')).toBeTruthy();
  });

  it('opens the modal when "Connect Wallet" is pressed', () => {
    const { getByText, queryByText } = render(<LogInScreen />);
    fireEvent.press(getByText('Connect Wallet'));
    expect(queryByText('Enter Secret Key')).toBeTruthy();
  });

  it('does not save an invalid secret phrase', () => {
    const { getByText, getByPlaceholderText } = render(<LogInScreen />);
    fireEvent.press(getByText('Connect Wallet'));
    fireEvent.changeText(getByPlaceholderText('Enter 12 to 24 words separated by spaces'), 'invalid phrase');
    fireEvent.press(getByText('Confirm'));
    expect(SecureStorage.storeSecretPhrase).not.toHaveBeenCalled();
  });

  it('saves a valid secret phrase and redirects', async () => {
    (SecureStorage.storeSecretPhrase as jest.Mock).mockResolvedValue(true);

    const { getByText, getByPlaceholderText } = render(<LogInScreen />);
    fireEvent.press(getByText('Connect Wallet'));
    fireEvent.changeText(
      getByPlaceholderText('Enter 12 to 24 words separated by spaces'),
      'word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12'
    );
    fireEvent.press(getByText('Confirm'));

    await waitFor(() => {
      expect(SecureStorage.storeSecretPhrase).toHaveBeenCalledWith(
        'word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12'
      );
      expect(mockSignIn).toHaveBeenCalled();
      expect(mockRouterReplace).toHaveBeenCalledWith('/(app)');
    });
  });

  it('redirects to the app if a stored phrase is found on mount', async () => {
    (SecureStorage.getSecretPhrase as jest.Mock).mockResolvedValue('existing phrase');

    render(<LogInScreen />);

    await waitFor(() => {
      expect(mockLogIn).toHaveBeenCalled();
      expect(mockRouterReplace).toHaveBeenCalledWith('/(app)');
    });
  });
});
