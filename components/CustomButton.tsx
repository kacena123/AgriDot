import React from 'react';
import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  containerStyles?: StyleProp<ViewStyle>;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, containerStyles }) => {
  return (
    <TouchableOpacity style={[styles.button, containerStyles && StyleSheet.flatten(containerStyles)]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 15,
    backgroundColor: '#FD47B7', // Default color
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
});

export default CustomButton;